const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
//將movies資料修改為localStorage中的movie資料
const movies = JSON.parse(localStorage.getItem("favoriteMovies"));
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

//將movies資料render至頁面
function renderMovieList(data) {
  let rawHTML = "";
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
                <button class="btn btn-danger btn-remove-favorite" data-id="${
                  item.id
                }">X</button>
              </div>
            </div>
          </div>
        </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//remember to call render function
renderMovieList(movies);

//More & delete button
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    //console.log(Number(event.target.dataset.id));
    removeFromFavorite(Number(event.target.dataset.id));
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

function removeFromFavorite(id) {
  if (!movies) return;
  const removeIndex = movies.findIndex((movie) => movie.id === id);
  if (removeIndex === -1) return;
  movies.splice(removeIndex, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  renderMovieList(movies);
}
