const sliderConfig = {
    slides: [
        {
            title: "Slide 1",
            text: "This is the first slide with text content.",
        },
        {
            title: "Slide 2",
            text: "This carousel can show text, images, or any other content.",
        },
        {
            title: "Slide 3",
            text: "Navigation works with arrows, dots, and keyboard events.",
        },
        {
            title: "Slide 4",
            text: "Autoplay stops when the mouse is over the slider.",
        },
        {
            title: "Slide 5",
            text: "The slider is adaptive and works on different screen sizes.",
        },
    ],
    animationDuration: 500,
    autoplay: true,
    autoplayDelay: 2500,
    showArrows: true,
    showDots: true,
};

const sliderState = {
    currentSlide: 0,
    autoplayInterval: null,
};

const elements = {
    slider: document.getElementById("slider"),
    sliderTrack: document.getElementById("sliderTrack"),
    sliderDots: document.getElementById("sliderDots"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
};

const createSlideElement = (slide) => {
    const slideElement = document.createElement("div");
    slideElement.className = "slide";

    slideElement.innerHTML = `
    <div class="slide-content">
      <h2>${slide.title}</h2>
      <p>${slide.text}</p>
    </div>
  `;

    return slideElement;
};

const createDotElement = (index) => {
    const dotElement = document.createElement("button");
    dotElement.className = "slider-dot";
    dotElement.setAttribute("aria-label", `Go to slide ${index + 1}`);

    dotElement.addEventListener("click", () => {
        goToSlide(index);
    });

    return dotElement;
};

const renderSlides = (config) => {
    elements.sliderTrack.innerHTML = "";

    config.slides.forEach((slide) => {
        const slideElement = createSlideElement(slide);
        elements.sliderTrack.appendChild(slideElement);
    });
};

const renderDots = (config) => {
    elements.sliderDots.innerHTML = "";

    if (!config.showDots) {
        elements.sliderDots.style.display = "none";
        return;
    }

    config.slides.forEach((_, index) => {
        const dotElement = createDotElement(index);
        elements.sliderDots.appendChild(dotElement);
    });
};

const updateDots = () => {
    const dots = document.querySelectorAll(".slider-dot");

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === sliderState.currentSlide);
    });
};

const updateSliderPosition = () => {
    const offset = sliderState.currentSlide * 100;
    elements.sliderTrack.style.transform = `translateX(-${offset}%)`;
    updateDots();
};

const goToSlide = (slideIndex) => {
    sliderState.currentSlide = slideIndex;
    updateSliderPosition();
};

const goToNextSlide = () => {
    const lastSlideIndex = sliderConfig.slides.length - 1;

    if (sliderState.currentSlide === lastSlideIndex) {
        sliderState.currentSlide = 0;
    } else {
        sliderState.currentSlide += 1;
    }

    updateSliderPosition();
};

const goToPrevSlide = () => {
    const lastSlideIndex = sliderConfig.slides.length - 1;

    if (sliderState.currentSlide === 0) {
        sliderState.currentSlide = lastSlideIndex;
    } else {
        sliderState.currentSlide -= 1;
    }

    updateSliderPosition();
};

const startAutoplay = () => {
    if (!sliderConfig.autoplay) {
        return;
    }

    stopAutoplay();

    sliderState.autoplayInterval = setInterval(() => {
        goToNextSlide();
    }, sliderConfig.autoplayDelay);
};

const stopAutoplay = () => {
    clearInterval(sliderState.autoplayInterval);
};

const handleKeyboardNavigation = (event) => {
    if (event.key === "ArrowRight") {
        goToNextSlide();
    }

    if (event.key === "ArrowLeft") {
        goToPrevSlide();
    }
};

const setArrowsVisibility = (config) => {
    if (config.showArrows) {
        elements.prevBtn.style.display = "block";
        elements.nextBtn.style.display = "block";
        return;
    }

    elements.prevBtn.style.display = "none";
    elements.nextBtn.style.display = "none";
};

const setAnimationDuration = (config) => {
    elements.sliderTrack.style.transitionDuration = `${config.animationDuration}ms`;
};

const initSlider = (config) => {
    renderSlides(config);
    renderDots(config);
    setArrowsVisibility(config);
    setAnimationDuration(config);
    updateSliderPosition();

    elements.nextBtn.addEventListener("click", goToNextSlide);
    elements.prevBtn.addEventListener("click", goToPrevSlide);

    document.addEventListener("keydown", handleKeyboardNavigation);

    elements.slider.addEventListener("mouseenter", stopAutoplay);
    elements.slider.addEventListener("mouseleave", startAutoplay);

    startAutoplay();
};

initSlider(sliderConfig);
