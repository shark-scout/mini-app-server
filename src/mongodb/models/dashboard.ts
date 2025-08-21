import { ObjectId } from "mongodb";
import { Trend } from "../../types/trend";

export class Dashboard {
  constructor(
    public created: Date,
    public fid: number,
    public trends: Trend[],
    public _id?: ObjectId
  ) {}
}
