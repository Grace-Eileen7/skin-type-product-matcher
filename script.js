// Dark/light mode toggle
function toggleMode() {
  document.body.classList.toggle("light-mode");
  const modeToggle = document.querySelector(".mode-toggle");
  if (document.body.classList.contains("light-mode")) {
    modeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    modeToggle.textContent = "🌞";
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
function checkVisibility(e) {
  if (e) e.preventDefault();

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
document.addEventListener("DOMContentLoaded", async function () {
  checkTheme();
  checkVisibility();
  // Fetch data from db.json
  fetchDBData().then(async (data) => {
    await loadRoutine();
    await loadTips();
  });

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
let routineProducts = [];
let allDbData = "";

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

async function submitQuiz() {
  if (Object.keys(quizAnswers).length < 3) {
    alert("Please answer all questions before submitting.");
    return;
  }

  // Show loading
  const resultsElement = document.getElementById("quiz-results");
  resultsElement.classList.remove("hidden");
  resultsElement.innerHTML = '<div class="loading"></div>'; // <== this part shows the loader

  // Simulate processing
  const results = generateRecommendations(quizAnswers);
  displayResults(results);

  const beautyTips = generateBeautyTips(quizAnswers);

  try {
    const response = await fetch("http://localhost:3001/tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: beautyTips,
    });

    if (!response.ok) throw new Error("Failed to save");
    console.log("Saved to tips!");
  } catch (error) {
    console.error("Error saving tips:", error);
  }

  displayBeautyTips(beautyTips);
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

function generateBeautyTips(answers) {
  const primaryConcern = answers["1"];
  const matchedConcern = allDbData?.concerns.find((c) => {
    return c.type === primaryConcern;
  });

  if (!matchedConcern) {
    return {
      recommendations: ["Gentle Green Cleanser", "Nourishing Day Moisturizer"],
      tips: [
        "Cleanse your face twice daily",
        "Always apply moisturizer to damp skin",
        "Use SPF daily",
      ],
    };
  }

  console.log("concern");
  console.log(matchedConcern);

  return {
    recommendations: matchedConcern.recommendations.map((rec) => ({
      id: rec,
      name: getProductDisplayName(rec),
    })),
    tips: matchedConcern.tips,
  };
}

// Helper function to map product IDs to display names
function getProductDisplayName(productId) {
  const productNames = {
    "gentle-cleanser": "Gentle Green Cleanser",
    "renewal-mask": "Renewal Clay Mask",
    "hydrating-serum": "Hydrating Botanical Serum",
    "nourishing-moisturizer": "Nourishing Day Moisturizer",
  };
  return productNames[productId] || productId;
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

function displayBeautyTips(response) {
  const tips = response?.tips || response?.tips || [];

  console.log(tips);

  document.getElementById("tips").innerHTML = `
    <div style="background: rgba(188, 216, 147, 0.1); padding: 2rem; border-radius: 15px; text-align: center;">
      <h3 style="font-family: var(--font-display); margin-bottom: 1rem;">Your Personalized Beauty Tips</h3>
      <p style="margin-bottom: 1.5rem;">Based on your skin concerns, follow these recommendations:</p>
      <ul style="list-style: none; margin-bottom: 1.5rem; text-align: left; padding-left: 1rem;">
        ${tips
          .map(
            (tip) => `
          <li style="padding: 0.5rem 0; position: relative; padding-left: 1.5rem;">
            <span style="position: absolute; left: 0;">•</span> ${tip}
          </li>
        `
          )
          .join("")}
      </ul>
      ${
        tips.length > 0
          ? `
        <button onclick="scrollToProducts()" style="background: var(--color-medium); color: white; border: none; padding: 1rem 2rem; border-radius: 50px; cursor: pointer; font-weight: 500; margin-top: 1rem;">
          View Recommended Products
        </button>
      `
          : `
        <p style="font-style: italic; opacity: 0.7;">No specific tips available for your current profile</p>
      `
      }
    </div>
  `;
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

async function addToRoutine(button) {
  const productCard = button.closest(".product-card");

  const product = {
    productId: productCard.dataset.product,
    name: productCard.querySelector(".product-name").textContent,
    ingredients: productCard
      .querySelector(".product-ingredients")
      .textContent.trim(),
    emoji: productCard.querySelector(".product-image").textContent,
  };

  // Check if product already exists in routine
  const exists = routineProducts.some((p) => p.productId === product.productId);
  if (exists) {
    alert("This product is already in your routine!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.productId,
        ingredients: product.ingredients,
        name: product.name,
        addedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error("Failed to save");
    console.log("Saved to routine!");
    await loadRoutine();
  } catch (error) {
    console.error("Error saving routine:", error);
  }

  // Update the routine display
  // updateRoutineDisplay();

  // Update button state
  button.textContent = "Added!";
  button.disabled = true;
}

function updateRoutineDisplay(productsArray) {
  console.log("productsArray");
  console.log(productsArray);
  const routineList = document.getElementById("routine-list");
  const productsToDisplay = productsArray || routineProducts;

  if (productsToDisplay.length === 0) {
    routineList.innerHTML = `
      <p style="text-align: center; opacity: 0.7; font-style: italic">
        Your routine will appear here as you add products
      </p>
    `;
    return;
  }

  // Create HTML for each product
  routineList.innerHTML = productsToDisplay
    .map(
      (product) => `
    <div class="routine-product" data-product-id="${product.id}">
      <div class="routine-product-id">${product.productId}</div>
      <div class="routine-product-emoji">${product.emoji || "✨"}</div>
      <div class="routine-product-info">
        <h4>${product.name}</h4>
        ${
          product.ingredients
            ? `<p class="routine-product-ingredients">${product.ingredients}</p>`
            : ""
        }
      </div>
      <button class="remove-from-routine">
        ×
      </button>
    </div>
  `
    )
    .join("");

  // Add event listeners for remove buttons
  routineList.querySelectorAll(".remove-from-routine").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.closest(".routine-product").dataset.productId;

      removeFromRoutine(productId).then((r) => {
        deleteFromServer(productId).then((r) => console.log(r));
      });
    });
  });
}

async function removeFromRoutine(productId) {
  try {
    routineProducts = routineProducts.filter((product) => {
      return product.id != productId;
    });
    updateRoutineDisplay();

    await deleteFromServer(productId);

    const allProductCards = document.querySelectorAll(".product-card");

    console.log("::::::allProductCards");
    console.log(allProductCards);
    allProductCards.forEach((card) => {
      if (card.dataset.product == productId) {
        const addButton = card.querySelector(".add-to-routine");
        console.log(":::::::addButton");
        console.log(addButton);
        if (addButton) {
          addButton.textContent = "Add to Routine";
          addButton.disabled = false;
        }
      }
    });
  } catch (error) {
    console.error("Error removing product:", error);
    // Revert UI if needed
    loadRoutine();
  }
}

async function fetchDBData() {
  try {
    const response = await fetch("db.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    allDbData = data;
    console.log("All DB data loaded:", allDbData);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

async function loadRoutine() {
  try {
    const response = await fetch("http://localhost:3001/routines");
    const savedRoutine = await response.json();
    routineProducts = savedRoutine;
    updateRoutineDisplay(savedRoutine);
  } catch (error) {
    console.error("Error loading routine:", error);
  }
}

async function loadTips() {
  try {
    const response = await fetch("http://localhost:3001/tips");
    console.log(response);

    const savedTips = await response.json();
    console.log(savedTips);

    displayBeautyTips(savedTips); // Use savedTips, not raw response
  } catch (error) {
    console.error("Error loading tips:", error);
  }
}

async function deleteFromServer(productId) {
  await fetch(`http://localhost:3001/routines/${productId}`, {
    method: "DELETE",
  });
  await loadRoutineFromServer();
}

// Case 2: Fetched from json-server
async function loadRoutineFromServer() {
  const response = await fetch("http://localhost:3001/routines");
  const serverProducts = await response.json();
  updateRoutineDisplay(serverProducts);
}
