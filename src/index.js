import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    e.preventDefault();

    const value = e.target.value.trim();

    if(value === '') {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
        return;
    }
    
    fetchCountries(value).then(countries => {
        if(countries.length > 10) {
            return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.'); 
        } else if(countries.length === 1){
            showInfoСountry(countries);
            return;
        } else {
            showInfoCountryList(countries);
            return;
        }
    })
    .catch(error => {
        return Notiflix.Notify.failure('Oops, there is no country with that name');
    })
    console.log(fetchCountries(value))
}

function showInfoСountry(country){
    const cardMarkup = country.map(({flags, name, capital, population, languages}) => `
    <p><img src = '${flags.svg}' alt = '${name.official}'  width = '50' height = '50'>${name.official}</p>
    <ul class="country-list" style="list-style:none">
        <li class="country-list__item">Capital: ${capital}</li>
        <li class="country-list__item">Population: ${population}</li>
        <li class="country-list__item">Languages: ${Object.values(languages)}</li>
    </ul>`
).join('');
countryInfo.innerHTML = cardMarkup;
}

function showInfoCountryList(countries){
    const listMarkup = countries.map(({ flags, name }) =>  `<li class="country-list__item>
    <p><img src='${flags.svg}' alt= '${name.official}' width ='50' height ='50' >${name.official}</p>
    </li>`
).join('');
countryInfo.innerHTML = listMarkup;
}

countryInfo.style.listStyle = 'none';
