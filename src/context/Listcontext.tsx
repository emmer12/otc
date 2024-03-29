// context/todoContext.tsx
import { ListI } from "@/types";
import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {
  getTradeLink,
  listSign,
  parseError,
  parseSuccess,
  getForever,
} from "@/utils";
import BigNumber from "bignumber.js";
import { List } from "@/views";
import { BASE_URL } from "@/helpers/apiHelper";

export type ListContextType = {
  saveList: () => void;
  clearLocal: () => void;
  form: ListI;
  setForm: any;
  loading: boolean;
  privateLink: string;
};

export const ListContext = React.createContext<ListContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

const initList: ListI = {
  receiving_wallet: "",
  signatory: "",
  token_in: "",
  token_out: "",
  signature: "",
  amount_in: "",
  amount_out: "",
  is_private: false,
  deadline: 0,
  token_in_metadata: null,
  token_out_metadata: null,
  nonce: 0,
  is_active: false,
  forever: true,
  is_friction: false,
};

const ListProvider: React.FC<Props> = ({ children }) => {
  const list_data = JSON.parse(localStorage.getItem("list_data") as string);
  const [form, setForm] = React.useState<ListI>(list_data || initList);
  const [privateLink, setPrivateLink] = React.useState<string>("");
  const { chainId, library } = useWeb3React<Web3Provider>();

  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const saveList = async () => {
    try {
      setLoading(true);
      let data = { ...form };

      data.token_in = data.token_in_metadata.address;
      data.token_out = data.token_out_metadata.address;
      data.deadline = data.forever ? getForever : data.deadline;
      let signatureData = {
        signatory: form.signatory,
        receivingWallet: form.receiving_wallet,
        tokenIn: data.token_in,
        tokenOut: data.token_out,
        amountOut: new BigNumber(data.amount_out)
          .shiftedBy(data.token_out_metadata.decimal_place)
          .toString(),
        amountIn: new BigNumber(data.amount_in)
          .shiftedBy(data.token_in_metadata.decimal_place)
          .toString(),
        deadline: data.deadline,
        nonce: form.nonce,
      };
      const signer = library?.getSigner();
      const { signature } = await listSign(signer, signatureData, chainId);
      data.signature = signature;
      data.chain = chainId;
      //   data.signature = "signature";
      const {
        data: { list },
      } = await axios.post(`${BASE_URL}/lists`, data);
      if (list.is_private) {
        const link = getTradeLink(list._id);
        setPrivateLink(link);
      } else {
        setLoading(false);
        setForm(list);
        clearLocal();
        // navigate("/");
      }
      parseSuccess("Your Token has been Listed");
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      if (error.message.includes("user rejected signing")) {
        return Promise.reject(error);
      }
      parseError(error);
      return Promise.reject(error);
    }
  };

  const clearLocal = () => {
    localStorage.removeItem("list_data");
    setPrivateLink("");
    // setForm(initList);
  };

  return (
    <ListContext.Provider
      value={{ form, setForm, saveList, loading, clearLocal, privateLink }}
    >
      {children}
    </ListContext.Provider>
  );
};

export default ListProvider;
