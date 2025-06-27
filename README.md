# 💆🏾‍♀️ Skin Type Product Matcher

A personalized skincare assistant built using **HTML**, **CSS**, and **JavaScript**, with a backend powered by `json-server`.  
The app lets users match products and tips to their skin type, view recommended regimens, and understand how to care for their unique skin needs.

## 📋 Description

This project was created for a full-stack integration challenge combining frontend UI and a mock API backend. It focuses on client-server interaction and responsive design. The app is a **Single Page Application (SPA)**, meaning all interactions happen dynamically without reloading the page, providing a seamless experience.

## ✨ Key Features

- Interactive skin type quiz (2–3 multiple-choice questions)
- Filters products based on selected skin type
- Shows product name, image, ingredients, and purpose
- Allows users to add/remove products from “My Routine”
- Light/Dark mode toggle (morning vs. evening vibes)
- Skin-type-specific skincare tips
- Smooth animations (e.g., fade-ins or transitions)
- Fully asynchronous interactions with `fetch()` API
- Clean, reusable, and modular codebase using:
  - `.filter()`, `.forEach()`, `.map()`
  - At least 3 event listeners: `click`, `submit`, `change`

## 🌐 Live Demo

🔗 [View Live Frontend (GitHub Pages)](https://grace-eileen7.github.io/skin-type-product-matcher/)

🔗 [View Live Backend API (Render)](https://skin-type-product-matcher-json-api.onrender.com)

> ⚠️ **Note**: GitHub Pages hosts only the frontend. For full functionality, the frontend fetches data from the deployed JSON Server API.

## 🌿 User Workflow

As a user, you can:

1. Choose your skin type
2. Instantly view:
   - Tailored skincare tips
   - Product recommendations
   - Skin concerns and how to manage them
3. Explore relevant items fetched from a live API

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- JSON Server (`json-server`)
- Render (for backend hosting)
- GitHub Pages (for frontend deployment)

---

## 📁 Project Structure

```plaintext
skin-type-product-matcher/
├── index.html             # Main HTML layout
├── style.css              # Application styling
├── script.js              # JavaScript logic (fetching & rendering data)
├── db.json                # Backend database (skin types, products, tips)
├── index.js               # Entry file for running JSON Server
├── package.json           # Project metadata and dependencies
├── .gitignore             # Node modules exclusion
```

## 🖼️ Screenshot

![Screenshot](./assets/Screenshot%202025-06-27%20061223.png)

## 💻 Running the Project Locally

Prerequisites:

`Node.js & npm installed`

`Git installed`

## 🔧 Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/Grace-Eileen7/skin-type-product-matcher.git

cd skin-type-product-matcher
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the JSON Server**

```bash
npm start
```

> Your API will be available at:

```bash
http://localhost:3000/skinTypes, /products, /tips, etc.
```

## 🎨 Frontend Setup

Open the `index.html` file in your browser, or use VS Code’s Live Server extension.

## ▶️ Usage Instructions

- Open the app via GitHub Pages or locally.

- Choose your skin type from the dropdown or options.

- The app will dynamically fetch and display:

  - Products

  - Tips

  - Skin concerns

-Data is rendered in real time from the backend API (local or Render).

## 🧾 Sample Product Schema (from db.json)

Each skincare product in `db.json` includes:

```json
{
  "id": 1,
  "name": "Gentle Hydrating Cleanser",
  "image": "images/hydrating-cleanser.jpg",
  "ingredients": ["Glycerin", "Hyaluronic Acid"],
  "compatibleSkinTypes": ["dry", "sensitive"],
  "purpose": "Hydrating and cleansing the skin"
}
```

### 🔸 2. **Skin Type Quiz Flow**

**✅ Action**: Add a **Quiz Flow** subsection:

## 🧪 Skin Type Quiz Flow

Users answer 2–3 fun multiple-choice questions like:

- "How does your skin feel at the end of the day?"
- "What happens when you apply moisturizer?"
- "Do you experience both dry patches and oily areas?"

Based on their answers, the app detects a skin type:
➡️ `dry`, `oily`, `combination`, or `sensitive`
…and filters product recommendations accordingly and beauty tips.

## 🚀 Stretch Goals Implemented

- [x] Light/Dark mode for morning/evening skincare moods
- [x] Skin-type-specific skincare tips
- [x] Smooth card animations (e.g., fade-in effects)
- [x] Abstracted logic into clean, reusable functions
- [x] `.filter()`, `.map()`, `.forEach()` used effectively
- [x] Event-driven interactivity with `click`, `submit`, `change`
- [ ] Persistent "My Routine" list with `json-server` (in progress)

## 👩‍💻 Author

**Grace Eileen Bass**

## 📝 License

This project is licensed under the [MIT License](LICENSE).

```

```
