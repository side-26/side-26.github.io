const BASEURL = `https://api.openweathermap.org/data/2.5/weather?appid=b03ffc4e4f0d7423fc117aa79b810ce6&units=metric&q=`;
// identify dom to js
const seacrhInput = document.getElementById("seacrh_input");
const cityName = document.getElementById("city_info-city");
const currentDay = document.getElementById("city_info-day");
const cityHummidity = document.getElementById("city_info-humidity");
const cityWindInfo = document.getElementById("city_info-wind_info");
const cityPressureInfo = document.getElementById("city_info-pressure");
const cityStatusImage = document.getElementById("city_status_img");
const cityDegreeInfo = document.getElementById("city_degree_info");
const weekContainer = document.getElementById("week_container");
// fetching info
seacrhInput.addEventListener("keypress", (evt) => {
  if (evt.keyCode == "13" && evt.target.value.trim() !== "") {
    showConditionWeather(BASEURL, evt.target.value.toLowerCase());
    show5Days(weekURL, evt.target.value.toLowerCase());
    evt.target.value="";
  }
});

const showConditionWeather = (weatherAPI, cityName) => {
  fetch(`${weatherAPI}${cityName}`)
    .then(async (res) => {
      if(res.status>200){
        alert("404 error check your connection and site's url!!!");
        return;
      }
      return await res.json();
      
    })
    .then((result) => {
      console.log(result.weather[0].icon, cityName);
      assigningTODom(result);
    });
};
const assigningTODom = (jsonItem) => {
  const DAY = new Date(jsonItem.dt * 1000);
  cityName.innerHTML = `${jsonItem.name},${jsonItem.sys.country}`;
  currentDay.innerHTML = DAY.toLocaleDateString("en-US", { weekday: "long" });
  cityHummidity.innerHTML = `<i class="fas fa-tint"></i>${jsonItem.main.humidity}%`;
  cityWindInfo.innerHTML = `<i class="fas fa-flag-checkered"></i>west, ${jsonItem.wind.speed} m/s`;
  cityDegreeInfo.innerHTML = `+${jsonItem.main.temp}&#x2103;`;
  cityPressureInfo.innerHTML = `<i class="fas fa-bullseye"></i>${jsonItem.main.pressure}hPa`;
  cityStatusImage.src = `http://openweathermap.org/img/wn/${jsonItem.weather[0].icon}@4x.png`;
};
