"use strict";
import {$} from "./modules/nQuery.js";
import {Ajax} from "./modules/Ajax.js";

/*
 * Event handler for button - create ajax object and get data
 */

function convertToCelcius(x){
    let kelvin = 273.15;
    let temp = x - kelvin; 
    temp = Math.round(temp);
    return temp;
}

const getContinents = function(ev) {
    let req = Object.create(Ajax);
    req.init();
    req.getFile("/continents", showContinents);
};
const getCountries = function(ev) {
    let req = Object.create(Ajax);
    req.init();
    req.getFile(`/countries/${ev.target.value}`, showCountries);
};

const getCities = function(ev) {
    let req = Object.create(Ajax);
    req.init();
    req.getFile(`/cities/${ev.target[ev.target.selectedIndex].id}`, showCities);
};
/*
 * callback function for the above AJaX
 */
const showContinents = function(e) {
    /*
     * here you put the ajax response onto your page DOM
     */
    console.log(e.target.getResponseHeader("Content-Type"));
    let element = $("contdata");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    let div = document.createElement("div");
    let h3 = document.createElement('h3');
    let txt = document.createTextNode('The Continents');
    h3.appendChild(txt);
    div.appendChild(h3);
    let continents = JSON.parse(e.target.responseText);
    let sel = document.createElement('select');
    sel.setAttribute('id', 'chooseContinent');
    sel.addEventListener('change', getCountries);
    continents.forEach(function(continent) {
        let opt = document.createElement('option');
        let opttext = document.createTextNode(continent.name);
        opt.appendChild(opttext);
        sel.appendChild(opt);
    });
    sel.value = "Choose continent"; 
    div.appendChild(sel);
    $("contdata").appendChild(div);
}

const showCities = function (e) {
    let element = $("citydata");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    let div = document.createElement("div");
    let h3 = document.createElement('h3');
    let txt = document.createTextNode('The Cities');
    h3.appendChild(txt);
    div.appendChild(h3);
    let cities = JSON.parse(e.target.responseText);
    let sel = document.createElement('select');
    sel.setAttribute('id', 'chooseCountry');
    
    sel.addEventListener('change', getWeather);
    cities.forEach(function(city) {
        let opt = document.createElement('option');
        let opttext = document.createTextNode(city.name);
        opt.appendChild(opttext);
        sel.appendChild(opt);
    });
    sel.value = "Choose city"; 
    div.appendChild(sel);
    $("citydata").appendChild(div);


}

const showCountries = function (e) {
    /*
     * here you put the ajax response onto your page DOM
     */
    console.log(e.target.getResponseHeader("Content-Type"));
    let element = $("countdata");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    let div = document.createElement("div");
    let h3 = document.createElement('h3');
    let txt = document.createTextNode('The Countries');
    h3.appendChild(txt);
    div.appendChild(h3);
    let countries = JSON.parse(e.target.responseText);
    let sel = document.createElement('select');
    sel.setAttribute('id', 'chooseCountry');
    sel.addEventListener('change', getCities);
    countries.forEach(function(country) {
        let opt = document.createElement('option');
        opt.setAttribute('id', country.code);
        let opttext = document.createTextNode(country.name);
        opt.appendChild(opttext);
        sel.appendChild(opt);
    });
    div.appendChild(sel);
    $("countdata").appendChild(div);
};

const getWeather = function(e){
    let req = Object.create(Ajax);
    req.init();
    let city = e.target[e.target.selectedIndex].value;
    req.getFile(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1c40c518571d79e7f81134c6c8e517ba`, showWeather);

}

const showWeather = function(e){
    let weatherDiv = $('weatherdiv');
    let element = $("weatherdata");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    let weatherInfo = JSON.parse(e.target.responseText);
    let desc = weatherInfo.weather[0].description;
    console.log("Weather: " + weatherInfo);
    let div = document.createElement('div');
    div.innerHTML = `<h3>Weatherinfo</h3> <p id="temp">Temperature: ${convertToCelcius(weatherInfo.main.temp)}°</p>
    <p id="wind">Windspeed: ${Math.round(weatherInfo.wind.speed)} m/s </p>
    <p id="condition">Condition: ${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>`

    element.appendChild(div);
    weatherDiv.appendChild(element);
}

/*
 *  Listen to the get films button
 */
const showStarter = function () {
    $('gcont').addEventListener('click', getContinents);
}

window.addEventListener("load", showStarter);                   // kick off JS
