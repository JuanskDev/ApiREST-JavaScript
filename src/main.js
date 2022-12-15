console.log("Hello World");

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

// Utils

function createMovies(movies, container) {
  container.innerHTML = "";

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300/" + movie.poster_path // How to use condicional in case of 1 result have no poster_path
    );
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });

    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// Call to API

async function getTrendingMoviesPreview() {
  // --- AXIOS ---

  const { data } = await api("trending/movie/week?");
  const movies = data.results;

  /* const res = await fetch(
    "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY
  );
  const data = await res.json();

  const movies = data.results; */ //   --------- METODO FETCH -----

  console.log(movies);
  createMovies(movies, trendingMoviesPreviewList);
}

async function getCategories() {
  // ---- axios ----
  const { data } = await api("genre/movie/list?");
  const categories = data.genres;

  /*  const res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY
  );
  const data = await res.json();

  const categories = data.genres; */ // ---- metodo FETCH ----

  console.log(data.genres);
  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  // --- AXIOS ---

  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;

  /* const res = await fetch(
      "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY
    );
    const data = await res.json();
  
    const movies = data.results; */ //   --------- METODO FETCH -----
  console.log(data.results);
  createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
  // --- AXIOS ---

  const { data } = await api("search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;

  /* const res = await fetch(
        "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY
      );
      const data = await res.json();
    
      const movies = data.results; */ //   --------- METODO FETCH -----
  console.log(data.results);
  createMovies(movies, genericSection);
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/week?");
  const movies = data.results;

  console.log(movies);
  createMovies(movies, genericSection);
}

async function getMovieById(id) {
  const { data: movie } = await api("movie/" + id);

  const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  console.log(movieImgUrl);
  headerSection.style.background = `
  linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 19.27%,
    rgba(0, 0, 0, 0) 29.17%
  ),
  url(${movieImgUrl})
`;
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMovies(id);
}

async function getRelatedMovies(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const moviesRelated = data.results;

  createMovies(moviesRelated, relatedMoviesContainer);
}
