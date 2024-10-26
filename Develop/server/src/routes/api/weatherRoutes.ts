import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {//    /weather/
  // TODO: GET weather data from city name
  const { name } = req.body;//where does req.body get filled?
  //fetch stuffs...
//getweather for city
  // save city to search history
  HistoryService.addCity(name);//does this need to be awaited? 
});

// GET search history
router.get('/history', async (req: Request, res: Response) => {//    /weather/history
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {//    /weather/history/:id

});

export default router;
