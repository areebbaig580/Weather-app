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
    let humiditystatus = getHumidityStatus(humid);
    let visibilitystatus = getVisibilityStatus(visibility);
    let uvstatus = getUVStatus(uv);


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

    console.log(data);

    weatherCache = data;
    return data;

};


const unitData = (unit) => {
    if (!weatherCache) return;

    let tempC = weatherCache.current.temp_c;
    let tempF = weatherCache.current.temp_f;

    temp.innerHTML = unit === "C" ? tempC : tempF
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
