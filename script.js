const activeTemp = document.querySelectorAll('.toggle-temp');
const activeDay = document.querySelectorAll('.toggle-el');
const input = document.querySelector(".city-name");
const temp = document.querySelector('.temp');
const dateDay = document.querySelector('.date-time');
const cityPanel = document.querySelector('.city');
const cloudDet = document.getElementById('cloud-det');
const humid = document.querySelector('.humidity');
const tabs = document.querySelectorAll('.tab');
const unitName = document.querySelector('.last-char');
const aqi = document.querySelector('.aqi');
const aqiCondtn = document.querySelector('.aqi-det');
const aqiIcn = document.querySelector('.aqi-icn');
const sunRise = document.querySelector(".rise-time");
const sunSet = document.querySelector(".set-time");
const humidityStatus = document.querySelector(".humidity-status");
const visibile = document.querySelector('.visible');
const windSpeed = document.querySelector('.wind-speed');
const visibileStatus = document.querySelector('.visible-status');
const uvIndex = document.querySelector('.uv');
const uvStatus = document.querySelector('.uv-status');
const feelsLike = document.getElementById('feels-like');
let iconToday = document.querySelector('.icon-today');
let iconTommorow = document.querySelector('.icon-tommorow')
let iconDaTommorow = document.querySelector('.icon-daTommorow');
let highTemp = document.querySelectorAll('.high-temp');
let lowtemp = document.querySelectorAll('.low-temp');
const toggle = document.querySelectorAll('.toggle-el');
const toggleContainer = document.querySelector('.days-container');
let hour = document.querySelectorAll('.hour');
let hourIcon = document.querySelectorAll('.hour-icon');
let hourTemp = document.querySelectorAll('.hour-temp');
let dateTommorow = document.querySelector('.tommorow');
let dateDatommorow = document.querySelector('.da-tommorow');

activeDay.forEach(box =>
    box.addEventListener('click', (evt) => {
        document.querySelectorAll('.toggle-el').forEach(t => t.classList.remove('active-day'));
        evt.target.classList.add('active-day');

    })
);
activeTemp.forEach(box =>
    box.addEventListener('click', (evt) => {
        document.querySelectorAll('.toggle-temp').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.togle-temp-el1').forEach(t => t.classList.remove('active-el'));
        document.querySelectorAll('.togle-temp-el2').forEach(t => t.classList.remove('active-el'));
        box.classList.add('active');
        box.firstElementChild.classList.add('active-el');
        box.lastElementChild.classList.add('active-el');
    })
);

input.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
        fetchData(input.value);
        fetchImg(input.value);
        localStorage.setItem("lastCity", JSON.stringify(input.value));
        input.value = "";
    }
});

toggle.forEach(condition =>
    condition.addEventListener('click', (evt) => {
        if (evt.target.innerHTML === "Today") {
            today();
        }
        else if (evt.target.innerHTML === "Week") {
            week();
        }
    })

);

const fetchImg = async (city) => {
    const imgUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=vgt0k7bEhZUHietwFU9QYymdYAnVINAybM9hmAuShb0`
    let response = await fetch(imgUrl);
    let data = await response.json();
    let image = data.results[0].urls.regular;

    cityPanel.style.backgroundImage = `url(${image})`;
};

tabs.forEach(tab => {
    tab.addEventListener("click", (evt) => {
        unitData(tab.innerHTML);
    });
});

function getAQI(pm25) {
    if (pm25 <= 12) return Math.round((50 / 12) * pm25);

    if (pm25 <= 35.4)
        return Math.round(
            ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51
        );

    if (pm25 <= 55.4)
        return Math.round(
            ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101
        );

    return "150+";
};

function getHumidityStatus(humidity) {
    if (humidity < 30) {
        return "Dry";
    } else if (humidity < 60) {
        return "Comfortable";
    } else if (humidity < 80) {
        return "Humid";
    } else {
        return "Very Humid";
    }
};

function getVisibilityStatus(visibility) {
    if (visibility < 1) {
        return "Very Poor";
    } else if (visibility < 5) {
        return "Poor";
    } else if (visibility < 10) {
        return "Moderate";
    } else {
        return "Excellent";
    }
};

function getUVStatus(uv) {
    if (uv <= 2) {
        return "Low";
    } else if (uv <= 5) {
        return "Moderate";
    } else if (uv <= 7) {
        return "High";
    } else if (uv <= 10) {
        return "Very High";
    } else {
        return "Extreme";
    }
}

let weatherCache = null;
const fetchData = async (city) => {
    let cityName = city.toUpperCase();
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=d80ee09513964ff1854112622262804&q=${cityName}&days=7&aqi=yes`
    let response = await fetch(URL);
    let data = await response.json();
    let current = data.current;
    let tempC = current.temp_c;
    let cloud = current.condition.text;
    let humidity = current.humidity;
    let uv = current.uv;
    let windspeed = current.wind_kph;
    let pm25 = current.air_quality.pm2_5;
    let aqiCurr = getAQI(pm25);
    let visibility = current.vis_km;
    let sunrise = data.forecast.forecastday[0].astro.sunrise;
    let sunset = data.forecast.forecastday[0].astro.sunset;
    let humiditystatus = getHumidityStatus(humidity);
    let visibilitystatus = getVisibilityStatus(visibility);
    let uvstatus = getUVStatus(uv);
    let feelCurr = current.feelslike_c;

    if (aqiCurr <= 50) {
        aqiCondtn.innerHTML = "Good";
        aqiIcn.innerHTML = "🟢";

    }
    else if (aqiCurr <= 100) {
        aqiCondtn.innerHTML = "Moderate";
        aqiIcn.innerHTML = "🟡";
    }
    else if (aqiCurr <= 150) {
        aqiCondtn.innerHTML = "Unhealthy for Sensitive Groups";
        aqiIcn.innerHTML = "🟠";
    };

    temp.innerHTML = tempC;
    cityPanel.innerHTML = city;
    cloudDet.innerHTML = cloud;
    humid.innerHTML = humidity;
    humidityStatus.innerHTML = humiditystatus;
    sunRise.innerHTML = sunrise;
    sunSet.innerHTML = sunset;
    windSpeed.innerHTML = windspeed;
    visibile.innerHTML = visibility;
    visibileStatus.innerHTML = visibilitystatus;
    aqi.innerHTML = aqiCurr;
    uvIndex.innerHTML = uv;
    uvStatus.innerHTML = uvstatus;
    feelsLike.innerHTML = `Feels like ${feelCurr} °C`;

    console.log(data);

    weatherCache = data;
    week();
    return data;

};

const today = () => {
    toggleContainer.innerHTML = `
     <div class="hour-box">
                <div class="hour"></div>
                <img class="hour-icon">
                <div class="hour-temp"></div>
                
            </div>
            <div class="hour-box">
                <div class="hour"></div>
                <img class="hour-icon">
                <div class="hour-temp"></div>
                
            </div>
            <div class="hour-box">
                <div class="hour"></div>
                <img class="hour-icon">
                <div class="hour-temp"></div>
                
            </div>
            <div class="hour-box">
                <div class="hour"></div>
                <img class="hour-icon">
                <div class="hour-temp"></div>
                
            </div>
            <div class="hour-box">
                <div class="hour"></div>
                <img class="hour-icon">
                <div class="hour-temp"></div>
                
            </div>
            <div class="hour-box">
                <div class="hour"></div>
                <img class="hour-icon">
                <div class="hour-temp"></div>
                
            </div>
            <div class="hour-box">
                <div class="hour"></div>
                <img class="hour-icon">
                <div class="hour-temp"></div>
                
            </div>
            <div class="hour-box">
                <div class="hour"></div>
                <img class="hour-icon">
                <div class="hour-temp"></div>
                
            </div>`
    hour = document.querySelectorAll('.hour');
    hourIcon = document.querySelectorAll('.hour-icon');
    hourTemp = document.querySelectorAll('.hour-temp');

    hour.forEach((h, i) => {
        h.innerHTML = weatherCache.forecast.forecastday[0].hour[i * 3].time.split(" ")[1];

    })
    hourIcon.forEach((icn, i) => {
        icn.src = weatherCache.forecast.forecastday[0].hour[i * 3].condition.icon;
    })
    hourTemp.forEach((t, i) => {
        t.innerHTML = `${weatherCache.forecast.forecastday[0].hour[i * 3].temp_c} °C`;
    })

};

const week = () => {

    toggleContainer.innerHTML = `<div class="days-box">
                <div class="day-name">Today</div>
                <img class="icon-today weather-icon">
                <div class="high-low-temp">
                    <div class="high-temp"></div>
                    <div class="low-temp"></div>
                </div>

            </div>
            <div class="days-box">
                <div class="day-name tommorow"></div>
                <img class="icon-tommorow">
               <div class="high-low-temp">
                    <div class="high-temp"></div>
                    <div class="low-temp"></div>
                </div>

            </div>
            <div class="days-box">
                <div class="day-name da-tommorow"></div>
                <img class="icon-daTommorow">
                <div class="high-low-temp">
                    <div class="high-temp"></div>
                    <div class="low-temp"></div>
                </div>

            </div>`

    iconToday = document.querySelector('.icon-today');
    iconTommorow = document.querySelector('.icon-tommorow');
    iconDaTommorow = document.querySelector('.icon-daTommorow');
    highTemp = document.querySelectorAll('.high-temp');
    lowtemp = document.querySelectorAll('.low-temp');
    dateTommorow = document.querySelector('.tommorow');
    dateDatommorow = document.querySelector('.da-tommorow');
    let day1 = weatherCache.forecast.forecastday[1].date;
    let day2 = weatherCache.forecast.forecastday[2].date;

    if (weatherCache) {
        dateTommorow.innerHTML = new Date(day1).toLocaleDateString('en-US', { weekday: 'short' });
        dateDatommorow.innerHTML = new Date(day2).toLocaleDateString('en-US', { weekday: 'short' });
        iconToday.src = `https:${weatherCache.current.condition.icon}`;
        iconTommorow.src = `https:${weatherCache.forecast.forecastday[1].day.condition.icon}`;
        iconDaTommorow.src = `https:${weatherCache.forecast.forecastday[2].day.condition.icon}`;
        highTemp.forEach((h, i) => {
            h.innerHTML = `${weatherCache.forecast.forecastday[0].day.maxtemp_c}°C`;
        })
        lowtemp.forEach((l, i) => {
            l.innerHTML = `${weatherCache.forecast.forecastday[0].day.mintemp_c}°C`;
        })

    }

};

const unitData = (unit) => {
    if (!weatherCache) return;

    let tempC = weatherCache.current.temp_c;
    let tempFeelC = weatherCache.current.feelslike_c;

    let tempF = weatherCache.current.temp_f;
    let tempFeelF = weatherCache.current.feelslike_f;

    temp.innerHTML = unit === "C" ? tempC : tempF
    feelsLike.innerHTML = unit === "C" ? `Feels like ${tempFeelC} °C` : `Feels like ${tempFeelF} °F`;
    unitName.innerHTML = unit === "C" ? "°C" : "°F";

};

const defaultdata = () => {
    let lastCity = JSON.parse(localStorage.getItem('lastCity'));

    fetchData(lastCity);
    fetchImg(lastCity);

    let today = new Date();
    let day = today.toLocaleDateString('en-US', { weekday: 'long' });
    let date = today.toLocaleDateString();

    dateDay.innerHTML = `${day}, ${date}`;
};
defaultdata();