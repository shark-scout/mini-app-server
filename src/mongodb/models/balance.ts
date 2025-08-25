import { ObjectId } from "mongodb";
import { AlchemyToken } from "../../types/alchemy-token";

export class Balance {
  constructor(
    public created: Date,
    public address: string,
    public alchemyTokens: AlchemyToken[],
    public _id?: ObjectId
  ) {}
}
