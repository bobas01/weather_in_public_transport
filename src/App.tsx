import "./App.scss";
import { weatherData } from "./apiOpenMeteo";
import { cityData } from "./apiOpenMeteo";
import React, { useState, useEffect } from "react";

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <div>{formatTime(currentTime)}</div>
    </div>
  );
}

function App() {
  function getFrenchDayOfWeek(date: Date) {
    const options = { weekday: "long", timeZone: "UTC" };
    return date.toLocaleDateString("fr-FR", options);
  }
  const temperature = Math.round(weatherData.current.temperature2m);
  const windSpeed = Math.round(weatherData.current.windSpeed10m);
  const windDirection = Math.round(weatherData.current.windDirection10m);
  function getWindDirectionAbbreviation(degrees: number) {
    if (degrees >= 337.5 || degrees < 22.5) {
      return "N";
    } else if (degrees >= 22.5 && degrees < 67.5) {
      return "NE";
    } else if (degrees >= 67.5 && degrees < 112.5) {
      return "E";
    } else if (degrees >= 112.5 && degrees < 157.5) {
      return "SE";
    } else if (degrees >= 157.5 && degrees < 202.5) {
      return "S";
    } else if (degrees >= 202.5 && degrees < 247.5) {
      return "SO";
    } else if (degrees >= 247.5 && degrees < 292.5) {
      return "O";
    } else if (degrees >= 292.5 && degrees < 337.5) {
      return "NO";
    } else {
      return "";
    }
  }

  const cityName = cityData.city;
  const dayOrNight = weatherData.current.isDay;
  const cloudCover = weatherData.current.cloudCover;
  const snowfall = weatherData.current.snowfall;
  const rain = weatherData.current.rain;
  const precipitation = weatherData.current.precipitation;
  const relativeHumidity2m = weatherData.current.relativeHumidity2m;
  const apparentTemperature = Math.round(
    weatherData.current.apparentTemperature
  );

  return (
    <>
      <div id="container">
        <div id="firstPartContainer">
          <h1>{cityName}</h1>
          {dayOrNight > 0 &&
            cloudCover === 0 &&
            !snowfall &&
            !rain &&
            !precipitation && <img src="../public/iconWeather/sun.png" />}
          {dayOrNight > 0 &&
            cloudCover > 0 &&
            !snowfall &&
            !rain &&
            !precipitation && (
              <img src="../public/iconWeather/partly_cloudy_day.png" />
            )}
          {dayOrNight > 0 &&
            cloudCover > 0 &&
            snowfall > 0 &&
            !rain &&
            !precipitation && <img src="../public/iconWeather/snow.png" />}
          {dayOrNight > 0 &&
            cloudCover > 0 &&
            !snowfall &&
            (rain > 0 || precipitation > 0) && (
              <img src="../public/iconWeather/rain.png" />
            )}
          {!dayOrNight &&
            cloudCover === 0 &&
            !snowfall &&
            !rain &&
            !precipitation && <img src="../public/iconWeather/moon.png" />}
          {!dayOrNight &&
            cloudCover > 0 &&
            !snowfall &&
            !rain &&
            !precipitation && (
              <img src="../public/iconWeather/night_partly_cloudy.png" />
            )}
          {!dayOrNight &&
            cloudCover > 0 &&
            snowfall > 0 &&
            !rain &&
            !precipitation && (
              <img src="../public/iconWeather/snow.png" alt="snow" />
            )}
          {!dayOrNight &&
            cloudCover > 0 &&
            !snowfall &&
            (rain > 0 || precipitation > 0) && (
              <img src="../public/iconWeather/rain.png" />
            )}

          <h2>{temperature} °C</h2>

          <p>Ressentit {apparentTemperature} °C</p>
        </div>
        <div id="secondPartContainer">
          <div id="hour">
            <h4>{getFrenchDayOfWeek(new Date())} </h4>
            <Clock />
          </div>
          <div id="infoSecondPartContainer">
            <div className="litleContainer ">
              <img src="../public/iconWeather/humidity.png" alt="humidity" />
              <h2>{relativeHumidity2m} %</h2>
            </div>
            <div className="litleContainer ">
              <img src="../public/iconWeather/wind.png" alt="wind" />
              <h2>{windSpeed} km/h</h2>
            </div>
            <div className="litleContainer">
              <img src="../public/iconWeather/wind_rose.png" alt="wind_rose" />
              <h2>{getWindDirectionAbbreviation(windDirection)}</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
