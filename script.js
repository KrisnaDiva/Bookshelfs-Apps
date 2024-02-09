const storageKey = "STORAGE_KEY";
const submitAction = document.getElementById("inputBook");

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function putBookList(data) {
  if (checkForStorage()) {
    let bookData = [];
    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }
    bookData.unshift(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function getBookList() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } else {
    return [];
  }
}

function deleteBook(bookId) {
  const isConfirmed = confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (isConfirmed) {
    let bookData = getBookList();
    bookData = bookData.filter((book) => book.id !== bookId);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    alert("Buku telah dihapus!");
    renderBookList();
  }
}

function toggleIsComplete(bookId) {
  let bookData = getBookList();
  const updatedBookData = bookData.map((book) => {
    if (book.id === bookId) {
      book.isComplete = !book.isComplete;
    }
    return book;
  });
  localStorage.setItem(storageKey, JSON.stringify(updatedBookData));
}

document.addEventListener("click", function (event) {
  const target = event.target;
  if (target.tagName === "BUTTON" && target.id.startsWith("completeButton_")) {
    const bookId = target.id.replace("completeButton_", "");
    toggleIsComplete(bookId);
    renderBookList();
  }
});

function renderBookList() {
  const bookData = getBookList();
  const completeBookshelf = document.getElementById("completeBookshelfList");
  const incompleteBookshelf = document.getElementById(
    "incompleteBookshelfList"
  );

  completeBookshelf.innerHTML = "";
  incompleteBookshelf.innerHTML = "";

  for (let book of bookData) {
    let article = document.createElement("article");
    article.className = "book_item";

    const completeButtonId = `completeButton_${book.id}`;
    const deleteButtonId = `deleteButton_${book.id}`;

    article.innerHTML = `
<h3>${book.title}</h3>
<p>Penulis: ${book.author}</p>
<p>Tahun: ${book.year}</p>

<div class="action">
  ${
    book.isComplete
      ? `<button class="green" id="${completeButtonId}">Belum selesai di Baca</button>`
      : `<button class="green" id="${completeButtonId}">Selesai dibaca</button>`
  }
  <button class="red" id="${deleteButtonId}">Hapus buku</button>
</div>
`;

    if (book.isComplete) {
      completeBookshelf.appendChild(article);
    } else {
      incompleteBookshelf.appendChild(article);
    }
    document.getElementById(deleteButtonId).addEventListener("click", function () {
        deleteBook(book.id);
        renderBookList();
      });
  }
}

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${timestamp}${randomNum}`;
}

submitAction.addEventListener("submit", function (event) {
  const inputTitle = document.getElementById("inputBookTitle").value;
  const inputAuthor = document.getElementById("inputBookAuthor").value;
  const inputYear = parseInt(
    document.getElementById("inputBookYear").value,
    10
  );
  const inputIsComplete = document.getElementById("inputBookIsComplete").checked;
  const newBookData = {
    id: generateUniqueId(),
    title: inputTitle,
    author: inputAuthor,
    year: inputYear,
    isComplete: inputIsComplete,
  };
  putBookList(newBookData);
  renderBookList();
});

window.addEventListener("load", function () {
  if (checkForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      renderBookList();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
