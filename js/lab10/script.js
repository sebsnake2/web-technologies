"use strict";

const API_URL = "https://randomuser.me/api/";
const USERS_PER_PAGE = 30;
const USERS_LIMIT = 150;

const STORAGE_KEYS = {
    auth: "lab10_current_user",
    savedFriends: "lab10_saved_friends",
};

const state = {
    users: [],
    filteredUsers: [],
    visiblePages: 1,
    currentPage: 1,
    isLoading: false,
    filters: {
        search: "",
        gender: "",
        minAge: "",
        maxAge: "",
        birthYear: "",
        location: "",
        email: "",
        sort: "",
    },
};

const elements = {
    authModal: document.querySelector("#authModal"),
    authForm: document.querySelector("#authForm"),
    loginInput: document.querySelector("#loginInput"),
    passwordInput: document.querySelector("#passwordInput"),
    currentUserLabel: document.querySelector("#currentUserLabel"),
    logoutBtn: document.querySelector("#logoutBtn"),

    searchInput: document.querySelector("#searchInput"),
    genderFilter: document.querySelector("#genderFilter"),
    minAgeFilter: document.querySelector("#minAgeFilter"),
    maxAgeFilter: document.querySelector("#maxAgeFilter"),
    birthYearFilter: document.querySelector("#birthYearFilter"),
    locationFilter: document.querySelector("#locationFilter"),
    emailFilter: document.querySelector("#emailFilter"),
    sortSelect: document.querySelector("#sortSelect"),
    applyBtn: document.querySelector("#applyBtn"),
    resetBtn: document.querySelector("#resetBtn"),

    cardsContainer: document.querySelector("#cardsContainer"),
    pagination: document.querySelector("#pagination"),
    resultCounter: document.querySelector("#resultCounter"),
    statusMessage: document.querySelector("#statusMessage"),
    loader: document.querySelector("#loader"),
};

function getSavedFriends() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.savedFriends) || "[]");
}

function setSavedFriends(friends) {
    localStorage.setItem(STORAGE_KEYS.savedFriends, JSON.stringify(friends));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.auth) || "null");
}

function setCurrentUser(login) {
    localStorage.setItem(
        STORAGE_KEYS.auth,
        JSON.stringify({
            login,
            signedAt: new Date().toISOString(),
        }),
    );
}

function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.auth);
}

function showStatus(message, isError = false) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.toggle("error", isError);
}

function debounce(callback, delay = 400) {
    let timerId;

    return function debouncedFunction(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => callback.apply(this, args), delay);
    };
}

function throttle(callback, delay = 500) {
    let isWaiting = false;

    return function throttledFunction(...args) {
        if (isWaiting) {
            return;
        }

        callback.apply(this, args);
        isWaiting = true;

        setTimeout(() => {
            isWaiting = false;
        }, delay);
    };
}

function buildApiUrl() {
    const url = new URL(API_URL);

    url.searchParams.set("results", String(USERS_LIMIT));
    url.searchParams.set("seed", "lab10-burla");
    url.searchParams.set("nat", "us,gb,fr,de,es,ua");

    return url;
}

async function fetchUsers() {
    state.isLoading = true;
    elements.loader.classList.remove("hidden");
    showStatus("Loading users...");

    try {
        const response = await fetch(buildApiUrl());

        if (!response.ok) {
            throw new Error(`Request failed. Status: ${response.status}`);
        }

        const data = await response.json();

        state.users = data.results.map(normalizeUser);

        applyStateFromUrl();
        applyFilters();

        showStatus("Users loaded successfully.");
    } catch (error) {
        showStatus(`Error: ${error.message}`, true);
    } finally {
        state.isLoading = false;
        elements.loader.classList.add("hidden");
    }
}

function normalizeUser(user) {
    return {
        id: user.login.uuid,
        firstName: user.name.first,
        lastName: user.name.last,
        fullName: `${user.name.first} ${user.name.last}`,
        gender: user.gender,
        age: user.dob.age,
        birthYear: new Date(user.dob.date).getFullYear(),
        registeredDate: user.registered.date,
        email: user.email,
        phone: user.phone,
        city: user.location.city,
        country: user.location.country,
        picture: user.picture.large,
    };
}

function readFiltersFromInputs() {
    state.filters = {
        search: elements.searchInput.value.trim().toLowerCase(),
        gender: elements.genderFilter.value,
        minAge: elements.minAgeFilter.value,
        maxAge: elements.maxAgeFilter.value,
        birthYear: elements.birthYearFilter.value,
        location: elements.locationFilter.value.trim().toLowerCase(),
        email: elements.emailFilter.value.trim().toLowerCase(),
        sort: elements.sortSelect.value,
    };
}

function updateUrlFromState() {
    const url = new URL(window.location.href);

    Object.entries(state.filters).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
    });

    url.searchParams.set("page", String(state.currentPage));

    history.pushState(null, "", url);
}

function applyStateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    elements.searchInput.value = params.get("search") || "";
    elements.genderFilter.value = params.get("gender") || "";
    elements.minAgeFilter.value = params.get("minAge") || "";
    elements.maxAgeFilter.value = params.get("maxAge") || "";
    elements.birthYearFilter.value = params.get("birthYear") || "";
    elements.locationFilter.value = params.get("location") || "";
    elements.emailFilter.value = params.get("email") || "";
    elements.sortSelect.value = params.get("sort") || "";

    state.currentPage = Number(params.get("page")) || 1;
    state.visiblePages = state.currentPage;

    readFiltersFromInputs();
}

function applyFilters(shouldPushUrl = true) {
    readFiltersFromInputs();

    let users = [...state.users];

    if (state.filters.search) {
        users = users.filter((user) =>
            user.fullName.toLowerCase().includes(state.filters.search),
        );
    }

    if (state.filters.gender) {
        users = users.filter((user) => user.gender === state.filters.gender);
    }

    if (state.filters.minAge) {
        users = users.filter(
            (user) => user.age >= Number(state.filters.minAge),
        );
    }

    if (state.filters.maxAge) {
        users = users.filter(
            (user) => user.age <= Number(state.filters.maxAge),
        );
    }

    if (state.filters.birthYear) {
        users = users.filter(
            (user) => user.birthYear === Number(state.filters.birthYear),
        );
    }

    if (state.filters.location) {
        users = users.filter((user) => {
            const location = `${user.city} ${user.country}`.toLowerCase();

            return location.includes(state.filters.location);
        });
    }

    if (state.filters.email) {
        users = users.filter((user) =>
            user.email.toLowerCase().includes(state.filters.email),
        );
    }

    users = sortUsers(users, state.filters.sort);

    state.filteredUsers = users;
    state.currentPage = Math.min(state.currentPage, getTotalPages()) || 1;
    state.visiblePages = Math.max(state.visiblePages, state.currentPage);

    if (shouldPushUrl) {
        updateUrlFromState();
    }

    render();
}

function sortUsers(users, sortType) {
    const sorted = [...users];

    const sortMap = {
        "name-asc": () =>
            sorted.sort((a, b) => a.fullName.localeCompare(b.fullName)),
        "name-desc": () =>
            sorted.sort((a, b) => b.fullName.localeCompare(a.fullName)),
        "age-asc": () => sorted.sort((a, b) => a.age - b.age),
        "age-desc": () => sorted.sort((a, b) => b.age - a.age),
        "registered-asc": () =>
            sorted.sort(
                (a, b) =>
                    new Date(a.registeredDate) - new Date(b.registeredDate),
            ),
        "registered-desc": () =>
            sorted.sort(
                (a, b) =>
                    new Date(b.registeredDate) - new Date(a.registeredDate),
            ),
    };

    if (sortMap[sortType]) {
        sortMap[sortType]();
    }

    return sorted;
}

function getTotalPages() {
    return Math.ceil(state.filteredUsers.length / USERS_PER_PAGE);
}

function getVisibleUsers() {
    return state.filteredUsers.slice(0, state.visiblePages * USERS_PER_PAGE);
}

function render() {
    renderCards();
    renderPagination();

    elements.resultCounter.textContent = `${state.filteredUsers.length} users found. Showing ${getVisibleUsers().length}.`;
}

function renderCards() {
    const savedIds = getSavedFriends();
    const visibleUsers = getVisibleUsers();

    if (!visibleUsers.length) {
        elements.cardsContainer.innerHTML =
            '<p class="muted">No users found. Try changing filters.</p>';
        return;
    }

    elements.cardsContainer.innerHTML = visibleUsers
        .map((user) => {
            const isSaved = savedIds.includes(user.id);

            return `
      <article class="user-card">
        <div class="card-top"></div>

        <div class="avatar-wrap">
          <img src="${user.picture}" alt="${user.fullName}" loading="lazy">
        </div>

        <div class="card-body">
          <h3>${user.fullName}</h3>

          <div class="info">
            <span>${user.age} years old • ${user.gender.toUpperCase()}</span>
            <span>${user.city}, ${user.country}</span>
            <span>${user.email}</span>
            <span>${user.phone}</span>
            <span>Registered: ${formatDate(user.registeredDate)}</span>
          </div>

          <button class="save-btn ${isSaved ? "saved" : ""}" data-id="${user.id}">
            ${isSaved ? "Saved friend" : "Save friend"}
          </button>
        </div>
      </article>
    `;
        })
        .join("");
}

function renderPagination() {
    const totalPages = getTotalPages();

    if (totalPages <= 1) {
        elements.pagination.innerHTML = "";
        return;
    }

    let html = "";

    for (let page = 1; page <= totalPages; page += 1) {
        html += `
      <button class="page-btn ${page === state.currentPage ? "active" : ""}" data-page="${page}">
        ${page}
      </button>
    `;
    }

    elements.pagination.innerHTML = html;
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(dateString));
}

function toggleSavedFriend(userId) {
    const savedIds = getSavedFriends();
    const isSaved = savedIds.includes(userId);

    const updatedSavedIds = isSaved
        ? savedIds.filter((id) => id !== userId)
        : [...savedIds, userId];

    setSavedFriends(updatedSavedIds);
    renderCards();
}

function resetFilters() {
    elements.searchInput.value = "";
    elements.genderFilter.value = "";
    elements.minAgeFilter.value = "";
    elements.maxAgeFilter.value = "";
    elements.birthYearFilter.value = "";
    elements.locationFilter.value = "";
    elements.emailFilter.value = "";
    elements.sortSelect.value = "";

    state.currentPage = 1;
    state.visiblePages = 1;

    applyFilters();
}

function loadNextPageOnScroll() {
    const totalPages = getTotalPages();
    const isNearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 180;

    if (!isNearBottom || state.isLoading || state.visiblePages >= totalPages) {
        return;
    }

    state.visiblePages += 1;
    state.currentPage = state.visiblePages;

    updateUrlFromState();
    render();
}

function checkAuth() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        elements.authModal.classList.remove("hidden");
        return;
    }

    elements.authModal.classList.add("hidden");
    elements.currentUserLabel.textContent = `Hello, ${currentUser.login}`;
}

elements.authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const login = elements.loginInput.value.trim();

    if (!login) {
        return;
    }

    setCurrentUser(login);
    checkAuth();
});

elements.logoutBtn.addEventListener("click", () => {
    clearCurrentUser();
    localStorage.removeItem(STORAGE_KEYS.savedFriends);

    elements.loginInput.value = "";
    elements.passwordInput.value = "";

    checkAuth();
});

elements.applyBtn.addEventListener("click", () => {
    state.currentPage = 1;
    state.visiblePages = 1;

    applyFilters();
});

elements.resetBtn.addEventListener("click", resetFilters);

elements.searchInput.addEventListener(
    "input",
    debounce(() => {
        state.currentPage = 1;
        state.visiblePages = 1;

        applyFilters();
    }, 350),
);

[
    elements.genderFilter,
    elements.minAgeFilter,
    elements.maxAgeFilter,
    elements.birthYearFilter,
    elements.locationFilter,
    elements.emailFilter,
    elements.sortSelect,
].forEach((element) => {
    element.addEventListener("change", () => {
        state.currentPage = 1;
        state.visiblePages = 1;

        applyFilters();
    });
});

elements.cardsContainer.addEventListener("click", (event) => {
    const saveButton = event.target.closest(".save-btn");

    if (!saveButton) {
        return;
    }

    toggleSavedFriend(saveButton.dataset.id);
});

elements.pagination.addEventListener("click", (event) => {
    const button = event.target.closest(".page-btn");

    if (!button) {
        return;
    }

    state.currentPage = Number(button.dataset.page);
    state.visiblePages = state.currentPage;

    updateUrlFromState();
    render();

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

window.addEventListener("scroll", throttle(loadNextPageOnScroll, 350));

window.addEventListener("popstate", () => {
    applyStateFromUrl();
    applyFilters(false);
});

checkAuth();
fetchUsers();
