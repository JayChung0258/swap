import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  // supportedChainIds: [1],
  supportedChainIds: [5],
});

// chain id 1 -> mainnet goerli -> 5