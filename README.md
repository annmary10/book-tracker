# Bookshelf

A small, browser-based book tracker built with plain HTML, CSS, and JavaScript. Add books, track reading status, rate finished reads, search your shelf, and keep personal notes. Your library is saved in the browser on the device you use.

## Run it

Open `index.html` in a modern browser. No build step or dependencies are required.

## Publish with GitHub Pages

1. Create a public GitHub repository named `book-tracker`.
2. Upload `index.html`, `style.css`, `app.js`, `README.md`, and `PROMPTS.md` to the repository root.
3. In the repository, open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. After GitHub Pages finishes deploying, open the published URL in a private window and test adding a book and refreshing.

The app's data is stored in browser local storage. It is not synced between devices or browsers. The optional cover image URL is loaded from the address you provide.

## Files

- `index.html` contains the app structure and dialog form.
- `style.css` contains responsive styling.
- `app.js` handles the library, filters, and browser storage.
- `PROMPTS.md` records the prompts used to shape the product.