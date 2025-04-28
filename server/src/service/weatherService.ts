import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number
  lon: number
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconAlt: string;
  tempF: number;
  humidity: string;
  windSpeed: number;

  constructor(city: string, date: string, icon: string, iconAlt: string, tempF: number, humidity: string, windSpeed: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconAlt = iconAlt;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string
  private APIKEY?: string

  constructor() {
    this.baseURL = process.env.API_BASE_URL || ''
    this.APIKEY = process.env.API_KEY || ''
  }

  private cityName!: string

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response: Coordinates[] = await fetch(query).then((res) => res.json())

    return response

  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    }
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName},USA&limit=1&appid=${this.APIKEY}`
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIKEY}`
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery())
    console.log(locationData)

    if (Array.isArray(locationData) && locationData.length > 0) {
      return this.destructureLocationData(locationData)
    }
    console.error("No data avialable")

    return null
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates))

    return await response.json()
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const city = this.cityName
    const date = new Date(response.list[0].dt * 1000).toLocaleDateString()
    const icon = response.list[0].weather[0].icon
    const iconAlt = response.list[0].weather[0].description
    const tempF = ((response.list[0].main.temp - 273.15) * 9) / 5 + 32
    const humidity = response.list[0].main.humidity
    const windSpeed = response.list[0].wind.speed

    return new Weather(city, date, icon, iconAlt, tempF, humidity, windSpeed)
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    const forecast: Weather[] = []

    for (let i = 0; i < weatherData.length; i += 8) {
      const city = this.cityName
      const date = new Date(weatherData[i].dt * 1000).toLocaleDateString()
      const icon = weatherData[i].weather[0].icon
      const iconAlt = weatherData[i].weather[0].description
      const tempF = ((weatherData[i].main.temp - 273.15) * 9) / 5 + 32
      const humidity = weatherData[i].main.humidity
      const windSpeed = weatherData[i].wind.speed

      forecast.push(new Weather(city, date, icon, iconAlt, tempF, humidity, windSpeed))
    }

    return forecast
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city

    const coordinates = await this.fetchAndDestructureLocationData()

    console.log(coordinates)

    if (!coordinates) {
      throw new Error('No coordinate data')
    }

    const weatherData = await this.fetchWeatherData(coordinates)
    const currentWeather = await this.parseCurrentWeather(weatherData)
    const forcast = await this.buildForecastArray(weatherData.list)

    console.log(currentWeather, forcast)

    return { currentWeather, forcast }
  }

}

export default new WeatherService();
