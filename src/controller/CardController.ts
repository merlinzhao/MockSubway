import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Card } from '../entity/Card'

export class CardController {

    private cardRepository = AppDataSource.getRepository(Card);
    //http://localhost:3000/card
    async allCards(request: Request, response: Response, next: NextFunction) {
        return this.cardRepository.find()
    }

}
