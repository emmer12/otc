import { ERC20Contract } from "@/helpers/contract";
import { get_blockchain_from_chainId } from "@/helpers/rpc";
import { Blockchain } from "@/types";
import { fromBigNumber } from "@/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

export const useWalletBalance = (address: string, decimal?: number) => {
  const { account, chainId, library } = useWeb3React<Web3Provider>();
  const chain: Blockchain = get_blockchain_from_chainId(chainId);
  const [balance, setBalance] = useState(0);

  const getTokenBalance = async () => {
    if (!address) return;
    const contract = await ERC20Contract(address, chain, library);
    const balance = await contract.balanceOf(account as string);
    const val: any = fromBigNumber(balance, decimal);
    console.log(val, "This is the valu");
    setBalance(val);
  };

  useEffect(() => {
    getTokenBalance();
  }, [address]);

  return {
    balance,
  };
};
