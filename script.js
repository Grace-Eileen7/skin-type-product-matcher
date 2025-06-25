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

function generateRecommendations(answers) {
  const recommendations = {
    acne: ["Gentle Green Cleanser", "Renewal Clay Mask"],
    dryness: ["Hydrating Botanical Serum", "Nourishing Day Moisturizer"],
    aging: ["Hydrating Botanical Serum", "Nourishing Day Moisturizer"],
    sensitivity: ["Gentle Green Cleanser", "Hydrating Botanical Serum"],
  };

  return (
    recommendations[answers["1"]] || [
      "Gentle Green Cleanser",
      "Nourishing Day Moisturizer",
    ]
  );
}

function displayResults(products) {
  const resultsHtml = `
            <div style="background: rgba(188, 216, 147, 0.1); padding: 2rem; border-radius: 15px; text-align: center;">
                <h3 style="font-family: var(--font-display); margin-bottom: 1rem;">Your Personalized Recommendations</h3>
                <p style="margin-bottom: 1.5rem;">Based on your quiz results, we recommend these products:</p>
                <ul style="list-style: none; margin-bottom: 1.5rem;">
                    ${products
                      .map(
                        (product) =>
                          `<li style="padding: 0.5rem 0;">• ${product}</li>`
                      )
                      .join("")}
                </ul>
                <button onclick="scrollToProducts()" style="background: var(--color-medium); color: white; border: none; padding: 1rem 2rem; border-radius: 50px; cursor: pointer; font-weight: 500;">
                    View Products
                </button>
            </div>
        `;

  document.getElementById("quiz-results").innerHTML = resultsHtml;
}
