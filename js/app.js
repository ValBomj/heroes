"use strict";

const select = document.getElementById("select"),
  start = document.getElementById("start"),
  error = document.getElementById("error"),
  body = document.querySelector("body"),
  heroesInner = document.querySelector(".heroes__inner"),
  url = './dbHeroes.json';


// const getData = () => {
//   return fetch(url);
// }

// const toHTML = (hero, selectValue) => {
//   const {photo = './card-bg/default.png', name, movies = [], actors, birthDay, deathDay = 'Still alive', ...options} = hero,
//     lifePeriod = birthDay ? `${birthDay} - ${deathDay}` : 'Unknown',
//     moviesList = movies.length > 0 ? movies.map(movie => `<li>${movie}</li>`).join('') : 'There are no films yet',
//     optionsList = [];

//   for (const key in options) {
//     const option = `<li>${key} - ${options[key]}</li>`;
//     optionsList.push(option);
//   }
//   // optionsList = optionsList.join("");

//   return `
//     <div class="heroes__card">
//       <div class="heroes__card-image" style="background-image: url(${photo});"></div>
//       <div class="heroes__card-inner">
//         <div class="heroes__card-descr">
//           <div class="heroes__card-name title">${name}</div>
//           <div class="heroes__card-actor">Actor: ${actors}</div>
//           <div class="heroes__card-period">Life Period: ${lifePeriod}</div>
//         </div>
//         <div class="heroes__card-info-title title">Information</div>
//         <div class="heroes__card-info">
//           <ul>
//             ${optionsList.join("")}
//           </ul>
//         </div>
//         <div class="heroes__card-movies-title title">Film List</div>
//         <div class="heroes__card-movies">
//           <ul>
//             ${moviesList}
//           </ul>
//         </div>
//       </div>
//     </div>
//   `
// }

// const render = response => {
//   const html = response.map(toHTML);
//   let moviesList = [];
//   response.forEach(item => {
//     if (item.movies) {
//       moviesList.push(item.movies)
//     }
//   })
//   console.log(moviesList);
//   // const movies = response.map(hero => hero.movies ? hero.movies.join(', ') : '');
//   // const filteredMovies = new Set(movies);
//   console.log(filteredMovies);
//   document.querySelector(".heroes__inner").innerHTML = html;
// }

// const getMovies = response => {
//   if (response)
//   if (!response.movies) return;
//   return response.movies;
// }



// start.addEventListener('click', () => {
//   start.style.display = 'none';
//   select.style.display = 'block';
//   getData()
//     .then(response =>  response.json())
//     .then(render)
//     .catch(error => console.error(`There is an error: ${error}`))
// })


const getData = () => fetch(url);


class Card{
  constructor({photo = './card-bg/default.png', name, movies = [], actors, birthDay, deathDay = 'Still alive', ...options}) {
    this.photo = photo;
    this.name = name;
    this.movies = movies;
    this.actors = actors;
    this.moviesList = movies.length > 0 ? movies.map(movie => `<li>${movie}</li>`).join('') : 'There are no films yet';
    this.options = options;
    this.optionsList = [];
    this.lifePeriod = birthDay ? `${birthDay} - ${deathDay}` : 'Unknown';
    this.card = document.createElement("div");
  }
  init() {
    this.getOptions();
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


const getFilms = response => {
  const movies = [];

  response.forEach((item) => {
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
      createCard(response, select.value);
  });
}

const createCard = (response, selectValue) => {
  heroesInner.innerHTML = '';
  response.forEach(item => {
    const newCard = new Card(item);
    newCard.init();

    if (selectValue && selectValue !== '0') {
      if (newCard.movies) {
        newCard.movies.forEach(movie => {
          if (movie === selectValue) {
            newCard.createCard();
          }
        })
      }
    } else {
      newCard.createCard();
    }
  })
}

start.addEventListener("click", () => {

  getData()
    .then(response => {
      start.style.display = "none";
      select.style.display = "block";
      return response.json();
    })
    .then(response => {
      getFilms(response);
      createCard(response);
    })
    .catch(err => {
      heroesInner.textContent = `Что-то пошло не так... Ошибка: ${err}`;
    })
});
