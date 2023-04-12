import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Trainline } from "../entity/Trainline"

export class TrainlineController {

    private trainlineRepository = AppDataSource.getRepository(Trainline)

    async allTrainlines(request: Request, response: Response, next: NextFunction) {
        /* Get all trainlines*/
        try {
            const allTrainlines = await this.trainlineRepository.find();
            response.status(200).json(allTrainlines)
        } catch (error) {
            console.error('Error getting all trainline:', error);
            response.status(500).json({ error: 'Error getting all trainline' });
        }
    }

    async getTrainline(request: Request, response: Response, next: NextFunction) {
        /*Get a specific trianline*/
        const trainlineName = request.params.name;
        if (typeof trainlineName !== 'string') response.status(400).json({ error: 'Invalid input: trainlineName should be a string' });
        try {
            const trainline = await this.trainlineRepository.findOneBy({
                name: trainlineName
            });
            response.status(200).json(trainline);
        } catch (error) {
            console.error('Error getting trainline:', error);
            response.status(500).json({ error: 'Error getting trainline' });
        }
    }

    async newLine(request: Request, response: Response, next: NextFunction) {
        /* Create a new trainline in table train_lines*/
        const { name } = request.body;
        if (typeof name !== 'string') response.status(400).json({ error: 'Invalid input: name should be a string' });

        try {
            await this.saveTrainline(name);
            response.status(200).json({ message: `Trainline saved successfully` });
        } catch (error) {
            console.error('Error saving trainline:', error);
            response.status(500).json({ error: 'Error saving trainline' });
        }
    }

    async saveTrainline(name: string) {
        /* Write a new trainline in table train_lines*/
        try {
            const trainline = Object.assign(new Trainline(), {
                name
            })
            await this.trainlineRepository.save(trainline);
        } catch (error) {
            console.error('Error writing trainline to database:', error);
            throw new Error('Error writing trainline to database');
        }
    }

    async findTrainline(trainlineName: string) {
        /* Find a trainline in table train_lines*/
        try {
            const trainline = await this.trainlineRepository.findOneBy({
                name: trainlineName
            })
            return trainline;
        } catch (error) {
            console.error('Error finding trainline in database:', error);
            throw new Error('Error finding trainline in database');
        }
    }
}
