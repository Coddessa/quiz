// Бургер-меню | Burger menu
const burger = document.querySelector(".header__burger");
const nav = document.querySelector(".header__nav");

burger.addEventListener("click", () => {
  burger.classList.toggle("header__burger--active");
  nav.classList.toggle("header__nav--open");
});

// Модальные окна | Modal windows
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("[data-modal]");
  const success = document.querySelector("[data-success-modal]");
  const openBtns = document.querySelectorAll("[data-modal-open]");
  const closeBtns = document.querySelectorAll(".modal__close");
  const form = document.getElementById("contactForm");
  const commentField = document.getElementById("commentField");
  const commentInput = document.getElementById("comment");

  const open = (el) => {
    el.classList.add("modal-overlay--open");
    document.body.style.overflow = "hidden";
  };

  const closeAll = () => {
    modal.classList.remove("modal-overlay--open");
    success.classList.remove("modal-overlay--open");
    document.body.style.overflow = "";
  };

  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => open(modal));
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeAll);
  });

  [modal, success].forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAll();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!commentInput.value.trim()) {
      commentField.classList.add("form__field--error");
      return;
    }

    commentField.classList.remove("form__field--error");

    modal.classList.remove("modal-overlay--open");

    setTimeout(() => {
      open(success);
    }, 200);

    form.reset();
  });

  commentInput.addEventListener("input", () => {
    if (commentInput.value.trim()) {
      commentField.classList.remove("form__field--error");
    }
  });
});

// Квиз | Quiz
document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".quiz__step");
  const screens = document.querySelectorAll(".quiz__screen");
  const chips = document.querySelectorAll(".quiz__chip");

  // Контейнеры для ответов | Answer containers
  const stepAnswers = {
    1: document.getElementById("step1-answers"),
    2: document.getElementById("step2-answers"),
    3: document.getElementById("step3-answers"),
    4: document.getElementById("step4-answers"),
  };

  // Хранилище ответов | Answers storage
  const answers = {
    step1: [],
    step2: null,
    step3: null,
    step4: [],
  };

  // Обновление ответов в боковой панели | Update answers in sidebar
  function updateStepAnswers() {
    for (let i = 1; i <= 4; i++) {
      const stepAnswer = stepAnswers[i];
      if (!stepAnswer) continue;

      if (i === 1 || i === 4) {
        // Множественный выбор | Multiple choice
        if (answers[`step${i}`].length > 0) {
          const answerTexts = [];
          answers[`step${i}`].forEach((value) => {
            const chip = document.querySelector(
              `[data-screen="${i}"] .quiz__chip[data-value="${value}"]`,
            );
            if (chip) {
              answerTexts.push(chip.textContent.trim());
            }
          });
          stepAnswer.innerHTML = answerTexts
            .map((text) => `<span class="quiz__step-answer">${text}</span>`)
            .join("");
        } else {
          stepAnswer.innerHTML = "";
        }
      } else {
        // Единичный выбор | Single choice
        if (answers[`step${i}`]) {
          const chip = document.querySelector(
            `[data-screen="${i}"] .quiz__chip[data-value="${answers[`step${i}`]}"]`,
          );
          if (chip) {
            stepAnswer.innerHTML = `<span class="quiz__step-answer">${chip.textContent.trim()}</span>`;
          }
        } else {
          stepAnswer.innerHTML = "";
        }
      }
    }
  }

  // Переключение шагов | Step navigation
  function goToStep(stepNumber) {
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove("quiz__step--active", "quiz__step--completed");

      if (stepNum === stepNumber) {
        step.classList.add("quiz__step--active");
      } else if (stepNum < stepNumber) {
        step.classList.add("quiz__step--completed");
      }
    });

    screens.forEach((screen) => {
      const screenNum = parseInt(screen.dataset.screen);
      if (screenNum === stepNumber) {
        screen.classList.add("quiz__screen--active");
      } else {
        screen.classList.remove("quiz__screen--active");
      }
    });
  }

  // Обработка выбора вариантов | Handle option selection
  chips.forEach((chip) => {
    chip.addEventListener("click", function () {
      const parentOptions = this.closest(".quiz__options");
      const isMultiple = parentOptions.dataset.multiple === "true";
      const screenNum = parseInt(this.closest(".quiz__screen").dataset.screen);

      if (isMultiple) {
        this.classList.toggle("quiz__chip--active");
        answers[`step${screenNum}`] = Array.from(
          document.querySelectorAll(
            `[data-screen="${screenNum}"] .quiz__chip--active`,
          ),
        ).map((chip) => chip.dataset.value);
      } else {
        parentOptions.querySelectorAll(".quiz__chip").forEach((c) => {
          c.classList.remove("quiz__chip--active");
        });
        this.classList.add("quiz__chip--active");
        answers[`step${screenNum}`] = this.dataset.value;
      }

      updateStepAnswers();
    });
  });

  // Кнопки "Продолжить" | Next buttons
  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const nextStep = parseInt(this.dataset.next);
      goToStep(nextStep);
    });
  });

  // Кнопки "Назад" | Previous buttons
  document.querySelectorAll("[data-prev]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const prevStep = parseInt(this.dataset.prev);
      if (!isNaN(prevStep)) {
        goToStep(prevStep);
      }
    });
  });

  // Завершение | Submit
  document
    .querySelector("[data-submit]")
    .addEventListener("click", function () {
      console.log("Все ответы:", answers);
    });

  // Навигация по шагам | Step navigation click
  steps.forEach((step, index) => {
    step.addEventListener("click", function () {
      const stepNum = index + 1;
      goToStep(stepNum);
    });
  });

  // Инициализация | Initialization
  updateStepAnswers();
  goToStep(1);
});

// Слайдер отзывов | Reviews slider
const reviewsSlider = new Swiper(".reviews__slider", {
  slidesPerView: 4.2,
  centeredSlides: true,
  spaceBetween: 10,
  speed: 500,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    320: {
      slidesPerView: 1.2,
      spaceBetween: 8,
      centeredSlides: true,
    },

    480: {
      slidesPerView: 1.3,
      spaceBetween: 10,
      centeredSlides: true,
    },

    768: {
      slidesPerView: 2.2,
      spaceBetween: 12,
      centeredSlides: true,
    },

    1024: {
      slidesPerView: 3.2,
      spaceBetween: 14,
      centeredSlides: true,
    },

    1200: {
      slidesPerView: 4.2,
      spaceBetween: 16,
      centeredSlides: true,
    },
  },

  on: {
    init: function () {
      setTimeout(() => {
        this.slideTo(2, 0);
      }, 100);
    },
  },
});

// Слайдер тегов | Tags slider
const tagsSlider = new Swiper(".tags__slider", {
  slidesPerView: "auto",
  spaceBetween: 12,
  freeMode: true,
  breakpoints: {
    1025: {
      enabled: false,
    },
  },
});
