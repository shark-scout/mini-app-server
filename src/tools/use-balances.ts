import dotenv from "dotenv";
dotenv.config();

import { findBalances } from "../mongodb/services/balances";
import { createBalances, getBalancesUsdValue } from "../utils/balances";
import { logger } from "../utils/logger";

async function main() {
  logger.info("Starting script...");

  const addresses = [
    "0x52793D3B013e826235655C59a69175fcEb20C654",
    "0xb127a792C83a72e6d961df9E41a5E414e22d80Ba",
  ];
  await createBalances(addresses);
  const balances = await findBalances({ addresses });
  const balancesUsdValue = getBalancesUsdValue(balances);
  logger.info("USD value for balances: $" + balancesUsdValue.toFixed(2));

  logger.info("Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
