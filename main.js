const storageKey = "STORAGE_KEY";
const submitAction = document.getElementById("bookForm");
const searchInput = document.getElementById("searchBookTitle");
const searchButton = document.getElementById("searchSubmit");

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${timestamp}${randomNum}`;
}

function getBookList() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  }
  return [];
}

function putBookList(data) {
  if (checkForStorage()) {
    let bookData = getBookList();
    bookData.unshift(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function updateBookList(updatedBookData) {
  localStorage.setItem(storageKey, JSON.stringify(updatedBookData));
}

function deleteBook(bookId) {
  const isConfirmed = confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (isConfirmed) {
    let bookData = getBookList().filter((book) => book.id !== bookId);
    updateBookList(bookData);
    alert("Buku telah dihapus!");
    clearSearchAndRender();
  }
}

function toggleIsComplete(bookId) {
  let bookData = getBookList().map((book) => {
    if (book.id === bookId) {
      book.isComplete = !book.isComplete;
    }
    return book;
  });
  updateBookList(bookData);
  clearSearchAndRender();
}

function editBook(bookId) {
  const book = getBookList().find((b) => b.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;
    document.getElementById("bookFormSubmit").textContent = "Edit Buku";
    document.getElementById("bookFormSubmit").dataset.bookId = bookId;
  }
}

function clearSearchAndRender() {
  searchInput.value = "";
  renderBookList();
}

function renderBookList(books = getBookList()) {
  const completeBookshelf = document.getElementById("completeBookList");
  const incompleteBookshelf = document.getElementById("incompleteBookList");

  completeBookshelf.innerHTML = "";
  incompleteBookshelf.innerHTML = "";

  books.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("card");
    bookDiv.setAttribute("data-bookid", book.id);
    bookDiv.setAttribute("data-testid", "bookItem");

    const isCompleteButtonText = book.isComplete
      ? "Belum selesai di Baca"
      : "Selesai dibaca";

    bookDiv.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button class="green" data-testid="bookItemIsCompleteButton">${isCompleteButtonText}</button>
        <button class="red" data-testid="bookItemDeleteButton">Hapus buku</button>
        <button class="yellow" data-testid="bookItemEditButton">Edit buku</button>
      </div>
    `;

    (book.isComplete ? completeBookshelf : incompleteBookshelf).appendChild(bookDiv);

    const deleteButton = bookDiv.querySelector('[data-testid="bookItemDeleteButton"]');
    const completeButton = bookDiv.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const editButton = bookDiv.querySelector('[data-testid="bookItemEditButton"]');

    deleteButton.addEventListener("click", () => deleteBook(book.id));
    completeButton.addEventListener("click", () => toggleIsComplete(book.id));
    editButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      editBook(book.id);
    });
  });
}

submitAction.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputTitle = document.getElementById("bookFormTitle").value;
  const inputAuthor = document.getElementById("bookFormAuthor").value;
  const inputYear = parseInt(document.getElementById("bookFormYear").value, 10);
  const inputIsComplete = document.getElementById("bookFormIsComplete").checked;
  const bookId = document.getElementById("bookFormSubmit").dataset.bookId;

  if (bookId) {
    let bookData = getBookList().map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          title: inputTitle,
          author: inputAuthor,
          year: inputYear,
          isComplete: inputIsComplete,
        };
      }
      return book;
    });
    updateBookList(bookData);
    document.getElementById("bookFormSubmit").textContent = "Masukkan Buku ke rak";
    delete document.getElementById("bookFormSubmit").dataset.bookId;
  } else {
    const newBookData = {
      id: generateUniqueId(),
      title: inputTitle,
      author: inputAuthor,
      year: inputYear,
      isComplete: inputIsComplete,
    };
    putBookList(newBookData);
  }

  submitAction.reset();
  clearSearchAndRender();
});

searchButton.addEventListener("click", function (event) {
  event.preventDefault(); 
  const searchTerm = searchInput.value.toLowerCase();
  const filteredBooks = getBookList().filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
  );
  renderBookList(filteredBooks);
});

window.addEventListener("load", function () {
  if (checkForStorage()) {
    if (localStorage.getItem(storageKey) !== null) {
      renderBookList();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
