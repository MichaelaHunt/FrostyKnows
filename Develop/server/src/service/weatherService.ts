import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
//lat and log
  lat: number;
  log: number;
}
// Define a class for the Weather object
class Weather {
//hold prop we need to return to UI
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// Complete the WeatherService class
class WeatherService implements Coordinates {
  // Define the baseURL, API key, and city name properties
  baseURL: string;
  APIKey: string;
  lat: number;
  log: number;
  city: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.APIKey = process.env.API_KEY || '';
    this.lat = 0;
    this.log = 0;
    this.city = '';
  }
  // Create fetchLocationData method
  private async fetchLocationData(city: string) {
      const response = await fetch(this.buildGeocodeQuery());
      return await response.json();
  }
  // Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, log } = locationData;
    this.lat = lat;
    this.log = log;
    return {
      lat: lat,
      log: log
    };
  }
  // Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.city}&appid=${this.APIKey}`;
  }
  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.log}&appid=${this.APIKey}`;//so the interface is moot lol
  }
  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const response = await this.fetchLocationData(this.city);
    return this.destructureLocationData(response[0]);
  }
  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      //.json it?
      return response.json();
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }
  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    let date = new Date(response.list[0].dt * 1000);
    let tempF = (response.list[0].main.temp * 9 / 5) - 459.67;
    return new Weather(
      response.city.name,
      date.toLocaleDateString(),
      response.list[0].weather[0].icon,
      response.list[0].weather[0].description,
      tempF,
      response.list[0].wind.speed,
      response.list[0].main.humidity
    );
  }
  // Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let returnArray = [];
    returnArray.push(currentWeather);
    for (let dayData of weatherData) {
      let date = new Date(dayData.dt * 1000);
      let tempF = (dayData.main.temp * 9 / 5) - 459.67;
      let element = new Weather(
        dayData.city.name,
        date.toLocaleDateString(),
        dayData.weather[0].icon,
        dayData.weather[0].description,
        tempF,
        dayData.wind.speed,
        dayData.main.humidity
      );
      returnArray.push(element);
    }

    return returnArray;
  }
  // Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    try {
      //grab coordinates using the city name
      const coordinates = await this.fetchAndDestructureLocationData();
      //grab the weather from the api using location data
      const weatherResponse = await this.fetchWeatherData(coordinates);
      //get the weather obj for today
      const currentWeather = this.parseCurrentWeather(weatherResponse);
      //get an array of weather obj for 5 days
      const forecastArray = this.buildForecastArray(currentWeather, weatherResponse.list.slice(1));
  
      return { currentWeather, forecastArray };
    } catch (err) {
      console.error('Error getting weather for city:', err);
      throw err;
    }
  }
}

export default new WeatherService();
