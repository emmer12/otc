import { approveToken, getTotalSupply } from "@/helpers/contract";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { toast } from "react-toastify";
import { parseSuccess } from "@/utils";
import { useState } from "react";
import { useAllowance } from "./useAllowance";

export const useApprove = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { chainId, library } = useWeb3React<Web3Provider>();

  const approve = async (address: string, amount: number, symbol?: string) => {
    try {
      setLoading(true);
      const totalSupply = await getTotalSupply(address, library, chainId);
      const approval = await approveToken(
        address,
        library,
        chainId,
        totalSupply.toString()
      );
      parseSuccess(`${amount} ${symbol && symbol} approved`);
    } catch (err) {
      if (err === undefined) return;
      toast.error("Opps, something went wrong!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    approve,
    loading,
  };
};
