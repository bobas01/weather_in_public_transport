
import './App.css'
import  { weatherData } from "./apiOpenMeteo"
import { lyonData } from "./apiOpenMeteo"
import React, { useState, useEffect } from 'react';

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

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <div>{formatTime(currentTime)}</div>
    </div>
  );
}


function App() {
  
 const [dayOrNight, setDayOrNight]= useState(weatherData.current.isDay)
  const temperature =  Math.round(weatherData.current.temperature2m)
  const windSpeed =  Math.round(weatherData.current.windSpeed10m)
  const windDirection =  Math.round(weatherData.current.windDirection10m)
 

  const cityName = lyonData.city;
  const cloudCover =  weatherData.current.cloudCover
  const snowfall =  weatherData.current.snowfall
  const rain =  weatherData.current.rain
  

  return (
    <>
      <div>{temperature}°C {dayOrNight ? "jour" : "nuit"}</div>
      <div>{cityName}</div>
      <div>{cloudCover}</div>
      <div>{snowfall}</div>
      <div>{rain}</div>
      <div>{windSpeed}</div>
      <div>{windDirection}</div>
      <div><Clock /></div>
      
      
    </>
  )
}

export default App
