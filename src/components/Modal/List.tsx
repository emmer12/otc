import { useNavigate } from "react-router-dom";
import { ListCard } from "../Card";
import { useContext, useState } from "react";
import BigNumber from "bignumber.js";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import TokenInputBox from "../TokenInputBox";
import { ActionBtn, Center, Flex, Spacer, Text } from "..";
import styled from "styled-components";
import apiHelper from "@/helpers/apiHelper";
import { listSign, parseError, parseSuccess } from "@/utils";
import { ArrowDown } from "../Icons";
import Toggle from "../Toggle";
import { ListContext, ListContextType } from "@/context/Listcontext";
import { TokenI } from "@/types";
import { Connect as ConnectModal, TokenSelect } from "../Modal";
import { ConnectContext, ConnectContextType } from "@/context/ConnectContext";
import { useGetWalletTokens } from "@/hooks/customHooks";
import { AnimatePresence, motion } from "framer-motion";
import { DashBg, SwapBg } from "../bgs";
import { anim, slideInUp } from "@/utils/transitions";

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  z-index: 999999;
  background: rgba(23, 7, 40, 0.6);
`;

const Close = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  right: 0px;
  top: 0px;
  background: #170728;
  border: 1px solid #453953;
  border-radius: 12px;
  display: grid;
  place-content: center;
  cursor: pointer;

  @media (max-width: 640px) {
    width: 50px;
    height: 50px;
    top: -3px;
    right: 5px;
  }
`;

const Inner = styled.div`
  width: 418px;
  position: absolute;
  left: 50%;
  top: 100px;
  transform: translate(-50%);
  z-index: 999;
`;

const Body = styled.div`
  padding: 80px 24px;
  border-radius: 12px;
  position: relative;
  z-index: 3;

  @media (max-width: 640px) {
    /* padding: 20px 25px; */
  }
`;

const SwapCon = styled.div`
  border: 1px solid #170728;
  background: #befecd;
  border-radius: 8px;
  cursor: pointer;
  height: 32px;
  width: 32px;
  display: grid;
  place-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

interface IListEdit {
  handleClose: () => void;
  showM: boolean;
  list: any;
}

const ListModal = ({ showM, handleClose, list }: IListEdit) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { setForm, form } = useContext(ListContext) as ListContextType;
  const [hasDeadline, setHasDeadline] = useState<boolean>(false);
  const [isFriction, setFriction] = useState<boolean>(list.is_friction);
  const [isPrivate, setVisibility] = useState<boolean>(list.is_private);
  const { account, chainId, library } = useWeb3React<Web3Provider>();
  const { connect } = useContext(ConnectContext) as ConnectContextType;
  const w_tokens = useGetWalletTokens(account, chainId);
  const [give, setGive] = useState<TokenI | undefined>(list.token_out_metadata);
  const [get, setGet] = useState<TokenI | undefined>(list.token_in_metadata);
  const [show, setShow] = useState<boolean>(false);
  const [action, setAction] = useState<"giving" | "getting">("giving");

  const handleChange = (e: any) => {
    setForm((prev: any) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSelect = (action: "giving" | "getting") => {
    setAction(action);
    setOpen(true);
  };

  const handleUpdate = async () => {
    let data: any = form;

    let signatureData = {
      signatory: account,
      receivingWallet: list.receiving_wallet,
      tokenIn: list.token_in,
      tokenOut: list.token_out,
      amountOut: new BigNumber(list.amount_out)
        .shiftedBy(list.token_out_metadata.decimal_place)
        .toString(),
      amountIn: new BigNumber(list.amount_in)
        .shiftedBy(list.token_in_metadata.decimal_place)
        .toString(),
      deadline: list.deadline,
      nonce: list.nonce,
    };

    const signer = library?.getSigner();
    const { signature } = await listSign(signer, signatureData, list.chain);
    data.signature = signature;
    data.id = list._id;

    try {
      await apiHelper.updateList(data);

      list.amount_in = data.amount_in;
      list.amount_out = data.amount_out;
      parseSuccess("List updated");
      handleClose();
    } catch (error) {
      parseError(error || "Unable to update, please try again");
    }
  };

  const handleContinue = () => {
    if (!get || !give) {
      parseError("Input field is required");
      return;
    }
    setForm((initialState: any) => ({
      ...initialState,
      token_in_metadata: {
        ...form.token_in_metadata,
        ...get,
      },
      token_out_metadata: {
        ...form.token_out_metadata,
        ...give,
      },
      receiving_wallet: account,
      signatory: account,
      forever: hasDeadline ? false : true,
      is_friction: isFriction,
      is_private: isPrivate,
    }));

    localStorage.setItem(
      "list_data",
      JSON.stringify({
        ...form,
        token_in_metadata: get,
        token_out_metadata: give,
        receiving_wallet: account,
        signatory: account,
        forever: hasDeadline ? false : true,
        is_friction: isFriction,
        is_private: isPrivate,
      })
    );

    navigate("/list?id=" + list._id);
  };

  const isValid = () => {
    return form.amount_in !== (0 || "") && form.amount_out !== (0 || "");
  };

  const setMax = (balance: number) => {
    setForm((initialState: any) => ({
      ...initialState,
      amount_out: balance,
    }));
  };

  const handleSelected = (token: TokenI) => {
    setOpen(false);
    if (action == "getting") {
      setGet(token);
    }
    if (action == "giving") {
      setGive(token);
    }
  };

  const handleSwap = () => {
    setForm((init: any) => {
      return {
        ...init,
        amount_in: init.amount_out,
        amount_out: init.amount_in,
      };
    });
    setGive(get);
    setGet(give);
  };

  const handleDChange = () => {
    setHasDeadline((prev) => !prev);
  };

  return (
    <AnimatePresence>
      <Container>
        <motion.div {...anim(slideInUp)}>
          <Inner>
            <Body>
              <Close onClick={handleClose}>
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.79355 9.4998L2.42959 3.13584L3.1367 2.42873L9.50066 8.79269L15.8644 2.42893L16.5715 3.13604L10.2078 9.4998L16.5717 15.8638L15.8646 16.5709L9.50066 10.2069L3.1365 16.5711L2.42939 15.864L8.79355 9.4998Z"
                    fill="white"
                  />
                </svg>
              </Close>
              <Flex style={{ position: "relative" }} direction="column" gap={8}>
                <TokenInputBox
                  type="offer"
                  handleClick={() => handleSelect("giving")}
                  data={give}
                  onChange={(e) => handleChange(e)}
                  input_val={form.amount_out}
                  setMax={setMax}
                />
                <SwapCon onClick={handleSwap}>
                  <ArrowDown />
                </SwapCon>
                <TokenInputBox
                  type="receive"
                  handleClick={() => handleSelect("getting")}
                  data={get}
                  onChange={(e) => handleChange(e)}
                  input_val={form.amount_in}
                  setMax={() => null}
                />
              </Flex>
              <Spacer height={6} />

              <Spacer height={28} />
              <Flex direction="column" gap={12} style={{ width: "100%" }}>
                <Flex
                  align="center"
                  justify="space-between"
                  style={{ width: "100%" }}
                >
                  <Text weight="500" size="s3">
                    Set Duration
                  </Text>
                  <Toggle
                    checked={hasDeadline}
                    onChange={handleDChange}
                    offstyle="btn-off"
                    onstyle="btn-on"
                  />
                </Flex>

                {hasDeadline && (
                  <input
                    type="datetime-local"
                    name="deadline"
                    className="date_time"
                    onChange={handleChange}
                  />
                )}

                <Flex
                  align="center"
                  justify="space-between"
                  style={{ width: "100%" }}
                >
                  <Text weight="500" size="s3">
                    Crowd fill
                  </Text>
                  <Toggle
                    checked={isFriction}
                    onChange={() => setFriction((prev) => !prev)}
                    offstyle="btn-off"
                    onstyle="btn-on"
                  />
                </Flex>

                <Flex
                  align="center"
                  justify="space-between"
                  style={{ width: "100%" }}
                >
                  <Text weight="500" size="s3">
                    Private List
                  </Text>
                  <Toggle
                    checked={isPrivate}
                    onChange={() => {
                      setVisibility((prev) => !prev);
                    }}
                    offstyle="btn-off"
                    onstyle="btn-on"
                  />
                </Flex>
              </Flex>

              <Spacer height={64} />

              {account ? (
                <Center>
                  <ActionBtn
                    size="56px"
                    disabled={!isValid()}
                    onClick={handleContinue}
                  >
                    Continue {/* disabled={!isValid()} */}
                  </ActionBtn>
                </Center>
              ) : (
                <ActionBtn
                  size="56px"
                  disabled={!isValid()}
                  onClick={() => setShow(true)}
                >
                  Connect Your wallet
                </ActionBtn>
              )}
            </Body>

            <SwapBg />
          </Inner>
        </motion.div>
        <TokenSelect
          handleSelected={(token: TokenI) => handleSelected(token)}
          show={open}
          handleClose={() => setOpen(false)}
          chainId={chainId}
          provider={account}
          w_tokens={w_tokens}
        />

        <ConnectModal
          show={show}
          connect={(connector) => {
            setShow(false);
            connect(connector);
          }}
          handleClose={() => setShow(false)}
        />
      </Container>
    </AnimatePresence>
  );
};

export default ListModal;
