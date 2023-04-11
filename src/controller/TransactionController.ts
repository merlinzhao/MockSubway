import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Transaction } from '../entity/Transction'

export class TransactionController {

    private transactionRepository = AppDataSource.getRepository(Transaction);

    async allTransactions(request: Request, response: Response, next: NextFunction) {
        /*Get all transactions*/
        try {
            const transactions = await this.transactionRepository.find()
            response.status(200).json(transactions)
        } catch (error) {
            console.error('Error getting all transactions: ', error);
            return response.status(500).json({ error: 'Error getting all transactions' });
        }
    }

    async newTransaction(uuid: string, station: string, fare: number, remainingbalance: number, isEnter: boolean) {
        /* Write a new transaction into the database with given parameters*/
        try {
            const newTransaction = Object.assign(new Transaction(), {
                uuid: uuid,
                station: station,
                fare: fare,
                remainingbalance: remainingbalance,
                isEnter: isEnter
            });
            console.log(`NEW CARD CREATED: ${uuid}`);
            await this.transactionRepository.save(newTransaction);
            return {
                uuid: uuid,
                station: station,
                fare: fare,
                remainingbalance: remainingbalance,
                isEnter: isEnter
            };
        } catch (err) {
            console.error("Error processing new transaction:", err);
            throw new Error("Failed to process new transaction");
        }
    }
}
