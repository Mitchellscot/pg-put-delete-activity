$(ready);

function ready(){
  console.log('Hello Mitchell');
  refreshBooks();
  $('#submitBtn').on('click', handleSubmit);
  $('table').on('click', '.delete', deleteBook);
}

function deleteBook(event) {
  console.log($(event.target).data().bookid);
  const bookId = $(event.target).data('bookid');
  console.log(`deleting book with delete button, ID: ${bookId}`);
  $.ajax({
    method: "DELETE",
    url: `/books/${bookId}`,
  }).then((response) => {
    refreshBooks();
  })

}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td><button type="button" class="update" data-bookid=${book.id}>READ</button></td>`);
    $tr.append(`<td><button type="button" class="delete" data-bookid=${book.id}>DELETE</button></td>`);
    $('#bookShelf').append($tr);
  }
}
