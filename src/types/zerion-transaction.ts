type Icon = {
  url: string;
};

type Flags = {
  verified: boolean;
};

type Implementation = {
  chain_id: string;
  address: string;
  decimals: number;
};

type FungibleInfo = {
  id: string;
  name: string;
  symbol: string;
  icon: Icon;
  flags: Flags;
  implementations: Implementation[];
};

type Quantity = {
  int: string;
  decimals: number;
  float: number;
  numeric: string;
};

type Fee = {
  fungible_info: FungibleInfo;
  quantity: Quantity;
  price: number;
  value: number;
};

type Transfer = {
  fungible_info: FungibleInfo;
  direction: "in" | "out";
  quantity: Quantity;
  value: number;
  price: number;
  sender: string;
  recipient: string;
  act_id: string;
};

type ApplicationMetadata = {
  contract_address: string;
  method: {
    id: string;
    name: string;
  };
};

type Act = {
  id: string;
  type: string;
  application_metadata: ApplicationMetadata;
};

type TransactionFlags = {
  is_trash: boolean;
};

type TransactionAttributes = {
  operation_type: string;
  hash: string;
  mined_at_block: number;
  mined_at: string;
  sent_from: string;
  sent_to: string;
  status: "confirmed" | "pending" | "failed";
  nonce: number;
  fee: Fee;
  transfers: Transfer[];
  approvals: any[];
  flags: TransactionFlags;
  acts: Act[];
};

type ChainRelationship = {
  links: {
    related: string;
  };
  data: {
    type: "chains";
    id: string;
  };
};

type Relationships = {
  chain: ChainRelationship;
};

export type ZerionTransaction = {
  type: "transactions";
  id: string;
  attributes: TransactionAttributes;
  relationships: Relationships;
};
