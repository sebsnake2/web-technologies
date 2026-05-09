const signupTab = document.getElementById("signupTab");
const loginTab = document.getElementById("loginTab");

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");

const signupSuccess = document.getElementById("signupSuccess");
const loginSuccess = document.getElementById("loginSuccess");

const cities = {
    Ukraine: ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"],
    Poland: ["Warsaw", "Krakow", "Gdansk", "Wroclaw"],
    Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
};

signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");

    signupForm.classList.add("active");
    loginForm.classList.remove("active");
});

loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");

    loginForm.classList.add("active");
    signupForm.classList.remove("active");
});

document.querySelectorAll(".eye-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const inputId = button.dataset.target;
        const input = document.getElementById(inputId);

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "🙈";
        } else {
            input.type = "password";
            button.textContent = "👁";
        }
    });
});

countrySelect.addEventListener("change", () => {
    const selectedCountry = countrySelect.value;

    citySelect.innerHTML = '<option value="">Choose city</option>';

    if (selectedCountry) {
        citySelect.disabled = false;

        cities[selectedCountry].forEach((city) => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    } else {
        citySelect.disabled = true;
    }
});

function showError(input, message) {
    const field = input.closest(".field");
    const error = field.querySelector("small");

    input.classList.remove("valid");
    input.classList.add("invalid");

    if (error) {
        error.textContent = message;
        error.style.color = "#e74c3c";
    }
}

function showSuccess(input) {
    const field = input.closest(".field");
    const error = field.querySelector("small");

    input.classList.remove("invalid");
    input.classList.add("valid");

    if (error) {
        error.textContent = "Looks good!";
        error.style.color = "#2ecc71";
    }
}

function resetMessageColor(input) {
    const field = input.closest(".field");
    const error = field.querySelector("small");

    if (error) {
        error.style.color = "#e74c3c";
    }
}

function validateName(input, fieldName) {
    const value = input.value.trim();
    resetMessageColor(input);

    if (value === "") {
        showError(input, `${fieldName} is required.`);
        return false;
    }

    if (value.length < 3) {
        showError(input, `${fieldName} must contain at least 3 characters.`);
        return false;
    }

    if (value.length > 15) {
        showError(
            input,
            `${fieldName} must contain no more than 15 characters.`,
        );
        return false;
    }

    showSuccess(input);
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    resetMessageColor(input);

    if (value === "") {
        showError(input, "Email is required.");
        return false;
    }

    if (!emailRegex.test(value)) {
        showError(input, "Please enter a valid email address.");
        return false;
    }

    showSuccess(input);
    return true;
}

function validatePassword(input) {
    const value = input.value.trim();
    resetMessageColor(input);

    if (value === "") {
        showError(input, "Password is required.");
        return false;
    }

    if (value.length < 6) {
        showError(input, "Password must contain at least 6 characters.");
        return false;
    }

    showSuccess(input);
    return true;
}

function validateConfirmPassword(passwordInput, confirmInput) {
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    resetMessageColor(confirmInput);

    if (confirmPassword === "") {
        showError(confirmInput, "Confirm password is required.");
        return false;
    }

    if (password !== confirmPassword) {
        showError(confirmInput, "Passwords do not match.");
        return false;
    }

    showSuccess(confirmInput);
    return true;
}

function validatePhone(input) {
    const value = input.value.trim();
    const phoneRegex = /^\+380\d{9}$/;

    resetMessageColor(input);

    if (value === "") {
        showError(input, "Phone is required.");
        return false;
    }

    if (!phoneRegex.test(value)) {
        showError(input, "Phone must match Ukrainian format: +380XXXXXXXXX.");
        return false;
    }

    showSuccess(input);
    return true;
}

function validateBirthDate(input) {
    const value = input.value;
    resetMessageColor(input);

    if (value === "") {
        showError(input, "Date birth is required.");
        return false;
    }

    const birthDate = new Date(value);
    const today = new Date();

    if (birthDate > today) {
        showError(input, "Date birth cannot be in the future.");
        return false;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    if (age < 12) {
        showError(
            input,
            "You cannot register because you are under 12 years old.",
        );
        return false;
    }

    showSuccess(input);
    return true;
}

function validateSex() {
    const selectedSex = document.querySelector('input[name="sex"]:checked');
    const sexError = document.getElementById("sexError");

    if (!selectedSex) {
        sexError.textContent = "Please choose your sex.";
        sexError.style.color = "#e74c3c";
        return false;
    }

    sexError.textContent = "Looks good!";
    sexError.style.color = "#2ecc71";
    return true;
}

function validateSelect(select, message) {
    resetMessageColor(select);

    if (select.value === "") {
        showError(select, message);
        return false;
    }

    showSuccess(select);
    return true;
}

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");
    const birthDate = document.getElementById("birthDate");
    const country = document.getElementById("country");
    const city = document.getElementById("city");

    const isFirstNameValid = validateName(firstName, "First Name");
    const isLastNameValid = validateName(lastName, "Last Name");
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
        password,
        confirmPassword,
    );
    const isPhoneValid = validatePhone(phone);
    const isBirthDateValid = validateBirthDate(birthDate);
    const isSexValid = validateSex();
    const isCountryValid = validateSelect(country, "Please choose a country.");
    const isCityValid = validateSelect(city, "Please choose a city.");

    const isFormValid =
        isFirstNameValid &&
        isLastNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        isPhoneValid &&
        isBirthDateValid &&
        isSexValid &&
        isCountryValid &&
        isCityValid;

    if (isFormValid) {
        const user = {
            email: email.value.trim(),
            password: password.value.trim(),
        };

        localStorage.setItem("registeredUser", JSON.stringify(user));

        signupSuccess.textContent = "User has been successfully registered!";

        signupForm.reset();
        citySelect.disabled = true;
        citySelect.innerHTML = '<option value="">Choose city</option>';

        clearValidation(signupForm);

        document.getElementById("sexError").textContent = "";
    }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username");
    const loginPassword = document.getElementById("loginPassword");

    const isUsernameValid = validateEmail(username);
    const isPasswordValid = validatePassword(loginPassword);

    if (!isUsernameValid || !isPasswordValid) {
        loginSuccess.textContent = "";
        return;
    }

    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!savedUser) {
        showError(username, "No registered user found.");
        loginSuccess.textContent = "";
        return;
    }

    if (
        username.value.trim() === savedUser.email &&
        loginPassword.value.trim() === savedUser.password
    ) {
        loginSuccess.textContent = "User has been successfully logged in!";
        loginForm.reset();
        clearValidation(loginForm);
    } else {
        showError(username, "Incorrect email or password.");
        showError(loginPassword, "Incorrect email or password.");
        loginSuccess.textContent = "";
    }
});

function validateRequired(input, message) {
    const value = input.value.trim();
    resetMessageColor(input);

    if (value === "") {
        showError(input, message);
        return false;
    }

    showSuccess(input);
    return true;
}

function clearValidation(form) {
    const fields = form.querySelectorAll("input, select");
    const messages = form.querySelectorAll("small");

    fields.forEach((field) => {
        field.classList.remove("valid");
        field.classList.remove("invalid");
    });

    messages.forEach((message) => {
        message.textContent = "";
        message.style.color = "#e74c3c";
    });
}
