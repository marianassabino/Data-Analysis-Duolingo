# 📊 Duolingo Learning Traces — Interactive Dashboard

An interactive React dashboard for exploring the [Duolingo Spaced Repetition Dataset](https://www.kaggle.com/datasets/aravinii/duolingo-spaced-repetition-data) containing **12.8 million** learning records across 6 languages and ~118K users.

All data is pre-aggregated and embedded directly in the source code — **no CSV file required**.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.12-8884d8)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Dashboard Sections

| Tab | Description |
|-----|-------------|
| **Overview** | High-level stats, sessions by language chart, and recall distribution |
| **Languages** | Detailed table with sessions, users, lexemes, and accuracy per language |
| **Difficulty** | Perfection rate for English speakers per target language + grammar radar chart |
| **Grammar** | Frequency and perfection rate by grammatical class (filterable by language) |
| **Usage Schedule** | Hourly usage pattern, weekly distribution, and daily active users timeline |
| **Top Words** | 10 most practiced words per language with accuracy rates |
| **Recall** | Full distribution of p_recall probability across all 12.8M records |

---

## Key Findings

- **English** is the most studied language (5M sessions, 43K users)
- **French** is the hardest for English speakers (81.6% perfection rate)
- **Conjunctions** are the most difficult grammar class across all languages (77.5%)
- **Peak usage** occurs at 9 PM; lowest activity at 8 AM
- **83.9%** of all records show a recall probability of 1.0 (well-memorized words)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v16 or higher

Verify your installation:

```bash
node --version
npm --version
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/marianassabino/Data-Analysis-Duolingo.git
cd Data-Analysis-Duolingo
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The app will open automatically at `http://localhost:3000`.

---

## Project Structure

```
├── public/
│   └── index.html            # HTML entry point
├── src/
│   ├── index.js              # React DOM root
│   └── Dashboard.jsx         # Main dashboard component (data + UI)
├── .gitignore
├── package.json
└── README.md
```

---

## Tech Stack

- **React 18** — UI framework
- **Recharts** — Charts and data visualization (BarChart, LineChart, ComposedChart, RadarChart)
- **Google Fonts** — Space Grotesk + JetBrains Mono

---

## Dataset

Source: [Duolingo Spaced Repetition Data](https://www.kaggle.com/datasets/aravinii/duolingo-spaced-repetition-data) on Kaggle.

The original CSV (`learning_traces.13m.csv`) contains 12,854,226 rows with the following columns:

| Column | Description |
|--------|-------------|
| `p_recall` | Predicted probability of recalling the word |
| `timestamp` | Unix timestamp of the practice session |
| `delta` | Time since last practice (seconds) |
| `user_id` | Anonymized user identifier |
| `learning_language` | Target language being studied |
| `ui_language` | User's native/interface language |
| `lexeme_string` | Word and its grammatical tags |
| `history_seen` | Total times the word was shown historically |
| `history_correct` | Total correct answers historically |
| `session_seen` | Times seen in the current session |
| `session_correct` | Correct answers in the current session |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server on port 3000 |
| `npm run build` | Create optimized production build in `build/` |

