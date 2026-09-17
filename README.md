# Luciole Analytics v2

React + TypeScript + SCSS app to analyze **GOPro Tickets Résolus** CSV exports and generate analytics reports.

## Features

- **File input**: Upload a CSV file with columns `Tâche`, `Categorie`, `Type`, `Release`
- **Analytics reports**:
  - Summary cards (total tasks, releases, categories, avg per release)
  - Category distribution (pie chart)
  - Release distribution (pie chart with release selector)
  - Evolution by release (line chart)
  - Release breakdown by category (stacked bar table)

## CSV format

Expected columns:

- `Tâche` – Ticket ID and description (must start with `DSR-`)
- `Categorie` – Category (e.g. Composant, Devops / Architecture, MCO, Documentation)
- `Type` – Ticket type (Anomalie, Evolution, User Story) — parsed but not displayed in v2.1
- `Release` – Release date in DD-MM-YYYY format

Rows with invalid or missing release dates are skipped with a warning.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Usage

1. Click **Importer un fichier CSV**
2. Select your GOPro tickets export CSV file
3. View the generated analytics reports

## GitHub Pages

The app deploys to GitHub Pages on every push to `main`. Enable it in **Settings → Pages** by selecting **GitHub Actions** as the source. The site will be available at:

**https://diazailan.github.io/luciole-analytics-v2/**
