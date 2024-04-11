import { useState, useEffect } from "react";
import axios from "axios";
import { getBlockName } from "@/helpers";

interface IToken {
    id: string;
    image?: string;
    price?: number;
    total_supply?: number;
    market_cap?: number
    volume?: number
}


export const useTokenDetails = (address: string, chainId: number | undefined) => {
    const [token, setToken] = useState<IToken | null>(null);
    const [loading, setLoading] = useState(false);

    const getToken = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${getBlockName(
                    chainId
                )}/contract/${address}`
            );
            setToken({
                id: data.id,
                image: data?.image.thmnb,
                market_cap: data?.market_data?.market_cap?.usd,
                price: data?.market_data?.current_price?.usd,
                total_supply: data?.market_data?.total_supply,
                volume: data?.market_data?.total_volume?.usd,
            });
            setLoading(false);
        } catch (err) {

            setLoading(false);
        }
    };

    useEffect(() => {
        if (address) {
            const interval = setInterval(() => {
                getToken();
            }, 20000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [address]);

    return {
        token,
        loading,
    };
};
