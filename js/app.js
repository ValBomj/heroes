"use strict";

const select = document.getElementById("select"),
  start = document.getElementById("start"),
  body = document.querySelector("body"),
  heroesInner = document.querySelector(".heroes__inner");


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
      getFilms(data);
      createCard(data);
    }
  });
};

const getFilms = (data) => {
  const movies = [];

  data.forEach((item) => {
    select.innerHTML = `<option value="0">Chose film</option>`;
    if (item.movies) {
      item.movies.forEach((item) => {
        movies.push(item);
      });
    }
    const filteredMovies = new Set(movies);
    [...filteredMovies].forEach((item) => {
      const movie = document.createElement("option");
      movie.textContent = item;
      movie.value = item;
      select.appendChild(movie);
    });
  });

  select.addEventListener("change", () => {
      createCard(data, select.value);
  });
}

class Card{
  constructor({photo = './card-bg/default.png', name, movies = [], actors, birthDay, deathDay = 'Still alive', ...options}) {
    this.photo = photo;
    this.name = name;
    this.movies = movies;
    this.actors = actors;
    this.birthDay = birthDay;
    this.deathDay = deathDay;
    this.lifePeriod = '';
    this.moviesList = [];
    this.options = options;
    this.optionsList = [];
    this.card = document.createElement("div");
  }
  init() {
    this.getCardMovies();
    this.getLifePeriod();
    this.getOptions();
  }

  getCardMovies() {
    if (this.movies.length > 0) {
      this.movies.forEach((item) => {
        item = `<li>${item}</li>`;
        this.moviesList.push(item);
      });
      this.moviesList = this.moviesList.join('');
    } else {
      this.moviesList = 'There are no films yet';
    }
  }

  getLifePeriod() {
    this.lifePeriod = this.birthDay ? `${this.birthDay} - ${this.deathDay}` : 'Unknown';
  }

  getOptions() {
    for (const key in this.options) {
      const option = `<li>${key} - ${this.options[key]}</li>`;
      this.optionsList.push(option);
    }
    this.optionsList = this.optionsList.join("");
  }

  createCard(selectValue) {
    this.card.className = "heroes__card";
    this.card.innerHTML = `
      <div class="heroes__card-image" style="background-image: url(${this.photo});"></div>
      <div class="heroes__card-inner">
        <div class="heroes__card-descr">
          <div class="heroes__card-name title">${this.name}</div>
          <div class="heroes__card-actor">Actor: ${this.actors}</div>
          <div class="heroes__card-period">Life Period: ${this.lifePeriod}</div>
        </div>
        <div class="heroes__card-info-title title">Information</div>
        <div class="heroes__card-info">
          <ul>
            ${this.optionsList}
          </ul>
        </div>
        <div class="heroes__card-movies-title title">Film List</div>
        <div class="heroes__card-movies">
          <ul>
            ${this.moviesList}
          </ul>
        </div>
      </div>
    `;
    heroesInner.appendChild(this.card);
  }
}

const createCard = (data, selectValue) => {
  heroesInner.innerHTML = '';
  data.forEach(item => {
    const newCard = new Card(item);
    newCard.init();

    if (selectValue && selectValue !== '0') {
      if (newCard.movies) {
        newCard.movies.forEach(movie => {
          if (movie === selectValue) {
            newCard.createCard(selectValue);
          }
        })
      }
    } else {
      newCard.createCard(selectValue);
    }
  })
}


document.addEventListener('click', e => {
  let target = e.target;
  if (target.closest('.heroes__card')) {
    target = target.closest('.heroes__card');
    target.style.zIndex = target.style.zIndex === '10' ? 1 : 10;
    console.log( target.style.zIndex);
    target.classList.contains('floating') ? target.classList.remove('floating') : target.classList.add('floating');
  } 
})

start.addEventListener("click", getData);
