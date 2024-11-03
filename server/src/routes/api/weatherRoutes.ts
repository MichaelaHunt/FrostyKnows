import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {//    /weather/
  // GET weather data from city name
  const { cityName } = req.body;
  //console.log("Name: " + cityName);
    try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    //console.log("Weather Data: " + JSON.stringify(weatherData));

    await HistoryService.addCity(cityName); 
    res.json(weatherData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather data or add city to history.' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {//    /weather/history
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {//    /weather/history/:id

// });

export default router;
