import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './service-api.js';

const DEBOUNCE_DELAY = 300;

const countryLi = document.querySelector('.country-list');
const countryInf = document.querySelector('.country-info');
const inputEl = document.querySelector('#search-box');

inputEl.addEventListener('input', debounce(onInputClick, DEBOUNCE_DELAY));

function onInputClick(event) {
  const value = event.target.value.trim();

  if (!value) {
    countryLi.innerHTML = '';
    countryInf.innerHTML = '';
    return;
  }

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryLi.innerHTML = '';
      }

      if (data.length === 1) {
        countryInf.innerHTML = createCard(data);
      }

      if (data.length > 1) {
        countryInf.innerHTML = '';
      }

      if (data.length < 10) {
        countryLi.innerHTML = createMarkup(data);
      }
    })
    .catch(onFetchError);
}

function createMarkup(arr) {
  return arr
    .map(
      ({ name: { official }, flags: { svg } }) =>
        ` <li class = "country">
            <img src = "${svg}" alt='flag_country' width = "30" height = "30">
            <h2>${official}</h2>
        </li> `
    )
    .join('');
}

function createCard(arr) {
  return arr
    .map(
      ({ capital, population, languages }) =>
        `<p class="info">Capital:<span class="text">${capital}</span></p>
           <p class="info">Population:<span class="text">${population}</span></p>
           <p class="info">Languages:<span class="text">${Object.values(
             languages
           )}</span></p>`
    )
    .join('');
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
}
