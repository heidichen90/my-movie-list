const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12;

const movies = [];
let filteredMovies = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

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
    <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
    </div>
    </div>
    </div>
    </div>`;

    dataPanel.innerHTML = rawHTML;
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((e) => e.id === id);
  if (list.some((e) => e.id === id)) {
    return alert("此電影已經收藏在清單中！");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

function getMoviesByPage(page) {
  //if user havent search anything then the filtered movie should always be empty
  const data = filteredMovies.length > 0 ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function renderPaginator(amount) {
  const numOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovie(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  //search form will refresh the view on submit, this step is to prevent this happen
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filteredMovies = movies.filter((e) =>
    e.title.toLowerCase().includes(keyword)
  );

  if (filteredMovies.length === 0) {
    return alert(`no search result matches: ${keyword}`);
  }

  renderPaginator(filteredMovies.length);
  renderMovieList(getMoviesByPage(1));
});

searchForm.addEventListener("keypress", function onSearchFormSubmitted(key) {
  //search form will refresh the view on submit, this step is to prevent this happen
  if (key.code === "Enter") {
    const keyword = searchInput.value.trim().toLowerCase();

    filteredMovies = movies.filter((e) =>
      e.title.toLowerCase().includes(keyword)
    );

    if (filteredMovies.length === 0) {
      return alert(`no search result matches: ${keyword}`);
    }

    renderPaginator(filteredMovies.length);
    renderMovieList(getMoviesByPage(1));
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  renderMovieList(renderMovieList(getMoviesByPage(page)));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
  })
  .catch((error) => {
    console.log(error);
  });
