const activeTemp = document.querySelectorAll('.toggle-temp');
const activeDay = document.querySelectorAll('.toggle-el');
const input = document.querySelector(".city-name");
const temp = document.querySelector('.temp');
const dateDay = document.querySelector('.date-time');
const cityPanel = document.querySelector('.city');
const cloudDet = document.getElementById('cloud-det');
const humid = document.getElementById('humidity');
const tabs = document.querySelectorAll('.tab');
const unitName = document.querySelector('.last-char');

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

const fetchImg = async (city)=>{
    const imgUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=vgt0k7bEhZUHietwFU9QYymdYAnVINAybM9hmAuShb0`
    let response = await fetch(imgUrl);
    let data = await response.json();
    let image = data.results[0].urls.regular;

    cityPanel.style.backgroundImage = `url(${image})`;
};

tabs.forEach(tab=>{
    tab.addEventListener("click" , (evt)=>{
        unitData(tab.innerHTML);
    });
});

let weatherCache = null;
const fetchData = async (city) => {
    let cityName = city.toUpperCase();
    const URL = `https://api.weatherapi.com/v1/forecast.json?key=d80ee09513964ff1854112622262804&q=${cityName}&days=7`
    let response = await fetch(URL);
    let data = await response.json();
    let current = data.current;
    let tempC = current.temp_c;
    let cloud = current.condition.text;
    let humidity = current.humidity;
    
    temp.innerHTML = tempC;
    cityPanel.innerHTML = city;
    cloudDet.innerHTML = cloud;
    humid.innerHTML = `Humidity - ${humidity}`;

    weatherCache = data; 
    return data;

};

const unitData = (unit) =>{
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
