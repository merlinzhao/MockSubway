import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Trainline } from "../entity/Trainline"
import { Station } from '../entity/Station'
import { CardController } from './CardController'
import { TransactionController } from './TransactionController'
import { TrainlineController } from './TrainlineController'

export class StationController {
    private stationRepository = AppDataSource.getRepository(Station)
    private trainlineRepository = AppDataSource.getRepository(Trainline)
    private trainlineController = new TrainlineController();
    private cardController = new CardController()
    private transactionController = new TransactionController();

    async all(request: Request, response: Response, next: NextFunction) {
        /* Get all stations */
        try {
            const stations = await this.stationRepository.find();
            response.status(200).json(stations);
        } catch (error) {
            console.error('Error getting all stations: ', error);
            return response.status(500).json({ error: 'Error getting all stations' });
        };
    }

    async enter(request: Request, response: Response, next: NextFunction) {
        /*Create a new transaction on station enter, indicates enter station, gets the
        fare for the station, deducts from card_number balance, returns card_number and updated balance*/
        const { station } = request.params;
        const { card_number } = request.body;
        if (!station || typeof station !== 'string') return response.status(400).json({ error: 'Invalid station parameter' });
        if (!card_number || typeof card_number !== 'string') return response.status(400).json({ error: 'Invalid card_number parameter' });
        try {
            const stop = await this.findStation(station);
            const fare = -stop["fare"];
            const updated = await this.cardController.updateCardBalance(card_number, fare)
            const message = { "amount": updated.amount }

            await this.transactionController.newTransaction(card_number, station, fare, updated.amount, true);
            console.log(`CARD ${card_number} ENTERED ${station}`);
            return response.status(200).json(message);
        } catch (error) {
            console.error('Error creating an enter transaction: ', error);
            return response.status(500).json({ error: 'Error creating an enter transaction' });
        };
    }

    async exit(request: Request, response: Response, next: NextFunction) {
        /*Create a new transaction, indicates exit station, remaining balance,and does not deduct
        any fare, returns card_number and balance*/
        const { station } = request.params;
        const { card_number } = request.body;
        if (typeof card_number !== 'string' || card_number.trim().length === 0) {
            return response.status(400).json({ error: 'Invalid card_number parameter' });
        }
        if (typeof station !== 'string' || station.trim().length === 0) {
            return response.status(400).json({ error: 'Invalid station parameter' });
        }

        try {
            const fare = 0;
            const card = await this.cardController.getOneCard(card_number);
            const message = { "amount": card["balance"] }
            await this.transactionController.newTransaction(card_number, station, fare, card["balance"], false);
            console.log(`CARD ${card_number} EXITED ${station}`);
            return response.status(200).json(message);
        } catch (error) {
            console.error('Error creating an exit transaction: ', error);
            return response.status(500).json({ error: 'Error creating an exit transaction' });
        };
    }

    async newTrainline(request: Request, response: Response, next: NextFunction) {
        /*Creates new trainline. If trainline not in train_lines database, new entry is made. 
        All stations written into train_line_stations.
        */
        const { name, stations, fare } = request.body;
        if (typeof name !== 'string' || name.trim().length === 0) return response.status(400).json({ error: 'Invalid name parameter' });
        if (!Array.isArray(stations) || stations.length === 0) return response.status(400).json({ error: 'Invalid stations parameter' });
        if (typeof fare !== 'number' || isNaN(fare)) return response.status(400).json({ error: 'Invalid fare parameter' });

        let trainline_id;
        try {
            // Check if trainline already exists with givn name from train_lines table 
            let trainline = await this.trainlineController.findTrainline(name);
            if (!trainline) {
                // Create new trainline entity with provided name
                const newTrainline = Object.assign(new Trainline(), {
                    name
                })
                const updated_trainline = await this.trainlineRepository.save(newTrainline);
                trainline_id = updated_trainline.id;
                console.log(`Trainline ${name} was not found. New trainline created`)

            } else {
                trainline_id = trainline.id;
            }
            // Format stations to store into train_line_stations table
            const stationArray = [];
            for (const stationName of stations) {
                stationArray.push({
                    name: stationName,
                    trainlineId: trainline_id,
                    trainlineName: name,
                    fare: fare
                });
            }
            await this.stationRepository.save(stationArray);
            response.status(200).json({ message: `TRAINLINE ${name} STATIONS CREATED` });
        } catch (error) {
            console.error('Error saving new stations for trainline: ', error);
            return response.status(500).json({ error: 'Error saving new stations for trainline' });
        }
    }

    async findStation(station: string) {
        /* find one station */
        try {
            return await this.stationRepository.findOneBy({ name: station })
        } catch (error) {
            console.error('Cannot find station: ', error);
            throw new Error('Cannot find station');
        }
    }
}
