import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { ListI } from "@/types";
import { parseError } from "@/utils";
import {
  getBlockName,
  getChainDecimal,
  getDefaultTokens,
  getLocalTokens,
  isAddress,
  removeDuplicates,
} from "@/helpers";
import { BASE_URL } from "@/helpers/apiHelper";
import { chains } from "@/data";
import Moralis from "moralis";
import { useToken } from "./useToken";

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
  const [volume, setVolume] = useState<{
    hour: number;
    weekly: number;
    monthly: number;
    allTime: number;
  }>({
    hour: 0,
    weekly: 0,
    monthly: 0,
    allTime: 0,
  });

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
        const {
          listings: data,
          volume,
          weeklyVolume,
          monthlyVolume,
          allTimeVolume,
        } = response.data;
        setData(data);
        setVolume({
          hour: volume,
          weekly: weeklyVolume,
          monthly: monthlyVolume,
          allTime: allTimeVolume,
        });
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

  tokens = removeDuplicates(tokens, "address");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const throttledTerm = useThrottle(query, 100);

  useEffect(() => {
    setResults(tokens);
  }, [w_tokens]);

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
              decimal_place: getChainDecimal(chainId, data?.detail_platforms),
              usd: data?.market_data?.current_price?.usd,
            },
          ];

          setResults(rs);
        });
    }
  }

  // if (results.length < 1) {
  //   const chainTokens = useToken(query);

  //   tokens = [chainTokens];
  // }

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
