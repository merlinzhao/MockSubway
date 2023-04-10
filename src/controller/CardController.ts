import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Card } from '../entity/Card'
import { EntityManager, getManager } from 'typeorm';

export class CardController {

    private cardRepository = AppDataSource.getRepository(Card);
    //http://localhost:3000/card
    async allCards(request: Request, response: Response, next: NextFunction) {
        return await this.cardRepository.find()
    }
    //http://localhost:3000/card/1234
    async getCard(request: Request, response: Response, next: NextFunction) {
        const uuid = request.params.uuid
        try {
            const card = await this.getOneCard(uuid);
            response.status(200).json(card);
        } catch (error) {
            next(error)
        }
    }

    //curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": -2.75}' http://localhost:3000/card/update

    async updateCardBalance(request: Request, response: Response, next: NextFunction) {
        const { uuid, amount } = request.body;
        try {
            const card = await this.getOneCard(uuid)
            const newBalance = parseFloat(card["balance"]) + parseFloat(amount)
            card["balance"] = newBalance;
            console.log(card, newBalance)
            const update = await this.cardRepository
                .createQueryBuilder()
                .update(Card)
                .set({
                    balance: newBalance
                })
                .execute();
            console.log(update)
            response.status(200).json({ message: `card ${uuid} now has balance ${newBalance}` });

        } catch (error) {
            next(error)
        }
    }

    //curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": 10.0}' http://localhost:3000/card/new
    async newCard(request: Request, response: Response, next: NextFunction) {
        const { uuid, amount } = request.body;
        const card = Object.assign(new Card(), {
            uuid: uuid,
            balance: amount
        })

        try {
            const createdCard = await this.cardRepository.save(card);
            response.status(200).json({ message: `New card registered successfully uuid: ${createdCard.uuid}, balance: ${createdCard.balance}` });
        } catch (error) {
            next(error);
        }
    }

    async getOneCard(uuid: string) {
        console.log("get one card", uuid)
        if (!uuid) return {};
        const card = await this.cardRepository.findOneBy({ uuid: uuid })
        console.log("getOenCArd", card)
        return card;

    }

}
