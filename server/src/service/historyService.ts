import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name
    this.id = id
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      return await fs.readFileSync('db/searchHistory.json', 'utf8')
    } catch (err) {
      console.error('Error:', err)
      return ''
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    const updatedArray = JSON.stringify(cities, null, 2)

    await fs.writeFile('db/searchHistory.json', updatedArray, (err) =>
      err ? console.error("error:", err) : console.log('File updated'))
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read() || ''
    let citiesArray: City[] = []
    try {
      citiesArray = [].concat(JSON.parse(cities))
      return citiesArray
    } catch (err) {
      console.error("Error:", err)
      return citiesArray = []
    }
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const newCity = new City(
      city,
      uuidv4()
    )

    const cities = await this.getCities()
    
    const updatedArray = [...cities, newCity]

    const filtered = Array.from(new Map(updatedArray.map(obj => [obj.name, obj])).values())

    await this.write(filtered)
    return newCity
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities()

    for (let i = 0; i < cities.length; i++) {
      if (cities[i].id === id) {
        cities.splice(i, 1)
        break;
      }
    }
    await this.write(cities)
    return
  }
}

export default new HistoryService();
