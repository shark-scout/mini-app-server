import { ObjectId } from "mongodb";

export class Trend {
  constructor(
    public created: Date,
    public type: "buy" | "sell",
    public token: {
      address: string;
      name: string;
      symbol: string;
      icon: string;
    },
    public transactions: {
      hash: string;
      value: number;
    }[],
    public users: {
      fid: number;
    }[],
    public value: number,
    public _id?: ObjectId
  ) {}
}
