import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Trainline } from "../entity/Trainline"
import { Station } from '../entity/Station'

export class StationController {

    private stationRepository = AppDataSource.getRepository(Station)
    private trainlineRepository = AppDataSource.getRepository(Trainline)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.stationRepository.find()
    }

    async byline(request: Request, response: Response, next: NextFunction) {
        const trainline_name = request.body;
    }


    //curl -X POST -d 'name="1"' http://localhost:3000/trainlines
    //curl -X POST -H "Content-Type: application/json" -d '{"name": "1", "stations": ["Canal", "Houston", "Christopher", "14th"]}' http://localhost:3000/stations
    //curl -X POST -H "Content-Type: application/json" -d '{"name": "E", "stations": ["Spring", "West 4th", "14th", "23rd"]}' http://localhost:3000/stations
    async save(request: Request, response: Response, next: NextFunction) {
        const { name, stations } = request.body;

        var trainline_id;

        // Check if trainline already exists
        let trainline = await this.trainlineRepository.findOneBy({ name: name });
        console.log(trainline);
        if (!trainline) {
            // Create new trainline entity with provided name
            const new_trainline = Object.assign(new Trainline(), {
                name
            })
            try {
                const updated_trainline = await this.trainlineRepository.save(new_trainline);
                console.log(updated_trainline);
                trainline_id = updated_trainline.id;
                response.status(200).json({ message: "Trainline saved successfully" });
            } catch (error) {
                next(error);
            }
        } else {
            trainline_id = trainline.id;
        }
        const stationArray = [];
        for (const stationName of stations) {
            stationArray.push({
                name: stationName,
                trainlineId: trainline_id,
                trainlineName: name
            });

        }
        console.log(stationArray);
        try {
            await this.stationRepository.save(stationArray);
            response.status(200).json({ message: `Stations saved` });
        } catch (error) {
            next(error);
        }

    }
}
