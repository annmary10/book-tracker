const STORAGE_KEY = "bookshelf-library-v1";
const coverTones = ["0", "1", "2", "3", "4", "5"];

const elements = {
  addButton: document.querySelector("#add-book"),
  emptyAddButton: document.querySelector("#empty-add"),
  dialog: document.querySelector("#book-dialog"),
  form: document.querySelector("#book-form"),
  title: document.querySelector("#book-title"),
  author: document.querySelector("#book-author"),
  status: document.querySelector("#book-status"),
  rating: document.querySelector("#book-rating"),
  cover: document.querySelector("#book-cover"),
  notes: document.querySelector("#book-notes"),
  id: document.querySelector("#book-id"),
  grid: document.querySelector("#book-grid"),
  empty: document.querySelector("#empty-state"),
  emptyTitle: document.querySelector("#empty-title"),
  emptyCopy: document.querySelector("#empty-copy"),
  search: document.querySelector("#search"),
  sort: document.querySelector("#sort-order"),
  count: document.querySelector("#book-count"),
  storageMessage: document.querySelector("#storage-message"),
  dialogTitle: document.querySelector("#dialog-title"),
  saveButton: document.querySelector("#save-book")
};

let books = loadBooks();
let activeFilter = "all";

function loadBooks() {
  try {
    const storedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(storedBooks) ? storedBooks.filter(isBook) : [];
  } catch {
    showStorageMessage("Your browser could not read saved books. You can still use the shelf for this visit.");
    return [];
  }
}

function isBook(book) {
  return book && typeof book.id === "string" && typeof book.title === "string" && typeof book.author === "string";
}

function showStorageMessage(message) {
  elements.storageMessage.textContent = message;
  elements.storageMessage.hidden = false;
}

function saveBooks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    elements.storageMessage.hidden = true;
    return true;
  } catch {
    showStorageMessage("This browser could not save your changes. Check its storage settings and try again.");
    return false;
  }
}

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function statusLabel(status) {
  return { "to-read": "Want to read", reading: "Reading", finished: "Finished" }[status] || "Want to read";
}

function visibleBooks() {
  const query = elements.search.value.trim().toLocaleLowerCase();
  const filtered = books.filter(book => {
    const matchesStatus = activeFilter === "all" || book.status === activeFilter;
    const matchesSearch = `${book.title} ${book.author}`.toLocaleLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return filtered.sort((first, second) => {
    if (elements.sort.value === "title") return first.title.localeCompare(second.title);
    if (elements.sort.value === "author") return first.author.localeCompare(second.author) || first.title.localeCompare(second.title);
    return second.createdAt - first.createdAt;
  });
}

function renderBook(book, index) {
  const safeTitle = escapeText(book.title);
  const safeAuthor = escapeText(book.author);
  const cover = safeCoverUrl(book.cover);
  const coverContent = cover
    ? `<img class="cover-art" src="${cover}" alt="Cover of ${safeTitle}" loading="lazy"><div class="cover-placeholder cover-fallback" hidden><strong>${safeTitle}</strong><span>${safeAuthor}</span></div>`
    : `<div class="cover-placeholder"><strong>${safeTitle}</strong><span>${safeAuthor}</span></div>`;
  const rating = book.rating ? `<div class="book-rating" aria-label="Rated ${book.rating} out of 5">${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}</div>` : "";
  const notes = book.notes ? `<p class="book-notes">${escapeText(book.notes)}</p>` : "";
  const tone = coverTones[index % coverTones.length];

  return `<article class="book-card" data-book-id="${escapeText(book.id)}">
    <div class="cover-wrap" data-tone="${tone}">
      ${coverContent}
      <span class="status-pill">${statusLabel(book.status)}</span>
      <div class="book-menu">
        <button class="icon-button edit-book" type="button" aria-label="Edit ${safeTitle}">✎</button>
        <button class="icon-button delete-book" type="button" aria-label="Remove ${safeTitle}">×</button>
      </div>
    </div>
    <h3 class="book-title">${safeTitle}</h3>
    <p class="book-author">${safeAuthor}</p>
    ${rating}${notes}
  </article>`;
}

function updateStats() {
  document.querySelector("#stat-total").textContent = books.length;
  document.querySelector("#stat-to-read").textContent = books.filter(book => book.status === "to-read").length;
  document.querySelector("#stat-reading").textContent = books.filter(book => book.status === "reading").length;
  document.querySelector("#stat-finished").textContent = books.filter(book => book.status === "finished").length;
  elements.count.textContent = `${books.length} ${books.length === 1 ? "book" : "books"}`;
}

function updateEmptyState(visible) {
  const noBooks = books.length === 0;
  elements.grid.hidden = visible.length === 0;
  elements.empty.hidden = visible.length !== 0;

  if (noBooks) {
    elements.emptyTitle.textContent = "Every good shelf starts somewhere.";
    elements.emptyCopy.textContent = "Add a book you love, a book you can't wait to read, or both.";
    elements.emptyAddButton.hidden = false;
  } else {
    elements.emptyTitle.textContent = "No books found.";
    elements.emptyCopy.textContent = "Try another search or choose a different shelf filter.";
    elements.emptyAddButton.hidden = true;
  }
}

function render() {
  updateStats();
  const visible = visibleBooks();
  elements.grid.innerHTML = visible.map(renderBook).join("");
  updateEmptyState(visible);
}

function safeCoverUrl(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? escapeText(parsed.href) : "";
  } catch {
    return "";
  }
}

function openDialog(book) {
  elements.form.reset();
  elements.id.value = book?.id || "";
  elements.title.value = book?.title || "";
  elements.author.value = book?.author || "";
  elements.status.value = book?.status || "to-read";
  elements.rating.value = book?.rating || "";
  elements.cover.value = book?.cover || "";
  elements.notes.value = book?.notes || "";
  elements.dialogTitle.textContent = book ? "Edit book" : "Add a book";
  elements.saveButton.textContent = book ? "Save changes" : "Save to shelf";
  elements.dialog.showModal();
  elements.title.focus();
}

function closeDialog() {
  elements.dialog.close();
}

elements.addButton.addEventListener("click", () => openDialog());
elements.emptyAddButton.addEventListener("click", () => openDialog());
document.querySelector("#close-dialog").addEventListener("click", closeDialog);
document.querySelector("#cancel-dialog").addEventListener("click", closeDialog);

elements.form.addEventListener("submit", event => {
  event.preventDefault();
  if (!elements.form.reportValidity()) return;

  const id = elements.id.value || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
  const existing = books.find(book => book.id === id);
  const book = {
    id,
    title: elements.title.value.trim(),
    author: elements.author.value.trim(),
    status: elements.status.value,
    rating: Number(elements.rating.value) || 0,
    cover: elements.cover.value.trim(),
    notes: elements.notes.value.trim(),
    createdAt: existing?.createdAt || Date.now()
  };

  if (existing) books = books.map(item => item.id === id ? book : item);
  else books.push(book);
  saveBooks();
  closeDialog();
  render();
});

document.querySelectorAll(".filter-tab").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-tab").forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
    render();
  });
});

elements.search.addEventListener("input", render);
elements.sort.addEventListener("change", render);

elements.grid.addEventListener("click", event => {
  const card = event.target.closest("[data-book-id]");
  if (!card) return;
  const book = books.find(item => item.id === card.dataset.bookId);
  if (!book) return;

  if (event.target.closest(".edit-book")) {
    openDialog(book);
  } else if (event.target.closest(".delete-book") && window.confirm(`Remove “${book.title}” from your shelf?`)) {
    books = books.filter(item => item.id !== book.id);
    saveBooks();
    render();
  }
});

elements.grid.addEventListener("error", event => {
  if (event.target.matches(".cover-art")) {
    event.target.hidden = true;
    const fallback = event.target.parentElement.querySelector(".cover-fallback");
    if (fallback) fallback.hidden = false;
  }
}, true);

document.addEventListener("keydown", event => {
  if (event.key === "/" && !elements.dialog.open && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    elements.search.focus();
  }
});

render();