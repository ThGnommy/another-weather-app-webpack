import {
  showContainer,
  showDangerText,
  hideDangerText,
  hiddenContainer,
  capitalize,
  checkIfUndefined,
  alertAnimation,
} from "./utility";
import "./style.css";

const API_KEY = process.env.API_KEY;

const input = document.querySelector("input");
const button = document.querySelector("button");
const currentCity = document.getElementById("city");
const description = document.getElementById("weather-description");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const iconCondition = document.getElementById("icon-condition");

const updateData = (city, desc, tmp, h, ws, img) => {
  currentCity.innerHTML = city;
  description.innerHTML = desc;
  temp.innerHTML = tmp.toFixed(0) + "°";
  humidity.innerHTML = h.toFixed(0);
  windSpeed.innerHTML = ws.toFixed(0);
  iconCondition.src = img;
};

const geolocalization = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )
        .then((res) => {
          if (res.ok) {
            showContainer();
          } else {
            return;
          }
          return res.json();
        })
        .then((data) => {
          updateData(
            capitalize(
              `${checkIfUndefined(data.name, "Not found")}, ${checkIfUndefined(
                data.sys.country,
                "Not found"
              )}`
            ),
            capitalize(
              checkIfUndefined(data.weather[0].description, "Not found")
            ),
            checkIfUndefined(data.main.temp, "Not found"),
            checkIfUndefined(data.main.humidity, "Not found"),
            checkIfUndefined(data.wind.speed, "Not found"),
            checkIfUndefined(
              `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
              "Not found"
            )
          );
        });
    }, alertAnimation);
  } else {
    return;
  }
};

const fetchData = () => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=${API_KEY}`,
    {
      method: "GET",
    }
  )
    .then((res) => {
      if (input.value === "") {
        hiddenContainer();
      } else if (!res.ok) {
        showDangerText();
        hiddenContainer();
      } else if (res.ok) {
        hideDangerText();
        showContainer();
      }
      return res.json();
    })
    .then((data) => {
      updateData(
        capitalize(
          `${checkIfUndefined(data.name, "Not found")}, ${checkIfUndefined(
            data.sys.country,
            "Not found"
          )}`
        ),
        capitalize(checkIfUndefined(data.weather[0].description, "Not found")),
        checkIfUndefined(data.main.temp, "Not found"),
        checkIfUndefined(data.main.humidity, "Not found"),
        checkIfUndefined(data.wind.speed, "Not found"),
        checkIfUndefined(
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          "Not found"
        )
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

button.addEventListener("click", fetchData);

geolocalization();
