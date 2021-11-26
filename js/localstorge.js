const makingLocalstorge=(val)=>{
    let cityItem = localStorage.getItem("cities");
    if (cityItem === null) {
      cityArray = [];
    } else {
        cityArray = JSON.parse(cityItem);
    }
    let list = {};
    list.cityname=val;
    cityArray.unshift(list);
    localStorage.setItem("cities", JSON.stringify(cityArray));
}
// function showItem(cityName){
// }
document.addEventListener("DOMContentLoaded",function(){
    let cityItem = localStorage.getItem("cities");
    const cityarr=JSON.parse(cityItem)
    if(cityarr.length!==0){
        showConditionWeather(BASEURL, cityarr[0].cityname);
    show5Days(weekURL, cityarr[0].cityname );
        citySeggestionList.classList.add("hidden");
    }   
})