const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const MOVIES_PER_PAGE = 12;
const paginator = document.querySelector("#paginator");
let filteredMovies = [];
const displayMode = document.querySelector(".display-mode");
const DISPLAY_LIST = "displayList";
const DISPLAY_GRID = "displayGrid";
let currentPage = 1;

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  filteredMovies = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(keyword);
  });
  if (filteredMovies.length === 0) {
    return alert("Sorry, we can't find this movie." + keyword);
  }
  renderPaginator(filteredMovies.length);
  renderMovieList(dataPanel.id, getMoviesByPage(currentPage));
});

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

//////////////
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(DISPLAY_GRID, getMoviesByPage(1));
  })
  .catch((err) => console.log(err));

displayMode.addEventListener("click", function onDisplayModeClicked(event) {
  if (event.target.matches("#display-list")) {
    const amount = filteredMovies.length !== 0 ? filteredMovies.length : movies.length;
    renderPaginator(amount);
    renderMovieList(DISPLAY_LIST, getMoviesByPage(currentPage));
  } else if (event.target.matches("#display-grid")) {
    renderMovieList(DISPLAY_GRID, getMoviesByPage(currentPage));
  }
});

function renderMovieList(displayMode, data) {
  if (displayMode === DISPLAY_LIST) {
    let rawHTML = `<table class="table table-hover"><tbody>`;
    data.forEach((item) => {
      rawHTML += `
          <tr>
              <td class="col-sm-8">${item.title}</td>
              <td class="col-sm-4">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-toggle="modal"
                  data-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button></td>
          </tr>`;
    });
    dataPanel.innerHTML = rawHTML + `</tbody></table>`;
    dataPanel.id = DISPLAY_LIST;
  } else if (displayMode === DISPLAY_GRID) {
    let rawHTML = ``;
    data.forEach((item) => {
      rawHTML += `<div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-toggle="modal"
                  data-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-info btn-add-favorite" data-id="${
                  item.id
                }">+</button>
              </div>
            </div>
          </div>
        </div>`;
    });
    dataPanel.innerHTML = rawHTML;
    dataPanel.id = DISPLAY_GRID;
  }
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function renderPaginator(amount) {
  const nubmerOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= nubmerOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  currentPage = Number(event.target.dataset.page);
  renderMovieList(dataPanel.id, getMoviesByPage(currentPage));
});