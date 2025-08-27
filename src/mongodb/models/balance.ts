import { ObjectId } from "mongodb";
import { AlchemyToken } from "../../types/alchemy-token";

export class Balance {
  constructor(
    public createdAt: Date,
    public address: string,
    public alchemyTokens: AlchemyToken[],
    public alchemyTokensUsdValue: number,
    public _id?: ObjectId
  ) {}
}
