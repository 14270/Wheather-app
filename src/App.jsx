import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./services/weatherService";
import { useEffect, useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const App = () => {
  const [query, setQuery] = useState({ q: "tokyo" });
  const [units, setunits] = useState("metric");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location";
    toast.info(`fetching weather data for ${capitalizeFirstLetter(cityName)}`);

    await getFormattedWeatherData({ ...query, units }).then((data) => {
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`);
      setWeather(data);
    });
    console.log(data);
  };

  useEffect(() => {
    getWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-600 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    return weather.temp <= threshold
      ? "from-cyan-600 to-blue-700"
      : "from-yellow-600 to-orange-700";
  };

  return (
    <div
      className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} setunits={setunits} />

      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TempAndDetails weather={weather} units={units} />
          <Forecast title="3 hour step forecast" data={weather.hourly} />
          <Forecast title="daily forecast" data={weather.daily} />
        </>
      )}

      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" />
    </div>
  );
};

export default App;
