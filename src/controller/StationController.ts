import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Trainline } from "../entity/Trainline"
import { Station } from '../entity/Station'
import { CardController } from './CardController'
import { TransactionController } from './TransactionController'
import { TransactionNotStartedError } from 'typeorm'

export class StationController {

    private stationRepository = AppDataSource.getRepository(Station)
    private trainlineRepository = AppDataSource.getRepository(Trainline)
    private cardController = new CardController()
    private transactionController = new TransactionController();

    async all(request: Request, response: Response, next: NextFunction) {
        return this.stationRepository.find()
    }

    async byline(request: Request, response: Response, next: NextFunction) {
        const trainline_name = request.body;
    }

    async findStation(station: string) {
        return await this.stationRepository.findOneBy({ name: station })
    }

    //curl -X POST -H "Content-Type: application/json" -d '{"card_number": "1234"}' http://localhost:3000/station/Houston/enter
    async enter(request: Request, response: Response, next: NextFunction) {
        const { station } = request.params;
        const { card_number } = request.body;
        console.log(station, card_number)

        try {
            const stop = await this.findStation(station);
            console.log(stop)
            const fare = -stop["fare"];
            const updated = await this.cardController.updateCardBalance(card_number, fare)
            const message = { "amount": updated.amount }
            console.log(updated, fare);
            await this.transactionController.newTransaction(card_number, station, fare, updated.amount, true);

            response.status(200).json(message);

        } catch (error) {
            next(error)
        };
    }
    //curl -X POST -H "Content-Type: application/json" -d '{"card_number": "1234"}' http://localhost:3000/station/Houston/exit
    async exit(request: Request, response: Response, next: NextFunction) {
        const { station } = request.params;
        const { card_number } = request.body;
        try {
            const stop = await this.findStation(station);
            const fare = 0;
            const card = await this.cardController.getOneCard(card_number);
            const message = { "amount": card["balance"] }
            await this.transactionController.newTransaction(card_number, station, fare, card["balance"], false);

            response.status(200).json(message);

        } catch (error) {
            next(error)
        };
    }


    //curl -X POST -d 'name="1"' http://localhost:3000/trainlines
    //curl -X POST -H "Content-Type: application/json" -d '{"name": "1", "stations": ["WTC","Chambers","Franklin","Canal", "Houston", "Christopher", "14th", "24th"], "fare": 2.75}' http://localhost:3000/stations
    //curl -X POST -H "Content-Type: application/json" -d '{"name": "E", "stations": ["Spring", "West 4th", "14th", "23rd", "34th", "42nd", "50th"], "fare": 2.75}' http://localhost:3000/stations
    async save(request: Request, response: Response, next: NextFunction) {
        const { name, stations, fare } = request.body;

        var trainline_id;
        console.log(name, stations, fare)

        // Check if trainline already exists
        let trainline = await this.trainlineRepository.findOneBy({ name: name });
        console.log(trainline);
        if (!trainline) {
            // Create new trainline entity with provided name
            const newTrainline = Object.assign(new Trainline(), {
                name
            })
            try {
                const updated_trainline = await this.trainlineRepository.save(newTrainline);
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
                trainlineName: name,
                fare: fare
            });

        }

        try {
            await this.stationRepository.save(stationArray);
            response.status(200).json({ message: `Stations saved` });
        } catch (error) {
            next(error);
        }

    }
}
