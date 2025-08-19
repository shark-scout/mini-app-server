import { ObjectId } from "mongodb";
import { ZerionTransaction } from "../../types/zerion-transaction";

export class Transaction {
  constructor(
    public created: Date,
    public address: string,
    public zerionTransaction: ZerionTransaction,
    public _id?: ObjectId
  ) {}
}
