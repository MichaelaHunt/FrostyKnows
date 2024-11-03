import { readFileSync } from 'node:fs';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const searchHistoryPath = path.join(__dirname, '../../db/searchHistory.json');
// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// Complete the HistoryService class
class HistoryService {
  // Define a read method that reads from the searchHistory.json file
  private async read() {
    return (await readFileSync(searchHistoryPath, 'utf8'));
  }
  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    //thought about putting in dist folder since it's generated, but decided on db since it's storage...
    await fs.writeFileSync(searchHistoryPath, JSON.stringify(cities));
  }
  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    let data = JSON.parse(await this.read());
    return Array.isArray(data) ? data : [];
  }
  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const newCity: City = {
      name: city,
      id: uuidv4(),
    };
    //get the current cities in array format, add the newCity, then send that to the write function. \
    const oldCities: City[] = await this.getCities();

    let allCities = [...oldCities, newCity];
    await this.write(allCities); 
  }
  // * BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    //get the array of cities
    const citiesArray: City[] = await this.getCities();
    //grab the exact city we want from the array
    let cityToBeDeleted: City = {name: 'potato', id: '0'};
    citiesArray.forEach((item) => {
      if (item.id == id) {
        cityToBeDeleted = item;
      }
    });
    //then remove from the array and SAVE!!
    try {
      const i = citiesArray.indexOf(cityToBeDeleted);
      const newArray = citiesArray.splice(i, 1);
      this.write(newArray);
    } catch {
      console.log("The city you are trying to delete does not exist.");
    }
    
  }
}

export default new HistoryService();
