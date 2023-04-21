/*PROPOSAL: Approval of proposed project.
INTERACTION: Must have at least one event listener.
AJAX: Must have at least one AJAX call to an API.
DOM: Must manipulate the DOM based on a user’s interaction with your app
POLISH: Your application should look clean and finished
DEPLOY: Deploy to Github Pages or Surge - https://surge.sh/  */


//-------------Calling API with City to get long/lat-------------//
async function fetchLocation() {
	const city = document.getElementById("city").value;

	//-------------Exit function if city name is less than 1 letter-------------//
	if(city.length<1) return;

	//-------------If user selects datalist option extracts long/lat-------------//
	if(city.indexOf("(")>-1){
		extractLongAndLat(city); 
		return;
	}

	//-------------Calling API with City to get long/lat-------------//
	const apiWeather = `https://geocoding-api.open-meteo.com/v1/search`
		+ `?name=${city}`
		+ `&count=10&language=en&format=json`;
	const response = await fetch(apiWeather);
	const jsonData = await response.json();
	const results = jsonData.results;
	//-------------Calling a datalist for all cities in API-------------//
	const datalist = document.querySelector("#cities");
	//-------------Clear existing options-------------//
	datalist.innerHTML = "";

	if(jsonData.results === undefined) return;

	for(var i = 0; i < results.length; i++){
		const newOption = document.createElement("option");
		newOption.value = results[i].name + ", " +  results[i].admin1;
		newOption.value += `(${results[i].latitude},${results[i].longitude})`;
		datalist.appendChild(newOption);
		//console.log(results[i]);
	}

}


function extractLongAndLat(city){
	let location = city.split("(").splice(-1);
	let latitude = location[0].split(",")[0];
	let longitude = location[0].split(",")[1].replace(")", "");
	fetchWeather(latitude,longitude);
}


//-------------calling API with latitude and longitude to get weather data-------------//
async function fetchWeather(latitude, longitude) {
	const apiWeather = `https://api.open-meteo.com/v1/forecast`
		+ `?latitude=${latitude}`
		+ `&longitude=${longitude}`
		+ `&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&temperature_unit=fahrenheit&timezone=America%2FChicago`;
		const response = await fetch(apiWeather);
	const jsonData = await response.json();
	//console.log(jsonData);
	let temp = jsonData.current_weather.temperature;
	document.querySelector(".degree_F").innerHTML=Math.floor(temp) + " &#176F";
	document.querySelector(".degree_C").innerHTML=Math.floor((temp-32) *5/9) + " &#176C";
	/* Get the city value, or the default of Paris, if blank */
	let city = document.getElementById("city").value || 'Paris, France';
	//	if(city === ''){
	//		city = 'Paris, France'
	//}
	if(city.indexOf('(') > -1){
		city = city.substr(0,city.indexOf('('));
	}
	document.querySelector("#location").innerHTML = city;
	
	let weather = getWeatherCode(jsonData.current_weather.weathercode);
	document.querySelector(".desc").innerHTML = weather;
	document.querySelector(".sunrise").innerHTML = formatTime(jsonData.daily.sunrise[0]);
	document.querySelector(".sunset").innerHTML = formatTime(jsonData.daily.sunset[0]);
	document.querySelector(".forecast").innerHTML = "";
	
	for (let i = 0; i < 7; i++){
		getDailyWeather(jsonData.daily,i)	
	}
}
function getWeatherCode(weatherCode){
	let weather = {
		0: "Clear Sky",
		1: "Mainly Clear",
		2: "Partly Cloudy",
		3: "Overcast",
		45: "Fog",
		48: "Depositing rime fog",
		51: "Light Drizzle",
		53: "Moderate Drizzle",
		55: "Dense Drizzle",
		56: "Light Freezing Drizzle",
		57: "Freezing Drizzle Dense Intensity",
		61: "Slight Rain",
		63: "Moderate Rain",
		65: "Heavy Intensity Rain",
		66: "Light Freezing Rain",
		67: "Heavy Intesity Freezing Rain",
		71: "Slight Snow Fall",
		73: "Moderate Snow Fall",
		75: "Heavy Intensity Snow Fall",
		77: "Snow Grains",
		80: "Slight Rain Showers",
		81: "Moderate Rain Showers",
		82: "Violent Rain Showers",
		85: "Slight Snow Showers",
		86: "Heavy Snow Showers",
		95: "Thunderstorm",
		96: "Thunderstorm with Slight Hail",
		99: "Thunderstorm with Heavy Hail",
	};
	return weather[weatherCode] || 'Stay Inside';
}
function getDailyWeather(daily, i){
	let weather = getWeatherCode(daily.weathercode[i]);
	let dailyInfo = `<div class="day">
			<span>${formatDate(daily.time[i])}</span>
			<span>${Math.floor(daily.temperature_2m_max[i])}&#176</span>
			<span>/${Math.floor(daily.temperature_2m_min[i])}&#176</span>
			<span>${weather}</span>
		</div>`
	document.querySelector(".forecast").innerHTML += dailyInfo;	

}
// Extract time from information
function formatTime(dateTime){
	let date = new Date(dateTime);
	let formatter = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: true
	});
	let formattedTime = formatter.format(date);
	return formattedTime;
}
function formatDate(dateTime){
	let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	let date = new Date(dateTime);
	let formatter = new Intl.DateTimeFormat('en-US', {
		day: 'numeric'
	});
	let formattedTime = formatter.format(date);
	return weekdays[date.getDay()] + " " + formattedTime;
}
document.querySelector("#city").addEventListener('change', fetchLocation);
document.querySelector("#city").addEventListener('keypress', fetchLocation);

window.addEventListener('load', () => {
	fetchWeather(48.85341,2.3488);
		
});
document.querySelector("button").addEventListener('click', () => {
	document.querySelector(".forecast").style.display = "block";
});

