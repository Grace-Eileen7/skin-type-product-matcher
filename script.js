// Dark/light mode toggle
function toggleMode() {
  document.body.classList.toggle("light-mode");
  const modeToggle = document.querySelector(".mode-toggle");
  if (document.body.classList.contains("light-mode")) {
    modeToggle.textContent = "🌞";
    localStorage.setItem("theme", "light");
  } else {
    modeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
}

// Check for saved theme preference
function checkTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    document.querySelector(".mode-toggle").textContent = "🌞";
  }
}

// Scroll animation
function checkVisibility() {
  const sections = document.querySelectorAll(".section");
  const windowHeight = window.innerHeight;

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop < windowHeight * 0.75) {
      section.classList.add("visible");
    }
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  checkTheme();
  checkVisibility();

  // Set up event listeners
  window.addEventListener("scroll", checkVisibility);

  // Make functions available globally
  window.submitQuiz = submitQuiz;
  window.scrollToProducts = scrollToProducts;
  window.addToRoutine = addToRoutine;
  window.removeFromRoutine = removeFromRoutine;
  window.toggleMode = toggleMode;
});

// Quiz functionality
let quizAnswers = {};

document.querySelectorAll(".option").forEach((option) => {
  option.addEventListener("click", function () {
    const question = this.dataset.question;
    const value = this.dataset.value;

    // Remove selected class from other options in the same question
    document
      .querySelectorAll(`[data-question="${question}"]`)
      .forEach((opt) => {
        opt.classList.remove("selected");
      });

    // Add selected class to clicked option
    this.classList.add("selected");

    // Store answer
    quizAnswers[question] = value;
  });
});

function submitQuiz() {
  if (Object.keys(quizAnswers).length < 3) {
    alert("Please answer all questions before submitting.");
    return;
  }

  // Show loading
  const resultsElement = document.getElementById("quiz-results");
  resultsElement.classList.remove("hidden");
  resultsElement.innerHTML = '<div class="loading"></div>'; // <== this part shows the loader

  // Simulate processing
  setTimeout(() => {
    const results = generateRecommendations(quizAnswers);
    displayResults(results);
  }, 2000);
}
