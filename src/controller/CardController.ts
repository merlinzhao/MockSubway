import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Card } from '../entity/Card'

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

    //curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": -2.75}' http://localhost:3000/card
    //curl -X POST -H "Content-Type: application/json" -d '{"uuid": "1234", "amount": 10.0}' http://localhost:3000/card
    async card(request: Request, response: Response, next: NextFunction) {
        const { uuid, amount } = request.body;
        const card = await this.getOneCard(uuid)
        if (card) {
            try {
                console.log(`UPDATING EXISTING CARD: ${uuid}`)
                const updateResponse = await this.updateCardBalance(uuid, amount);
                response.status(200).json(updateResponse);
            } catch (error) {
                next(error)
            }

        } else {
            try {
                const newCard = Object.assign(new Card(), {
                    uuid: uuid,
                    balance: amount
                })
                let message;
                if (newCard.balance < 0) {
                    message = { error: "New balance cannot be less than zero." }
                } else {
                    console.log(`NEW CARD CREATED: ${uuid}`);
                    await this.cardRepository.save(newCard);
                    message = { number: uuid, amount: amount }
                }
                response.status(200).json(message);
            } catch (error) {
                next(error);
            }
        }
    }

    async updateCardBalance(uuid: string, amount: number) {
        try {
            const card = await this.getOneCard(uuid)
            if (card["balance"] <= 0) {
                return { error: "insufficent funds", number: uuid, amount: card["balance"] };
            }
            const newBalance = parseFloat(card["balance"]) + amount;
            await this.cardRepository
                .createQueryBuilder()
                .update(card)
                .where("uuid = :uuid", { uuid: uuid })
                .set({
                    balance: newBalance
                })
                .execute();
            return { number: uuid, amount: newBalance };

        } catch (error) {
            return { error: `card: ${uuid} could not be updated` }
        }
    }

    async getOneCard(uuid: string) {
        try {
            if (!uuid) return {};
            const card = await this.cardRepository.findOneBy({ uuid: uuid });
            console.log("Found existing card:", card);
            return card;
        } catch (err) {
            console.error("Error retrieving card:", err);
            throw new Error("Failed to retrieve card from database");
        }
    }

}
