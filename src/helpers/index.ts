import axios from "axios";
import { chains, fuji_test_tokens, gobi_tokens, sepolia_tokens } from "@/data";
import { ethers } from "ethers";
import { Blockchain } from "@/types";
import {
  goerliTokens,
  polygonTokens,
  bnbTokens,
  ethereumTokens,
  arbitrumTokens,
  horizonTokens

} from "@/constansts/tokens";

export const truncate = (
  fullStr: string,
  strLen: number,
  separator?: string,
  position: "center" | "start" | "end" = "center"
) => {
  if (fullStr.length <= strLen) return fullStr;
  separator = separator || "...";

  let sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  const result =
    position === "end"
      ? fullStr?.substr(0, frontChars) + separator
      : fullStr?.substr(0, frontChars) +
      separator +
      fullStr?.substr(fullStr?.length - backChars);

  return result;
};

export const formatExplorerUrl = (address: string) => {
  return `https://test.bscscan.com/address/${address}`;
};

export const getDefaultTokens = (chainId = 5) => {
  switch (chainId) {
    case 43113:
      return fuji_test_tokens;
    case 1:
      return ethereumTokens;
    case 5:
      return goerliTokens;
    case 56:
      return bnbTokens;
    case 137:
      return polygonTokens;
    case 42161:
      return arbitrumTokens;
    case 5000:
      return [];
    case 8453:
      return [];
    case 81457:
      return [];
    case 7332:
      return horizonTokens
    case 1663:
      return gobi_tokens
    case 11155111:
      return sepolia_tokens
    default:
      return ethereumTokens;
      break;
  }
};

export const getLocalTokens = () => {
  return JSON.parse(localStorage.getItem("localTokens") as string);
};

export const setLocalToken = (data: any) => {
  let lTokens = getLocalTokens();

  if (lTokens) {
    lTokens.push(data);
  } else {
    lTokens = [data];
  }
  localStorage.setItem("localTokens", JSON.stringify(lTokens));
  return true;
};

export const isAddress = (value: string) => ethers.utils.isAddress(value);

export const supportedChainsMainnet = [Blockchain.Bsc, Blockchain.Eth];
export const supportedTestnet = [Blockchain.AvaxFuji, Blockchain.Goerli];

export const getChainContract = (chainId: number | undefined) => {
  switch (chainId) {
    case 43113:
      return import.meta.env.VITE_CONTRACT_ADDRESS_FUJI;
    case 42161:
      return import.meta.env.VITE_CONTRACT_ADDRESS_ARBITRUM;
    case 1:
      return import.meta.env.VITE_CONTRACT_ADDRESS_ETH_MAINNET;
    case 5:
      return import.meta.env.VITE_CONTRACT_ADDRESS_GOEILY_TESTNET;
    case 56:
      return import.meta.env.VITE_CONTRACT_ADDRESS_BSC_MAINNET;
    case 137:
      return import.meta.env.VITE_CONTRACT_POLYGON_MAINNET;
    case 5000:
      return import.meta.env.VITE_CONTRACT_ADDRESS_MANTLE;
    case 8453:
      return import.meta.env.VITE_CONTRACT_ADDRESS_BASE;
    case 81457:
      return import.meta.env.VITE_CONTRACT_ADDRESS_BLAST;
    case 1663:
      return import.meta.env.VITE_CONTRACT_ADDRESS_GOBI;
    case 7332:
      return import.meta.env.VITE_CONTRACT_ADDRESS_EON;
    case 11155111:
      return import.meta.env.VITE_CONTRACT_ADDRESS_BSC_MAINNET;
    default:
      import.meta.env.VITE_CONTRACT_ADDRESS_ETH_MAINNET;
      break;
  }
};


export const getChainDecimal = (chainId: any, details: any) => {
  switch (chainId) {
    case 1:
      return details.ethereum.decimal_place;
      break;
    case 137:
      return details["polygon-pos"].decimal_place;
      break;
    case 56:
      return details["binance-smart-chain"].decimal_place;
      break;
    case 42161:
      return details["arbitrum-one"].decimal_place;
      break;
    case 8453:
      return details["base"].decimal_place;
      break;
    case 81457:
      return details["blast"].decimal_place;
      break;
    case 5000:
      return details["mantle"].decimal_place;
      break;
    default:
      return details.ethereum.decimal_place;
      break;
  }
};

export const getBlockName = (chainId: any) => {
  switch (chainId) {
    case 1:
      return "ethereum";
      break;
    case 137:
      return "polygon-pos";
      break;
    case 56:
      return "binance-smart-chain";
      break;
    case 8453:
      return "base";
      break;
    case 81457:
      return "blast";
      break;
    case 42161:
      return "arbitrum-one";
      break;
    case 5000:
      return "mantle";
      break;
    default:
      return "ethereum";
      break;
  }
};

export const getDailyVolume = () => {
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS_ETH_MAINNET;
  const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

  // Get the current Unix timestamp (in seconds) and the Unix timestamp from 24 hours ago
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 172800;
  // 86400;

  // Build the API endpoint URL for retrieving the contract's transactions for the last 24 hours
  const endpoint = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${CONTRACT_ADDRESS}&startblock=0&endblock=999999999&sort=desc&apikey=${API_KEY}&starttime=${yesterday}&endtime=${now}`;

  // Make a GET request to the API endpoint
  axios
    .get(endpoint)
    .then((response) => {
      // Extract the transaction data from the API response
      const transactions = response.data.result;

      console.log(transactions);

      // Calculate the total volume of transactions in the last 24 hours
      const totalVolume = transactions.reduce(
        (acc: any, tx: any) => acc + parseInt(tx.value),
        0
      );

      console.log(
        `The daily volume of ${CONTRACT_ADDRESS} transactions is ${totalVolume}`
      );
    })
    .catch((error) => {
      console.error("An error occurred:", error.message);
    });
};

export const computeUsdPrice = (usd: any, amount: number) => {
  return (usd * amount).toLocaleString('en-Us');
};

export const toEther = (weiAmount: string, decimal_place: any) =>
  ethers.utils.formatUnits(weiAmount, decimal_place);


export const checkRelay = (chainId: number | undefined) => !!chains.find((chain) => chain.chainId == chainId)?.relay


export const removeDuplicates = (arr: any, prop: string) => {
  return arr.filter((obj: any, index: number, self: any) =>
    index === self.findIndex((item: any) => (
      item[prop].toLowerCase() === obj[prop].toLowerCase()
    ))
  );
}

export const getPercentage = (total: number | undefined, value: number | undefined) => {
  return value ? Math.floor((value / total) * 100) : 0

}