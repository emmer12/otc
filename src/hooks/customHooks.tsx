import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { ListI } from "@/types";
import { parseError } from "@/utils";
import { getDefaultTokens, getLocalTokens, isAddress } from "@/helpers";
import { BASE_URL } from "@/helpers/apiHelper";
import { chains } from "@/data";
import Moralis from "moralis";
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

export const useTokenFetch = (query: string, chainId = 1, w_tokens: any) => {
  let tokens = w_tokens.concat(getDefaultTokens(chainId)) as any[];
  tokens = tokens.reduce((acc, curr) => {
    if (!acc.find((item: any) => item.address == curr.address)) {
      acc.push(curr);
    }
    return acc;
  }, []);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const throttledTerm = useThrottle(query, 100);

  useEffect(() => {
    setResults(tokens);
  }, [w_tokens]);

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

export const useGetWalletTokens = (
  address: any,
  chainId: number | undefined
) => {
  const [tokens, setTokens] = useState<any>([]);

  useEffect(() => {
    async function fetchTokens() {
      if (address) {
        try {
          if (!Moralis.Core.isStarted) {
            await Moralis.start({
              apiKey: import.meta.env.VITE_MORALIS_API_KEY,
            });
          }
          const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            chain: chainId,
            tokenAddresses: [],
            address: address,
          });

          let tokenRes = response.raw.map((token) => {
            return {
              chainId: chainId,
              address: token.token_address,
              symbol: token.symbol,
              name: token.name,
              decimal_place: token.decimals,
              icon: token.logo,
              balance: token.balance,
            };
          });
          setTokens(tokenRes);
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetchTokens();
  }, [address]);

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
