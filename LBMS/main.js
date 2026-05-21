const STORAGE_KEY = 'lbms-books';

let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', quantity: 5 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', quantity: 3 },
  { id: 3, title: '1984', author: 'George Orwell', category: 'Dystopian', quantity: 4 },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', quantity: 2 },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', quantity: 6 },
  { id: 6, title: "Harry Potter and the Sorcerer's Stone", author: 'J.K. Rowling', category: 'Fantasy', quantity: 8 }
];
let selectedBookId = null;

const bookGrid = document.getElementById('book-grid');
const addBookForm = document.getElementById('add-book-form');
const editBookSection = document.getElementById('edit-book-section');
const editBookForm = document.getElementById('edit-book-form');
const messageBox = document.getElementById('message-box');
const bookCount = document.getElementById('book-count');
const contactForm = document.getElementById('contact-form');

function loadBooks() {
  const storedBooks = window.localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    try {
      books = JSON.parse(storedBooks);
    } catch (error) {
      console.warn('Failed to parse stored books:', error);
    }
  }
}

function saveBooks() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function showMessage(message, type = 'info') {
  if (!messageBox) {
    window.alert(message);
    return;
  }

  messageBox.textContent = message;
  messageBox.className = `message ${type}`;
  messageBox.style.display = 'block';
  setTimeout(() => {
    if (messageBox) messageBox.style.display = 'none';
  }, 3000);
}

function updateBookCount() {
  if (!bookCount) return;
  bookCount.textContent = `Showing ${books.length} book${books.length === 1 ? '' : 's'}`;
}

function renderBooks() {
  if (!bookGrid) return;

  if (books.length === 0) {
    bookGrid.innerHTML = '<p class="empty-message">No books available yet. Add a book to get started.</p>';
    updateBookCount();
    return;
  }

  bookGrid.innerHTML = books
    .map(
      (book) => `
        <div class="book-card">
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Category:</strong> ${book.category}</p>
          <p><strong>Quantity:</strong> ${book.quantity}</p>
          <div class="card-actions">
            <button class="edit-btn" type="button" data-id="${book.id}">Edit</button>
            <button class="delete-btn" type="button" data-id="${book.id}">Delete</button>
          </div>
        </div>
      `
    )
    .join('');

  updateBookCount();
  attachCardActions();
}

function attachCardActions() {
  const editButtons = document.querySelectorAll('.edit-btn');
  const deleteButtons = document.querySelectorAll('.delete-btn');

  editButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      startEditBook(id);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      handleDeleteBook(id);
    });
  });
}

function getFormValues(form) {
  const title = form.querySelector('#title')?.value.trim();
  const author = form.querySelector('#author')?.value.trim();
  const category = form.querySelector('#category')?.value.trim();
  const quantityValue = form.querySelector('#quantity')?.value;
  const quantity = Number(quantityValue);
  return { title, author, category, quantity, quantityValue };
}

function validateBookData({ title, author, category, quantity, quantityValue }) {
  if (!title || !author || !category || !quantityValue) {
    showMessage('Please fill in all book fields.', 'error');
    return false;
  }

  if (quantity <= 0 || Number.isNaN(quantity)) {
    showMessage('Quantity must be a valid number larger than zero.', 'error');
    return false;
  }

  return true;
}

function resetAddForm() {
  if (!addBookForm) return;
  addBookForm.reset();
  addBookForm.querySelector('#title')?.focus();
}

function handleAddBook(event) {
  event.preventDefault();
  if (!addBookForm) return;
  const bookData = getFormValues(addBookForm);

  if (!validateBookData(bookData)) return;

  const nextId = books.length ? Math.max(...books.map((book) => book.id)) + 1 : 1;
  books.push({ id: nextId, title: bookData.title, author: bookData.author, category: bookData.category, quantity: bookData.quantity });
  saveBooks();
  renderBooks();
  resetAddForm();
  showMessage('Book added successfully.', 'success');
}

function startEditBook(bookId) {
  const book = books.find((item) => item.id === bookId);
  if (!book || !editBookSection || !editBookForm) return;

  selectedBookId = bookId;
  editBookSection.classList.remove('hidden');
  editBookForm.querySelector('#edit-title').value = book.title;
  editBookForm.querySelector('#edit-author').value = book.author;
  editBookForm.querySelector('#edit-category').value = book.category;
  editBookForm.querySelector('#edit-quantity').value = book.quantity;
  editBookForm.querySelector('#edit-title')?.focus();
}

function handleUpdateBook(event) {
  event.preventDefault();
  if (!editBookForm || selectedBookId === null) return;

  const title = editBookForm.querySelector('#edit-title')?.value.trim();
  const author = editBookForm.querySelector('#edit-author')?.value.trim();
  const category = editBookForm.querySelector('#edit-category')?.value.trim();
  const quantityValue = editBookForm.querySelector('#edit-quantity')?.value;
  const quantity = Number(quantityValue);
  const bookData = { title, author, category, quantity, quantityValue };

  if (!validateBookData(bookData)) return;

  const bookIndex = books.findIndex((item) => item.id === selectedBookId);
  if (bookIndex === -1) return;

  books[bookIndex] = { ...books[bookIndex], title, author, category, quantity };
  saveBooks();
  renderBooks();
  cancelEdit();
  showMessage('Book updated successfully.', 'success');
}

function cancelEdit() {
  selectedBookId = null;
  if (editBookSection) editBookSection.classList.add('hidden');
}

function handleDeleteBook(bookId) {
  const confirmed = window.confirm('Delete this book? This cannot be undone.');
  if (!confirmed) return;

  books = books.filter((item) => item.id !== bookId);
  saveBooks();
  renderBooks();
  showMessage('Book deleted successfully.', 'success');
  if (selectedBookId === bookId) cancelEdit();
}

function handleContactSubmit(event) {
  event.preventDefault();
  if (!contactForm) return;
  contactForm.reset();
  showMessage('Thank you! Your message has been sent.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  loadBooks();

  if (bookGrid) {
    renderBooks();
  }

  if (addBookForm) {
    addBookForm.addEventListener('submit', handleAddBook);
  }

  if (editBookForm) {
    editBookForm.addEventListener('submit', handleUpdateBook);
    const cancelButton = editBookForm.querySelector('#cancel-edit');
    if (cancelButton) {
      cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        cancelEdit();
      });
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
});
