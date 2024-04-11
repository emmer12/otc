import { useState, useEffect } from "react";
import axios from "axios";
import { getBlockName } from "@/helpers";

export const useTokenPrice = (address: string, chainId: number | undefined) => {
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const getTokenPrice = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${getBlockName(
          chainId
        )}/contract/${address}`
      );
      setPrice(data?.market_data?.current_price?.usd);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      const interval = setInterval(() => {
        getTokenPrice();
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [address]);

  return {
    price,
    loading,
  };
};
