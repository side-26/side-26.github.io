const weekURL =
  "https://api.openweathermap.org/data/2.5/forecast?appid=b03ffc4e4f0d7423fc117aa79b810ce6&units=metric&q=";
// fetching function
const show5Days = (weatherApi, cityName) => {
  fetch(`${weatherApi}${cityName}`)
    .then(async (res) => {
      return await res.json();
    })
    .then((result) => {
      const filterdArr = result.list.filter((days, index) => {
        return (index + 1) % 8 == 0;
      });
      let htmlcod='';
      // weekContainer.innerHTML=''
      filterdArr.forEach((days,index) => {
        const DAY = new Date(days.dt*1000);
        htmlcod += `<div class="day day-${index+1}">
        <figure class="day_img_container">
          <img class="img" src="http://openweathermap.org/img/wn/${
            days.weather[0].icon
          }@4x.png" alt="خورشيد پشتش به ماست مي دونستي؟؟" />
        </figure>
        <span class="day_name">${DAY.toLocaleDateString("en-US", {
          weekday: "long",
        })}</span>
        <span class="day_degree">+${days.main.temp}&#x2103;</span>
      </div>`;
      });
      weekContainer.innerHTML = htmlcod;
    });
};
// show5Days(weekURL,"tehran");
