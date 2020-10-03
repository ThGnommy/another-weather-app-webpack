import axios from "axios";

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
      axios
        .post(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        )
        .then((res) => {
          showContainer();
          updateData(
            capitalize(
              `${checkIfUndefined(
                res.data.name,
                "Not found"
              )}, ${checkIfUndefined(res.data.sys.country, "Not found")}`
            ),
            capitalize(
              checkIfUndefined(res.data.weather[0].description, "Not found")
            ),
            checkIfUndefined(res.data.main.temp, "Not found"),
            checkIfUndefined(res.data.main.humidity, "Not found"),
            checkIfUndefined(res.data.wind.speed, "Not found"),
            checkIfUndefined(
              `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
              "Not found"
            )
          );
        })
        .catch((error) => {
          hiddenContainer();
        });
    }, alertAnimation);
  }
};

const fetchData = () => {
  axios
    .post(
      `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=${API_KEY}`
    )
    .then((res) => {
      hideDangerText();
      showContainer();

      updateData(
        capitalize(
          `${checkIfUndefined(res.data.name, "Not found")}, ${checkIfUndefined(
            res.data.sys.country,
            "Not found"
          )}`
        ),
        capitalize(
          checkIfUndefined(res.data.weather[0].description, "Not found")
        ),
        checkIfUndefined(res.data.main.temp, "Not found"),
        checkIfUndefined(res.data.main.humidity, "Not found"),
        checkIfUndefined(res.data.wind.speed, "Not found"),
        checkIfUndefined(
          `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
          "Not found"
        )
      );
    })
    .catch((error) => {
      showDangerText();
      hiddenContainer();
    });
};

button.addEventListener("click", fetchData);

geolocalization();
