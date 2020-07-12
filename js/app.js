"use strict";

const select = document.getElementById("select"),
  start = document.getElementById("start"),
  body = document.querySelector("body"),
  heroesInner = document.querySelector(".heroes__inner");

//////////////////////////////////////////////////////////////////////////////////

const getData = () => {
  start.style.display = "none";
  select.style.display = "block";

  const request = new XMLHttpRequest();

  request.open("GET", "dbHeroes.json");

  request.setRequestHeader("Content-Type", "application/json");

  request.send();

  request.addEventListener("readystatechange", () => {
    if (request.readyState === 4 && request.status === 200) {
      const data = JSON.parse(request.responseText);

      addCard(data);
      let filteredMovies = [];

      data.forEach((item) => {
        select.innerHTML = `<option value="0">Chose film</option>`;
        if (item.movies) {
          item.movies.forEach((item) => {
            filteredMovies.push(item);
          });
        }
        filteredMovies = new Set(filteredMovies);
        filteredMovies = [...filteredMovies];
        filteredMovies.forEach((item) => {
          const movie = document.createElement("option");
          movie.textContent = item;
          movie.value = item;
          select.appendChild(movie);
        });
      });

      select.addEventListener("change", () => {
        addCard(data, select.value);
      });
    }
  });
};

const addCard = (data, selectValue) => {
  heroesInner.innerHTML = "";
  data.forEach((item) => {
    if (item.movies) {
      item.movies.forEach((movieItem) => {
        if (movieItem === selectValue) {
          const card = document.createElement("div");
          card.className = "heroes__card";

          const { photo, name, movies, status, actors, birthDay, deathDay, ...options } = item;
          let moviesList = [];

          if (movies) {
            movies.forEach((item) => {
              if (item === select.value) {
              }
              item = `<li>${item}</li>`;
              moviesList.push(item);
            });
            moviesList = moviesList.join("");
          } else {
            moviesList = `There are no films yet`;
          }

          let lifePeriod = "Unknown";

          if (birthDay && deathDay) {
            lifePeriod = `${birthDay} - ${deathDay}`;
          }

          let op = [];
          for (const key in options) {
            item = `<li>${key} - ${options[key]}</li>`;
            op.push(item);
          }
          op = op.join("");

          card.innerHTML = `
            <div class="heroes__card-image" style="background-image: url(${photo});"></div>
            <div class="heroes__card-inner">
              <div class="heroes__card-descr">
                <div class="heroes__card-name title">${name}</div>
                <div class="heroes__card-actor">Actor: ${actors}</div>
                <div class="heroes__card-period">Life Period: ${lifePeriod}</div>
              </div>
              <div class="heroes__card-info-title title">Information</div>
              <div class="heroes__card-info">
                <ul>
                  ${op}
                </ul>
              </div>
              <div class="heroes__card-movies-title title">Film List</div>
              <div class="heroes__card-movies">
                <ul>
                  ${moviesList}
                </ul>
              </div>
            </div>
        `;
          heroesInner.appendChild(card);
        }
      });
    }
  });
};

start.addEventListener("click", getData);
