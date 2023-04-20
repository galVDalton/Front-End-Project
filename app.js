/*PROPOSAL: Approval of proposed project.
INTERACTION: Must have at least one event listener.
AJAX: Must have at least one AJAX call to an API.
DOM: Must manipulate the DOM based on a user’s interaction with your app
POLISH: Your application should look clean and finished
DEPLOY: Deploy to Github Pages or Surge - https://surge.sh/  */

async function logJSONData() {
    const apiWeather = `https://api.open-meteo.com/v1/forecast`
    + `?latitude=${document.getElementById('latitude').value}`
    + `&longitude=${document.getElementById('longitude').value}`
    + `&current_weather=true&temperature_unit=fahrenheit`;
    const response = await fetch(apiWeather);
    const jsonData = await response.json();
    console.log(jsonData);
    let temp = jsonData.current_weather.temperature;
    document.querySelector(".f").innerHTML=temp;
    document.querySelector(".c").innerHTML=Math.floor((temp-32) *5/9);
  }
  
  async function logJSONData2() {
    const city = document.getElementById("city").value;
    if(city.length<1) return;
    if(city.indexOf("(")>-1){
        get(city); 
        return;
    }
    const apiWeather = `https://geocoding-api.open-meteo.com/v1/search`
    + `?name=${document.getElementById('city').value}`;
    + `&count=10&language=en&format=json`;
    const response = await fetch(apiWeather);
    const jsonData = await response.json();
    const results = jsonData.results;
    const datalist = document.querySelector("#cities");
    datalist.innerHTML = "";
    if(jsonData.results === undefined) return;
    for(var i = 0; i < results.length; i++){
        const newOption = document.createElement("option");
        newOption.value = results[i].name + ", " +  results[i].admin1;
        newOption.value += `(${results[i].latitude},${results[i].longitude})`;
        datalist.appendChild(newOption);
        newOption.addEventListener('click', get);
        //console.log(results[i]);
    }
  
  }
  function get(city){
   let location = city.split("(").splice(-1);
    document.getElementById('latitude').value=location[0].split(",")[0];
    let t = location[0].split(",")[1];
    document.getElementById('longitude').value=t.replace(")", "");
  }
  document.querySelector(".submit.weather")
    .addEventListener('click', logJSONData);
  document.querySelector("#city").addEventListener('change', logJSONData2);
  document.querySelector("#city").addEventListener('keypress', logJSONData2);
  document.querySelector(".submit.location")
  .addEventListener('click', logJSONData2);
  window.addEventListener('load', () => {});

window.addEventListener('load', () => {
    let long;
    let lat;
    // Accessing Geolocation of User
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
         
      });
    }
  });
  /*document.getElementById('latitude').value="52.2";
  document.getElementById('longitude').value="13.41";
  logJSONData();*/

  /* --------------------------------------------//
  window.addEventListener('load', () => {
    let long;
    let lat;
    // Accessing Geolocation of User
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
         
      });
    }
  }); */