import { ObjectId } from "mongodb";

export class Balance {
  constructor(
    public createdAt: Date,
    public address: string,
    public alchemyTokensUsdValue: number,
    public _id?: ObjectId
  ) {}
}
