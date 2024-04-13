import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { fromBigNumber } from "@/utils";
import { getTokenAllowance } from "@/helpers/contract";

export const useAllowance = (address: string, amount: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { account, chainId, library } = useWeb3React<Web3Provider>();
  const [allowance, setAllowance] = useState<string>("");
  const [toggle, setRefetch] = useState<boolean>(false);

  const getAllowance = async () => {
    if (!address || !account) return;
    const allowance = await getTokenAllowance(
      address,
      library,
      chainId,
      account
    );

    setAllowance(fromBigNumber(allowance.toString()));
    console.log(allowance.toString());

    // if (fromBigNumber(allowance.toString()) >= listing?.amount_in) {
    //   let status: any = Number(listing?.status) < 2 ? 2 : listing?.status;
    //   setStatus(status);
    // }
  };

  useEffect(() => {
    getAllowance();
  }, [address, account, toggle, amount]);

  const refetch = () => {
    setRefetch((prev) => !prev);
  };

  return { allowance, loading, refetch };
};
