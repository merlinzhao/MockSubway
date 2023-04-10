import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Trainline } from "../entity/Trainline"

export class TrainlineController {

    private trainlineRepository = AppDataSource.getRepository(Trainline)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.trainlineRepository.find()
    }
    //http://localhost:3000/trainlines/E
    async one(request: Request, response: Response, next: NextFunction) {
        const trainline_name = request.params.name
        console.log("PARAMS!! ", request.params)

        const trainline = await this.trainlineRepository.findOneBy({
            name: trainline_name
        })
        console.log(trainline)

        if (!trainline) {
            return "unregistered trainline"
        }
        return trainline
    }
    //curl -X POST -d 'name="1"' http://localhost:3000/trainlines
    //curl -X POST -H "Content-Type: application/json" -d '{"name": "1"}' http://localhost:3000/trainlines
    async save(request: Request, response: Response, next: NextFunction) {
        const { name } = request.body;

        const trainline = Object.assign(new Trainline(), {
            name
        })

        try {
            const new_trainline = await this.trainlineRepository.save(trainline);
            response.status(200).json({ message: `Trainline saved successfully ${new_trainline.name}` });
        } catch (error) {
            next(error);
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const trainline_name = request.params.trainline_name

        let trainlineToRemove = await this.trainlineRepository.findBy({ name: trainline_name })

        if (!trainlineToRemove) {
            return "this trainline not exist"
        }

        await this.trainlineRepository.remove(trainlineToRemove)

        return "user has been removed"
    }

}