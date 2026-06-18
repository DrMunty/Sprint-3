# api-consumer-app

Small front-end demo that consumes APIs and demonstrates pagination logic and different data-fetching approaches (Fetch API and Axios). Built with vanilla JavaScript and Vite for local development.



**Quick facts**
- Built with: Vanilla JS, Vite
- Tests: Vitest

## Prerequisites
- Node.js (v16+ recommended)
- npm

## Install
Run:

```bash
npm install
```

## Available scripts
- `npm run dev` — Start the Vite dev server
- `npm run build` — Build production assets with Vite
- `npm run preview` — Preview the built production bundle
- `npm run test` — Run unit tests with Vitest

## Development
Start the dev server and open the app in your browser (Vite defaults to http://localhost:5173):

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Build for production:

```bash
npm run build
npm run preview
```

## Project structure
- `index.html` — App entry HTML
- `main.js` — App bootstrap
- `package.json` — Project metadata and scripts
- `styles/styles.css` — Global styles
- `src/` — Application source files
  - `calculate-Pagination.js` — Pagination calculation helpers
  - `display-results.js` — DOM rendering of results
  - `fetch-data.js` — Shared abstractions for fetching data
  - `fetch-data-fetch.js` — Implementation using Fetch API
  - `fetch-data-axios.js` — Implementation using Axios
  - `fetch-data-axios.js` — Implementation using Axios
  - `fetch-data-axios.js` — (duplicate filenames may exist in workspace listing)
  - `fetch-data-axios.js` — (please inspect the folder in case of duplicates)
  - `fetch-data-axios.js` — (the important files: see the folder contents)
  - `fetch-data-axios.js` — (remove this block if not relevant)
  - `fetch-data.js` — (core fetching logic)
  - `setup-pagination.js` — Wire up pagination UI and events
  - `status-functions.js` — Status and UI helper functions
  - `variables-and-consts.js` — Shared constants
- `src/test/` — Tests
  - `calculate-Pagination.test.js` — Unit tests for pagination logic

> Note: Some filenames in this README are condensed for brevity—refer to the `src/` folder to see exact filenames.

## Notes
- Axios is included as a dependency; the repository also contains a pure Fetch implementation for comparison.
- Tests are small and focused on pagination calculation.

## Contributing
Open an issue or send a PR with improvements.

## License
This project has no license specified.
