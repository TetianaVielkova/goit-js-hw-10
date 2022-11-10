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
    <ul class="country-list">
        <li><p class = "country__title"><img src = '${flags.svg}' alt = '${name.official}'  width = '50'>${name.official}</p></li>
        <li class="country-list__item"><span>Capital:&nbsp</span> ${capital}</li>
        <li class="country-list__item"><span>Population:&nbsp</span> ${population}</li>
        <li class="country-list__item"><span>Languages:&nbsp</span> ${Object.values(languages)}</li>
    </ul>`
).join('');
countryInfo.innerHTML = cardMarkup;
}

function showInfoCountryList(countries){
    const listMarkup = countries.map(({ flags, name }) =>  `<li >
    <p class="country-list--items"><img src='${flags.svg}' alt= '${name.official}' width ='50'>${name.official}</p>
    </li>`
).join('');
countryInfo.innerHTML = listMarkup;
}

