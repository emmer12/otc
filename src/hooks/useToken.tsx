import tokenABI from "./../contracts/erc20Abi.json";
import { useEffect, useState } from "react";
import { ERC20Contract } from "@/helpers/contract";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Blockchain } from "@/types";
import { get_blockchain_from_chainId } from "@/helpers/rpc";

export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId?: number;
  isImport?: boolean;
}

export const useToken = (address: string) => {
  const { account, chainId, library } = useWeb3React<Web3Provider>();
  const chain: Blockchain = get_blockchain_from_chainId(chainId);

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  const getInfo = async () => {
    const tokenContract = await ERC20Contract(address, chain, library);

    const [name, symbol, decimals] = await Promise.all([
      tokenContract?.name(),
      tokenContract?.symbol(),
      tokenContract?.decimals(),
    ]);

    setTokenInfo({
      address,
      name,
      symbol,
      decimals,
      chainId,
      logoURI: "",
    });
  };

  useEffect(() => {
    if (!address) return;
    getInfo();
  }, [address, chainId]);

  return tokenInfo;
};
