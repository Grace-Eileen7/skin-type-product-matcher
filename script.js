// Dark/light mode toggle
function toggleMode() {
  // Toggle 'light-mode' class on body element
  document.body.classList.toggle("light-mode");

  // Get the mode toggle button element
  const modeToggle = document.querySelector(".mode-toggle");

  // Check if light mode is currently active
  if (document.body.classList.contains("light-mode")) {
    // Update button to moon icon (indicating switch to dark mode)
    modeToggle.textContent = "🌙";
    // Save theme preference to localStorage
    localStorage.setItem("theme", "light");
  } else {
    // Update button to sun icon (indicating switch to light mode)
    modeToggle.textContent = "🌞";
    // Save theme preference to localStorage
    localStorage.setItem("theme", "dark");
  }
}

// Check for saved theme preference
function checkTheme() {
  // Retrieve saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");

  // If light theme was saved
  if (savedTheme === "light") {
    // Apply light mode classes
    document.body.classList.add("light-mode");
    // Update toggle button icon
    document.querySelector(".mode-toggle").textContent = "🌞";
  }
}

// Scroll animation handler
function checkVisibility(e) {
  // Prevent default if event exists (for anchor tags)
  if (e) e.preventDefault();

  // Get all sections and current viewport height
  const sections = document.querySelectorAll(".section");
  const windowHeight = window.innerHeight;

  // Check visibility for each section
  sections.forEach((section) => {
    // Get section's position relative to viewport
    const sectionTop = section.getBoundingClientRect().top;

    // If section is in the visible area (75% of viewport height)
    if (sectionTop < windowHeight * 0.75) {
      // Add visible class to trigger animations
      section.classList.add("visible");
    }
  });
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Apply saved theme
  checkTheme();
  // Initial visibility check
  checkVisibility();

  // Fetch data from db.json and load routines/tips
  fetchDBData().then(async (data) => {
    await loadRoutine();
    await loadTips();
  });

  // Set up scroll event listener
  window.addEventListener("scroll", checkVisibility);

  // Expose functions to global scope
  window.submitQuiz = submitQuiz;
  window.scrollToProducts = scrollToProducts;
  window.addToRoutine = addToRoutine;
  window.removeFromRoutine = removeFromRoutine;
  window.toggleMode = toggleMode;
});

// Quiz functionality
let quizAnswers = {}; // Stores user's quiz answers
let routineProducts = []; // Stores products in user's routine
let allDbData = ""; // Will store all database content

// Set up quiz option click handlers
document.querySelectorAll(".option").forEach((option) => {
  option.addEventListener("click", function () {
    // Get question and selected value from data attributes
    const question = this.dataset.question;
    const value = this.dataset.value;

    // Remove selected class from all options in this question
    document
      .querySelectorAll(`[data-question="${question}"]`)
      .forEach((opt) => {
        opt.classList.remove("selected");
      });

    // Mark clicked option as selected
    this.classList.add("selected");

    // Store answer in quizAnswers object
    quizAnswers[question] = value;
  });
});

// Handle quiz submission
async function submitQuiz() {
  // Validate all questions were answered
  if (Object.keys(quizAnswers).length < 3) {
    alert("Please answer all questions before submitting.");
    return;
  }

  // Show loading state
  const resultsElement = document.getElementById("quiz-results");
  resultsElement.classList.remove("hidden");
  resultsElement.innerHTML = '<div class="loading"></div>';

  // Generate product recommendations
  const results = generateRecommendations(quizAnswers);
  displayResults(results);

  // Generate beauty tips based on answers
  const beautyTips = generateBeautyTips(quizAnswers);

  // Save tips to server
  try {
    const response = await fetch(
      "https://skin-type-product-matcher-json-api.onrender.com/tips",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: beautyTips,
      }
    );

    if (!response.ok) throw new Error("Failed to save");
    console.log("Saved to tips!");
  } catch (error) {
    console.error("Error saving tips:", error);
  }

  // Display the generated tips
  displayBeautyTips(beautyTips);
}

// Generate product recommendations based on quiz answers
function generateRecommendations(answers) {
  // Recommendation mapping by skin concern
  const recommendations = {
    acne: ["Gentle Green Cleanser", "Renewal Clay Mask"],
    dryness: ["Hydrating Botanical Serum", "Nourishing Day Moisturizer"],
    aging: ["Hydrating Botanical Serum", "Nourishing Day Moisturizer"],
    sensitivity: ["Gentle Green Cleanser", "Hydrating Botanical Serum"],
  };

  // Return recommendations based on primary concern or default
  return (
    recommendations[answers["1"]] || [
      "Gentle Green Cleanser",
      "Nourishing Day Moisturizer",
    ]
  );
}

// Generate personalized beauty tips
function generateBeautyTips(answers) {
  // Get primary concern from answers
  const primaryConcern = answers["1"];

  // Find matching concern in database
  const matchedConcern = allDbData?.concerns.find((c) => {
    return c.type === primaryConcern;
  });

  // Return default if no match found
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
  // Return matched concern data with formatted product names
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

// Display quiz results to user
function displayResults(products) {
  const resultsHtml = `
    <div style="background: rgba(188, 216, 147, 0.1); padding: 2rem; border-radius: 15px; text-align: center;">
      <h3 style="font-family: var(--font-display); margin-bottom: 1rem;">Your Personalized Recommendations</h3>
      <p style="margin-bottom: 1.5rem;">Based on your quiz results, we recommend these products:</p>
      <ul style="list-style: none; margin-bottom: 1.5rem;">
        ${products
          .map((product) => `<li style="padding: 0.5rem 0;">• ${product}</li>`)
          .join("")}
      </ul>
      <button onclick="scrollToProducts()" style="background: var(--color-medium); color: white; border: none; padding: 1rem 2rem; border-radius: 50px; cursor: pointer; font-weight: 500;">
        View Products
      </button>
    </div>
  `;

  document.getElementById("quiz-results").innerHTML = resultsHtml;
}

// Display beauty tips to user
function displayBeautyTips(response) {
  // Extract tips from response or default to empty array
  const tips = response?.tips || response?.tips || [];

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

// Smooth scroll to products section
function scrollToProducts() {
  document.getElementById("products").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Add product to user's routine
async function addToRoutine(button) {
  // Get product card element
  const productCard = button.closest(".product-card");

  // Extract product data
  const product = {
    productId: productCard.dataset.product,
    name: productCard.querySelector(".product-name").textContent,
    ingredients: productCard
      .querySelector(".product-ingredients")
      .textContent.trim(),
    emoji: productCard.querySelector(".product-image").textContent,
  };

  // Check for duplicate products
  const exists = routineProducts.some((p) => p.productId === product.productId);
  if (exists) {
    alert("This product is already in your routine!");
    return;
  }

  // Save to server
  try {
    const response = await fetch(
      "https://skin-type-product-matcher-json-api.onrender.com/routines",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.productId,
          ingredients: product.ingredients,
          name: product.name,
          addedAt: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to save");
    console.log("Saved to routine!");
    await loadRoutine();
  } catch (error) {
    console.error("Error saving routine:", error);
  }

  // Update button state
  button.textContent = "Added!";
  button.disabled = true;
}

// Update the routine display
function updateRoutineDisplay(productsArray) {
  const routineList = document.getElementById("routine-list");
  const productsToDisplay = productsArray || routineProducts;

  // Handle empty routine
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

  // Add remove button handlers
  routineList.querySelectorAll(".remove-from-routine").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.closest(".routine-product").dataset.productId;
      removeFromRoutine(productId).then((r) => {
        deleteFromServer(productId).then((r) => console.log(r));
      });
    });
  });
}

// Remove product from routine
async function removeFromRoutine(productId) {
  try {
    // Filter out the removed product
    routineProducts = routineProducts.filter((product) => {
      return product.id != productId;
    });
    updateRoutineDisplay();

    // Delete from server
    await deleteFromServer(productId);

    // Reset add button for this product
    const allProductCards = document.querySelectorAll(".product-card");
    allProductCards.forEach((card) => {
      if (card.dataset.product == productId) {
        const addButton = card.querySelector(".add-to-routine");
        if (addButton) {
          addButton.textContent = "Add to Routine";
          addButton.disabled = false;
        }
      }
    });
  } catch (error) {
    console.error("Error removing product:", error);
    // Revert to server state if error occurs
    loadRoutine();
  }
}

// Fetch all data from local db.json
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

// Load user's routine from server
async function loadRoutine() {
  try {
    const response = await fetch(
      "https://skin-type-product-matcher-json-api.onrender.com/routines"
    );
    const savedRoutine = await response.json();
    routineProducts = savedRoutine;
    updateRoutineDisplay(savedRoutine);
  } catch (error) {
    console.error("Error loading routine:", error);
  }
}

// Load beauty tips from server
async function loadTips() {
  try {
    const response = await fetch(
      "https://skin-type-product-matcher-json-api.onrender.com/tips"
    );
    const savedTips = await response.json();
    displayBeautyTips(savedTips);
  } catch (error) {
    console.error("Error loading tips:", error);
  }
}

// Delete product from server
async function deleteFromServer(productId) {
  await fetch(
    `https://skin-type-product-matcher-json-api.onrender.com/routines/${productId}`,
    {
      method: "DELETE",
    }
  );
  await loadRoutineFromServer();
}

// Load routine from server and update display
async function loadRoutineFromServer() {
  const response = await fetch(
    "https://skin-type-product-matcher-json-api.onrender.com/routines"
  );
  const serverProducts = await response.json();
  updateRoutineDisplay(serverProducts);
}
