import { Router, type Request, type Response } from 'express';
const router = Router();

import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const cityName = req.body.cityName
  try {
    if (cityName) {
      const weatherData = await weatherService.getWeatherForCity(cityName)

      await historyService.addCity(cityName)
      return res.json(weatherData)
    } else {
    return res.status(500).json({ message: "Couldn't get weather" })
    }
  } catch{
    return res.status(404).json({ message: 'City not found' })
  }

});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await historyService.getCities()
    return res.json(history)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Error: err });
  };
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    await historyService.removeCity(req.params.id)

    return res.status(200).json('City deleted')
  } catch (err) {
    console.error(err)

    return res.status(500).json({ Error: err })
  }

});

export default router;
