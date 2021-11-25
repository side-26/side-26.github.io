const cityUrl = "https://api.teleport.org/api/cities/?search=";
// identify dom
const citySeggestionList = document.getElementById("citySeggestionList");
const findCities = async (cityUrl, cityName) => {
  let fetchData = await fetch(`${cityUrl}${cityName}`);
  if (fetchData.status > 300) {
    window.location.href = "./404.html";
    return;
  }
  
  const dataJson = await fetchData.json();
  citySeggestionList.classList.remove("hidden");
  let htmlLi='' ;
 if(dataJson.count==0){
  htmlLi=`<li onclick="restarting()" class="citySEggestionList_item">
          There is no results for ${seacrhInput.value}
</li>`
 }else{
  dataJson._embedded["city:search-results"].forEach((city) => {
   htmlLi += `<li class="citySEggestionList_item">
        <a
          class="citySEggestionList_item_link"
          onclick="showDetails(this)"
          href="#"
          >${city.matching_full_name.split(",")}</a
        >
      </li>`;
  });
 }
 
  citySeggestionList.innerHTML=htmlLi;
  console.log(dataJson._embedded["city:search-results"]);
};

seacrhInput.addEventListener("input",debounce((evt)=>{
  if(evt.target.value.trim()){
    findCities(cityUrl,evt.target.value);
}
else{
    citySeggestionList.classList.add("hidden");
}

},500))
function showDetails(evt){
    showConditionWeather(BASEURL, evt.childNodes[0].nodeValue.split(",")[0].toLowerCase());
    show5Days(weekURL, evt.childNodes[0].nodeValue.split(",")[0].toLowerCase());
        citySeggestionList.classList.add("hidden");
        restarting();
}
function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
function restarting(){
  seacrhInput.value="";
}