import {elements, strings} from '../base';

const days = [
    'Sun', 'Mon', 'Tues', 
    'Wed', 'Thurs', 'Fri', 'Sat'
];

const parseSun = date => {
    return {
        h: date.hour,
        mi: date.minutes,
        me: date.meridiem
    }
}

const parseQuery = query => {
    const title = query.split(' ');
    const newTitle = title.map(element => element.charAt(0).toUpperCase() + element.substr(1));
    return newTitle.join(' ');
};

const removeHourlyNext = () => {
    const button = document.querySelector(strings.hourlyNext);
    button.parentNode.removeChild(button);
};

export const getInput = () => elements.searchInput.value;
export const clearInput = () => elements.searchInput.value = "";
export const displayLoader = () => {
    const loader = `
    <svg class="bi bi-arrow-repeat" width="10em" height="10em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5 8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0 0-.708z"/>
      <path fill-rule="evenodd" d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1 14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0 0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z"/>
    </svg>
    `;
    elements.weatherContainer.classList.add("main__weather--container-loader");
    elements.weatherContainer.innerHTML = loader;
};
export const removeLoader = () => {
    const loader = document.querySelector('svg.bi-arrow-repeat');
    loader.parentNode.removeChild(loader);
    elements.weatherContainer.classList.remove("main__weather--container-loader");
};
export const displayCurrent = (query, current) => {
    const {date, dayOfWeek: day, month, year} = current.dt;
    const {h: riseHour, mi: riseMinutes, me: riseMeridiem} = parseSun(current.sunrise);
    const {h: setHour, mi: setMinutes, me: setMeridiem} = parseSun(current.sunset);
    const main = 
    `<ul class="weather__main--list">
        <li>${day} ${month} ${date}, ${year}</li>
        <li>
            <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="Description">
        </li>
        <li>Temp: ${current.temp}</li>
        <li>Description: ${current.weather[0].description}</li>
        <li>Feels Like: ${current.feels_like}</li>
        <li>Hi ${current.max} / Lo ${current.min}</li>
        <li>Sunrise: ${riseHour}:${riseMinutes} ${riseMeridiem}</li>
        <li>Sunset: ${setHour}:${setMinutes} ${setMeridiem}</li>
    </ul>`;
    const additional = 
    `<ul class="weather__additional--list">
        <li>Wind: ${current.wind_deg} ${current.wind_speed}</li>
        <li>Humidity: ${current.humidity}%</li>
        <li>Pressure: ${current.pressure}</li>
        <li>Cloudiness: ${current.clouds}%</li>
        <li>Visibility: ${current.visibility}</li>
        <li>Lon: ${current.lon}</li>
        <li>Lat: ${current.lat}</li>
    </ul>`;
    const whole = 
    `<h1 class="main__weather--location">${parseQuery(query)}</h1>
    <div class="weather__content--current">
        ${main}
        ${additional}
    </div>`;
    const types = Array.from(elements.weatherType);
    types.forEach(element => element.classList.remove('main__weather--type-active'));
    types.find(element => element.id === 'current').classList.add('main__weather--type-active');
    elements.weatherContainer.innerHTML = whole;
};
export const displayHourly = (query, hourly, size) => {
    let fixed = ""; 
    let scroll = "";
    for (let i = 0; i < size; i++) {
        let element = hourly[i];
        fixed += `
        <ul class="weather__hourly--fixed-info">
            <li>
                <p>${element.dt.hour}:${element.dt.minutes}${element.dt.meridiem}</p>
                <p>${days[element.dt.day]}</p>
            </li>
            <li>
                <img src="http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="Description">
            </li>
        </ul>
        `;
        scroll += `
        <ul class="weather__hourly--scroll-info">
            <li>${element.weather[0].description}</li>
            <li>${element.temp}^F</li>
            <li>${element.feels_like}^F</li>
            <li>${element.rain ? element.rain + '"' : '---'}</li>
            <li>${element.humidity}%</li>
            <li>${element.wind_speed} mph</li>
        </ul>
        `;
    }
    const whole = `
    <h1 class="main__weather--location">${parseQuery(query)}</h1>
    <div class="weather__content--hourly">
        <div class="weather__hourly--list-fixed">
            <ul class="weather__hourly--fixed-header">
                <li>Time</li>
            </ul>
            ${fixed}
        </div>
        <div class="weather__hourly--list-scroll">
            <ul class="weather__hourly--scroll-header">
                <li>Description</li>
                <li>Temp</li>
                <li>Feels</li>
                <li>Precip.</li>
                <li>Humidity</li>
                <li>Wind</li>
            </ul>
            ${scroll}
        </div>
        <button class="weather__hourly--next">
            <p>Next 8 Hours</p>
            <svg class="bi bi-arrow-down" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.646 9.646a.5.5 0 0 1 .708 0L8 12.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"/>
                <path fill-rule="evenodd" d="M8 2.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0V3a.5.5 0 0 1 .5-.5z"/>
              </svg>
        </button>
    </div>
    `;
    const types = Array.from(elements.weatherType);
    types.forEach(element => element.classList.remove('main__weather--type-active'));
    types.find(element => element.id === 'hourly').classList.add('main__weather--type-active');
    elements.weatherContainer.innerHTML = whole;
};

export const addHourly = (hourly, start, size) => {
    let fixed = ""; 
    let scroll = "";
    for (let i = start; i < start + size; i++) {
        let element = hourly[i];
        fixed += `
        <ul class="weather__hourly--fixed-info">
            <li>
                <p>${element.dt.hour}:${element.dt.minutes}${element.dt.meridiem}</p>
                <p>${days[element.dt.day]}</p>
            </li>
            <li>
                <img src="http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="Description">
            </li>
        </ul>
        `;
        scroll += `
        <ul class="weather__hourly--scroll-info">
            <li>${element.weather[0].description}</li>
            <li>${element.temp}^F</li>
            <li>${element.feels_like}^F</li>
            <li>${element.rain ? element.rain + '"' : '---'}</li>
            <li>${element.humidity}%</li>
            <li>${element.wind_speed} mph</li>
        </ul>
        `;
    }
    document.querySelector('.weather__hourly--list-fixed').insertAdjacentHTML('beforeend', fixed);
    document.querySelector('.weather__hourly--list-scroll').insertAdjacentHTML('beforeend', scroll);
    if (start + size >= hourly.length) {
        const button = document.querySelector(strings.hourlyNext);
        button.parentNode.removeChild(button);
    }
};

export const displayDaily = (query, daily) => {
    let {date, dayOfWeek: day, month, year} = daily[0].dt;
    let {h: riseHour, mi: riseMinutes, me: riseMeridiem} = parseSun(daily[0].sunrise);
    let {h: setHour, mi: setMinutes, me: setMeridiem} = parseSun(daily[0].sunset);
    let first = `
        <ul class="weather__daily--list">
            <li>${day} ${month} ${date}, ${year}</li>
            <li>
                <img src="http://openweathermap.org/img/wn/${daily[0].weather[0].icon}@2x.png" alt="Description">
            </li>
            <li>Temp: ${daily[0].temp.day}^F</li>
            <li>Description: ${daily[0].weather[0].description}</li>
            <li>Feels Like: ${daily[0].feels_like.day}^F</li>
            <li>Hi ${daily[0].temp.max}^F / Lo ${daily[0].temp.min}^F</li>
            <li>Sunrise: ${riseHour}:${riseMinutes}${riseMeridiem}</li>
            <li>Sunset: ${setHour}:${setMinutes}${setMeridiem}</li>
        </ul>
        <div class="weather__daily--break"></div>
    `;
    for (let i = 1; i < daily.length; i++) {
        let {date, dayOfWeek: day, month, year} = daily[i].dt;
        let {h: riseHour, mi: riseMinutes, me: riseMeridiem} = parseSun(daily[i].sunrise);
        let {h: setHour, mi: setMinutes, me: setMeridiem} = parseSun(daily[i].sunset);
        first += `
            <ul class="weather__daily--list">
                <li>${day} ${month} ${date}, ${year}</li>
                <li>
                    <img src="http://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png" alt="Description">
                </li>
                <li>Temp: ${daily[i].temp.day}^F</li>
                <li>Description: ${daily[i].weather[0].description}</li>
                <li>Feels Like: ${daily[i].feels_like.day}^F</li>
                <li>Hi ${daily[i].temp.max}^F / Lo ${daily[i].temp.min}^F</li>
                <li>Sunrise: ${riseHour}:${riseMinutes}${riseMeridiem}</li>
                <li>Sunset: ${setHour}:${setMinutes}${setMeridiem}</li>
            </ul>
        `;
    }
    const final = `
        <h1 class="main__weather--location">${parseQuery(query)}</h1>
        <div class="weather__content--daily">
            ${first}
        </div>
    `;
    const types = Array.from(elements.weatherType);
    types.forEach(element => element.classList.remove('main__weather--type-active'));
    types.find(element => element.id === 'daily').classList.add('main__weather--type-active');
    elements.weatherContainer.innerHTML = final;
};

