import { ZerionTransaction } from "./zerion-transaction";

export type Transaction = {
  address: string;
  transaction: ZerionTransaction;
};
