import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Transaction } from '../entity/Transction'

export class TransactionController {

    private transactionRepository = AppDataSource.getRepository(Transaction);
    //http://localhost:3000/transaction
    async allTransactions(request: Request, response: Response, next: NextFunction) {
        return this.transactionRepository.find()
    }

    async newTransaction(uuid: string, station: string, fare: number, remainingbalance: number, isEnter: boolean) {
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
