const userTab=document.querySelector("[data-userWeather]");  
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen =document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// initial variables 
let currentTab=userTab;
const API_KEY="4af59f598ca4c2ea26d82cae2313e1a4";

currentTab.classList.add("current-tab");

// ek kaam or pending h
getfromSessionStroage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main phele search wala tab pr tha, ab your weather wala tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("remove");


            //ab main your weather tab me aaga hu, tho weather bhi display karna padega, so let's check local storage first
            //for coordinates, if we have saved them there 
            getfromSessionStroage();
            }
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
})

// check if cordinates are aleready present in session storage
function getfromSessionStroage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nhi mille
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
}
}

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;

    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        // handle
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element
    
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const clodiness=document.querySelector("[data-cloudiness]");

    //fetch value from weatherINFO object and put in UI elements
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText= `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    clodiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // HW
        alert("No geolocation Support Avaliable");
    }
}

function showPosition(postion){
    const userCoordinates={
        lat: postion.coords.latitude,
        lon: postion.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton =document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(searchInput ===""){
        return;
    }
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        //hw
        console.log('Error Found in api search for city',err);

    }
}