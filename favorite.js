const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = JSON.parse(localStorage.getItem("favoriteMovies"));
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

function showMovie(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDescription.innerText = data.description;
    modalDate.innerText = "Release: " + data.release_date;
    modalImage.innerHTML = `<img
    src=${POSTER_URL + data.image}
    alt="movie-poster" class="img-fluid"/>`;
  });
}

function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
    <div class="mb-2">
    <div class="card">
    <img
    src="${POSTER_URL + item.image}"
    class="card-img-top" alt="Movie Poster" />
    <div class="card-body">
    <h5 class="card-title">${item.title}</h5>
    </div>
    <div class="card-footer">
    <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${
      item.id
    }">More</button>
    <button class="btn btn-danger btn-remove-favorite" data-id=${
      item.id
    }>-</button>
    </div>
    </div>
    </div>
    </div>`;

    dataPanel.innerHTML = rawHTML;
  });
}

// function addToFavorite(id) {
//   console.log(id);
//   const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
//   const movie = movies.find((e) => e.id === id);
//   if (list.some((e) => e.id === id)) {
//     return alert("此電影已經收藏在清單中！");
//   }
//   list.push(movie);
//   localStorage.setItem("favoriteMovies", JSON.stringify(list));
// }

function removeFromFavotite(id) {
  if (!movies) {
    console.log("no movies");
  }
  const movieIndex = movies.findIndex((e) => e.id === id);
  movieIndex !== -1 && movies.splice(movieIndex, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  renderMovieList(movies);
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovie(Number(event.target.dataset.id));
  } else {
    removeFromFavotite(Number(event.target.dataset.id));
  }
});

renderMovieList(movies);
