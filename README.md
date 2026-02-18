# 🏥 Hospital Disease Prediction System — Frontend

![Disease Prediction Result](https://raw.githubusercontent.com/Maheeshasamarasinhe/hospital-Resource-Management-with-AI/main/predicted_data.png)

A modern, AI-powered hospital disease prediction dashboard built with **React + Vite**. This frontend communicates with a Flask ML backend to predict monthly disease case counts based on environmental, social, and historical indicators.

---

## 📸 Overview

The application provides an intuitive multi-section form interface that allows healthcare professionals and analysts to:

- Select a **disease category** and **target month**
- Auto-load **historical case data** from the database
- Input **environmental factors** (humidity, rainfall, temperature)
- Set **social indicators** (festival events, public awareness level)
- Receive **AI-generated predictions** visualized in a result panel

---

## 🗂️ Project Structure

```
hospital-frontend/
├── public/                   # Static assets
├── src/
│   ├── assets/               # Images, icons
│   ├── components/
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── Navbar.css
│   │   ├── PredictionForm.jsx # Main multi-section prediction form
│   │   ├── PredictionForm.css
│   │   ├── ResultPanel.jsx    # Displays prediction results
│   │   ├── ResultPanel.css
│   │   ├── StatsBar.jsx       # Summary statistics bar
│   │   └── StatsBar.css
│   ├── App.jsx                # Root application component
│   ├── App.css
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── .env.development           # Dev environment variables
├── .env.production            # Prod environment variables
├── index.html
├── vite.config.js             # Vite configuration (proxy setup)
├── eslint.config.js
└── package.json
```

---

## ⚙️ Tech Stack

| Layer            | Technology                          |
|------------------|--------------------------------------|
| **Framework**    | React 18 (with Hooks)               |
| **Build Tool**   | Vite                                 |
| **HTTP Client**  | Axios                                |
| **Styling**      | CSS Modules / Component-level CSS    |
| **State Mgmt**   | React `useState`, `useEffect`        |
| **Linting**      | ESLint                               |
| **API Proxy**    | Vite Dev Server Proxy → Flask backend|

---

## 🧠 Key Techniques & Concepts

### 1. 🔁 React Hooks — `useState` & `useEffect`
- `useState` manages form state across 3 logical sections:
  - `selection` — disease category + target month
  - `env` — environmental factors (humidity, rainfall, temperature)
  - `indic` — indicators (festival toggle, awareness slider)
- `useEffect` **auto-triggers** a database fetch whenever the selected month changes:
  ```js
  useEffect(() => {
    fetchDbCounts(selection.month);
  }, [selection.month]);
  ```

### 2. 🌐 Axios HTTP Requests
- **GET** `/api/history?month=<n>` — fetches historical average case counts per disease from the database
- **POST** `/api/predict-frontend` — sends all form inputs to the Flask ML backend and retrieves predictions
- Errors are gracefully caught and displayed inline without crashing the UI

### 3. 🔀 Vite API Proxy (Dev vs Prod)
Environment-aware API base URL:
```js
const API = import.meta.env.VITE_API_URL || '/api';
```
- In **development**, Vite proxies `/api` to the Flask backend (configured in `vite.config.js`)
- In **production**, `VITE_API_URL` is set via `.env.production` to point to the deployed backend

### 4. 🧩 Component-Based Architecture
Each UI concern is isolated into its own component:
- [`PredictionForm`](src/components/PredictionForm.jsx) — form logic & API calls
- [`ResultPanel`](src/components/ResultPanel.jsx) — renders prediction output
- [`StatsBar`](src/components/StatsBar.jsx) — displays aggregate statistics
- [`Navbar`](src/components/Navbar.jsx) — site-wide navigation

### 5. 🎨 Dynamic Styling with Inline Computed Styles
The **Public Awareness slider** dynamically changes badge color based on value:
```js
const awarLevel =
  awarVal < 0.34 ? { label: 'Low',      color: '#e63c3c' } :
  awarVal < 0.67 ? { label: 'Moderate', color: '#f59e0b' } :
                   { label: 'High',     color: '#10b981' };
```

### 6. 📅 Disease Category & Month Selectors (Chip UI)
Instead of standard dropdowns, the app uses **interactive chip buttons** for both disease categories and months — providing a faster, more visual user experience. Active state is tracked via class toggling:
```jsx
className={`disease-chip ${selection.category === d.value ? 'active' : ''}`}
```

### 7. 🗃️ Auto-Loading Database Panel
When a month is selected, the app automatically fetches and displays **average historical case counts** per disease for that month. Users can also manually refresh the panel. This gives doctors real context before making predictions.

### 8. 🔢 Data Parsing & Normalization
All numeric form inputs are explicitly parsed before being sent to the backend:
```js
humidity:    parseFloat(env.humidity),
rainfall:    parseFloat(env.rainfall),
temperature: parseFloat(env.temperature),
festive:     indic.festive === 'yes' ? 1 : 0,
awareness:   parseFloat(indic.awareness),
```

### 9. 🔒 Form Validation
Before submitting, the form checks that all environmental fields are filled:
```js
if (!env.humidity || !env.rainfall || !env.temperature) {
  setError('Please fill all Environmental Factor fields.');
  return;
}
```

---

## 🌍 Environment Variables

| Variable          | File                  | Purpose                              |
|-------------------|-----------------------|--------------------------------------|
| `VITE_API_URL`    | `.env.production`     | Base URL of deployed Flask backend   |
| *(not set)*       | `.env.development`    | Falls back to Vite proxy at `/api`   |

**Example `.env.production`:**
```env
VITE_API_URL=https://your-flask-backend.com/api
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Flask backend running on `http://localhost:5000` (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hospital-frontend.git
cd hospital-frontend

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```
Visit: `http://localhost:5173`

> The Vite dev server will proxy all `/api/*` requests to the Flask backend.

### Production Build

```bash
npm run build
```
Output is in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📡 API Endpoints (Expected from Flask Backend)

| Method | Endpoint               | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | `/api/history`         | Returns avg case counts for a given month|
| POST   | `/api/predict-frontend`| Returns ML-based disease predictions     |

### POST `/api/predict-frontend` — Request Body

```json
{
  "month": 6,
  "category": "Dengue",
  "humidity": 78.5,
  "rainfall": 215.4,
  "temperature": 31.2,
  "festive": 1,
  "awareness": 0.72
}
```

### GET `/api/history` — Query Params

```
GET /api/history?month=6
```

---

## 🐛 Common Issues

| Problem | Solution |
|--------|----------|
| `Prediction failed. Make sure the Flask server is running.` | Start your Flask backend on port 5000 |
| Historical data not loading | Check that `/api/history` endpoint is reachable |
| CORS errors in browser | Ensure Flask has `flask-cors` enabled |
| Build fails | Run `npm install` and check Node version ≥ 18 |

---

## 📄 License

MIT License — free to use and modify.

---

> Built with ❤️ for smarter, data-driven healthcare decisions.
