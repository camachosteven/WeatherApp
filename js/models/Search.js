const axios = require('axios');
const api_key = '499b5d5ba118fc430601cbda15c93c16';
const monthsArr = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
];
const daysArr = [
    'Sunday', 'Monday', 'Tuesday', 
    'Wednesday', 'Thursday', 'Friday', 
    'Saturday'
];

const parseDate = date => {
    const newDate = new Date(date * 1000);
    return {
        month: monthsArr[newDate.getMonth()],
        date: newDate.getDate(),
        dayOfWeek: daysArr[newDate.getDay()],
        year: newDate.getFullYear()
    };
};

const parseSun = date => {
    const newDate = new Date(date * 1000);
    const day = newDate.getDay();
    const hours = newDate.getHours();
    let minutes = newDate.getMinutes();
    minutes = (minutes < 10) ? '0' + minutes: minutes;
    return {
        hour: hours % 12 === 0 ? 12 : hours % 12,
        minutes,
        meridiem: hours - 12 >= 0 ? 'pm': 'am',
        day
    };
};

const parseCurrent = (current, daily, lat, lon) => {
    current.min = daily.temp.min;
    current.max = daily.temp.max;
    current.lat = lat;
    current.lon = lon;
    current.dt = parseDate(current.dt);
    current.sunset = parseSun(current.sunset);
    current.sunrise = parseSun(current.sunrise);
    return current;
};

const parseHourly = hourly => {
    hourly.forEach(element => {
        element.dt = parseSun(element.dt);
        if (element.rain) element.rain = element.rain['1h'];
    });
    return hourly;
};

const parseDaily = daily => {
    daily.forEach(element => {
        element.dt = parseDate(element.dt);
        element.sunrise = parseSun(element.sunrise);
        element.sunset = parseSun(element.sunset);
    });
    return daily;
};

export default class Search {
    constructor(query) {
        this.query = query;
    } 

    async getWeather() {
        try {
            let result = await axios(`http://api.openweathermap.org/data/2.5/weather?q=${this.query}&appid=${api_key}`);
            const longitude = result.data.coord.lon;
            const latitude = result.data.coord.lat;
            result = await axios(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${api_key}&units=imperial`);
            this.result = result.data;
            this.result.current = parseCurrent(this.result.current, this.result.daily[0], latitude, longitude);
            this.result.hourly = parseHourly(this.result.hourly);
            this.result.daily = parseDaily(this.result.daily);
            console.log(this.result.daily);
        } catch(error) {
            console.log(error);
        }
    }

    getCurrent() {
        return this.result.current;
    }

    getHourly() {
        return this.result.hourly;
    }

    getDaily() {
        return this.result.daily;
    }
};
