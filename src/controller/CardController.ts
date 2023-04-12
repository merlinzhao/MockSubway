import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Card } from '../entity/Card'

export class CardController {

    private cardRepository = AppDataSource.getRepository(Card);

    async allCards(request: Request, response: Response, next: NextFunction) {
        /* get all cards from card table */
        try {
            return await this.cardRepository.find()
        } catch (error) {
            console.error('Error getting all card: ', error);
            response.status(500).json({ error: 'Error getting card all' });
        }
    }

    async getCard(request: Request, response: Response, next: NextFunction) {
        /* get one card from database */
        const uuid = request.params.uuid
        if (typeof uuid !== 'string' || uuid.trim().length === 0) response.status(400).json({ error: 'Invalid uuid parameter' });
        try {
            const card = await this.getOneCard(uuid);
            response.status(200).json(card);
        } catch (error) {
            console.error('Error getting card: ', error);
            response.status(500).json({ error: 'Error getting card' });
        }
    }

    async card(request: Request, response: Response, next: NextFunction) {
        /*If card does not exist in table, then create new card with amount. Otherwise add amount to existing card*/
        const { uuid, amount } = request.body;
        if (typeof uuid !== 'string' || uuid.trim().length === 0) response.status(400).json({ error: 'Invalid uuid parameter' });
        if (typeof amount !== 'number' || isNaN(amount)) response.status(400).json({ error: 'Invalid amount parameter' });
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
                console.error('Error handling card request: ', error);
                response.status(500).json({ error: 'Error handling card request' });
            }
        }
    }

    async updateCardBalance(uuid: string, amount: number) {
        /*Update the given card uuid balance based on amount*/
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
            console.error("Error updaing card:", error);
            throw new Error("Error updating card");
        }
    }

    async getOneCard(uuid: string) {
        /* get only one card */
        try {
            if (!uuid) return {};
            const card = await this.cardRepository.findOneBy({ uuid: uuid });
            console.log("Found existing card:", card);
            return card;
        } catch (error) {
            console.error("Error retrieving card:", error);
            throw new Error("Failed to retrieve card from database");
        }
    }
}
