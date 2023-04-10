import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Transaction } from '../entity/Transction'

export class TransactionController {

    private transactionRepository = AppDataSource.getRepository(Transaction);
    //http://localhost:3000/transaction
    async allTransactions(request: Request, response: Response, next: NextFunction) {
        return this.transactionRepository.find()
    }

}
