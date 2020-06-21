import "../css/main.css";
import {elements, strings} from './base';
import Search from './models/Search';
import * as SearchUI from './views/SearchUI';


const state = {};

/* SEARCH CONTROLLER
- this method and event listener handles the execution when a new search is made
based on input from user
*/

const querySearch = async () => {
    // Take input from UI
    const query = SearchUI.getInput();

    // if input is not empty, make weather search
    if (query) {
        /*
        1. clear input from UI
        2. make API calls, display loader as request is made
        3. once response is received, display current weather to UI
        */
        SearchUI.clearInput();
        SearchUI.displayLoader();
        state.search = new Search(query);
        await state.search.getWeather();
        SearchUI.removeLoader();
        state.type = 'current';
        SearchUI.displayCurrent(state.search.query, state.search.getCurrent());
    }
}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    querySearch();
});

/* WEATHER CONTROLLER
- controls when a type of forecast (current, hourly, daily) is chosen by user
*/

elements.weatherTypes.addEventListener('click', event => {
    const type = event.target;
    if (type.matches(strings.weatherType) && type.id !== state.type && state.search) {
        switch (type.id) {
            case 'current':
                SearchUI.displayCurrent(state.search.query, state.search.getCurrent());
                state.type = 'current';
                break;
            case 'hourly':
                state.numOfHours = 10;
                SearchUI.displayHourly(state.search.query, state.search.getHourly(), state.numOfHours);
                state.type = 'hourly';
                state.lastHour = state.numOfHours;
                break;
            case 'daily':
                SearchUI.displayDaily(state.search.query, state.search.getDaily());
                state.type = 'daily';
                break;
        }
    }
    console.log(state.type);
});

// hourly next button

elements.weatherContainer.addEventListener('click', event => {
    if (event.target.closest(strings.hourlyNext)) {
        let hourly = state.search.getHourly();
        let difference = hourly.length - state.lastHour;
        if (difference >= state.numOfHours) SearchUI.addHourly(hourly, state.lastHour, state.numOfHours);
        else SearchUI.addHourly(hourly, state.lastHour,  difference);
        state.lastHour += state.numOfHours;
    }
});