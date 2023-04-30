import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { ListI } from "@/types";
import { parseError } from "@/utils";
import { getDefaultTokens, getLocalTokens, isAddress } from "@/helpers";
import { BASE_URL } from "@/helpers/apiHelper";
import { chains } from "@/data";
import { ethers } from "ethers";
function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}

export const useListFetch = (curChain = "eth") => {
  const [loading, setStatus] = useState(true);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<ListI[]>([]);
  const [volume, setVolume] = useState<number>(0);

  const chain = chains.find((chain) => chain.name.toLowerCase() == curChain);
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    let source = CancelToken.source();
    source && source.cancel("Operation canceled due to new request");
    source = CancelToken.source();
    setStatus(true);
    axios
      .get(`${BASE_URL}/lists?s=${query}&chain=${chain ? chain.chainId : 1}`, {
        cancelToken: source.token,
      })
      .then((response) => {
        const { listings: data, volume } = response.data;
        setData(data);
        setVolume(volume);
      })
      .catch((error: any) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled error", error.message);
        } else {
          parseError(error);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setStatus(false);
        }, 1000);
      });

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, [query, chain]);

  return { loading, data, query, setQuery, volume };
};

export const useTokenFetch = (query: string, chainId = 1, provider: any) => {
  const tokens = getDefaultTokens(chainId) as any[];
  const [results, setResults] = useState(tokens);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const throttledTerm = useThrottle(query, 100);

  // const walletTokens = async () => {
  //   const tokenAddresses = await provider.send("eth_accounts", []);
  //   const signer = provider.getSigner();
  //   const address = await signer.getAddress();
  //   console.log(tokenAddresses);
  // };

  // walletTokens();

  let res = useMemo(() => {
    let rs = tokens.filter((token: any) =>
      Object.values(token).join("").toLowerCase().includes(query.toLowerCase())
    );
    setResults(rs);
  }, [throttledTerm]);

  //https: api.coingecko.com/api/v3/coins/ethereum/contract/
  // ​/coins​/{id}​/contract​/{contract_address}​/market_chart​/

  if (results.length < 1) {
    if (isAddress(query)) {
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${getBlockName(
            chainId
          )}/contract/${query}`
        )
        .then(({ data }) => {
          let rs = [
            {
              symbol: data.symbol,
              name: data.name,
              icon: data?.image?.small,
              address: data?.contract_address,
              decimal_place: getDecimal(chainId, data?.detail_platforms),
              usd: data?.market_data?.current_price?.usd,
            },
          ];

          setResults(rs);
        });
    }
  }

  // const localTokens = getLocalTokens();
  // results = localTokens ? [...localTokens].concat(results) : results;

  return {
    results,
    loading,
    error,
  };
};

export const useGetWalletTokens = (provider: any, address: any) => {
  const [tokens, setTokens] = useState([]);

  console.log(provider);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const abi = [
          // ABI for the ERC-20 token standard
          "function balanceOf(address) view returns (uint)",
          "function decimals() view returns (uint8)",
          "function symbol() view returns (string)",
          "function name() view returns (string)",
        ];
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balancePromises = await Promise.all(
          tokens.map((token: any) => {
            const contract = new ethers.Contract(token.address, abi, signer);
            return Promise.all([
              token,
              contract.balanceOf(address),
              contract.decimals(),
              contract.symbol(),
              contract.name(),
            ]);
          })
        );
        const balanceData: any = balancePromises.map(
          ([token, balance, decimals, symbol, name]) => ({
            ...token,
            balance: balance.toString(),
            decimals: decimals.toNumber(),
            symbol,
            name,
          })
        );
        setTokens(balanceData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTokens();
  }, [provider, address]);

  return tokens;
};

const getDecimal = (chainId: any, details: any) => {
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
    default:
      return "ethereum";
      break;
  }
};
