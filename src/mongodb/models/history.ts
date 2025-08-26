import { ObjectId } from "mongodb";
import { ZerionTransaction } from "../../types/zerion-transaction";

export class History {
  constructor(
    public createdAt: Date,
    public address: string,
    public zerionTransactions: ZerionTransaction[],
    public minMinedAt: Date,
    public maxMinedAt: Date,
    public _id?: ObjectId
  ) {}
}
