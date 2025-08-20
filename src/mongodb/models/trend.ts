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
      address: string; // TODO: Replace with fid
    }[],
    public value: number,
    public _id?: ObjectId
  ) {}
}
