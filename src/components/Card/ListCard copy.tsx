import { ListContext, ListContextType } from "@/context/Listcontext";
// import { tokens } from "@/data";
import { TokenI } from "@/types";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  ActionBtn,
  Center,
  Divider,
  Flex,
  IconWrapper,
  Input,
  InputBox,
  InputCon,
  InputInner,
  Spacer,
  Text,
  TokenBadge,
} from "..";
import { Button } from "../Button";
import {
  Send,
  Swap,
  Add,
  ArrowRight,
  Settings as SettingsIcon,
  Settings2 as SettingsIcon2,
  ArrowDown,
} from "../Icons";
import { Connect as ConnectModal, Settings, TokenSelect } from "../Modal";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ConnectContext, ConnectContextType } from "@/context/ConnectContext";
import Toggle from "../Toggle";
import { parseError } from "@/utils";
import { getChainContract, getDefaultTokens, computeUsdPrice } from "@/helpers";
import { useGetWalletTokens } from "@/hooks/customHooks";
import TokenInputBox from "../TokenInputBox";

// import { hooks, metaMask } from "@/connector/metaMask";

const SwapContainer = styled.div`
  width: 416px;
  max-width: 100%;
  margin-bottom: 114px;
  margin: auto;
  position: relative;

  .header {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Body = styled.div`
  border: 1px solid #2e203e;
  padding: 40px 24px;
  border-radius: 12px;
  background: #ffffff;

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

const UsdVal = styled.span`
  overflow-wrap: anywhere;
  font-size: 12px;
  color: #acacac;
  position: absolute;
  bottom: -23px;
  left: 25px;
`;

const DurationInput = styled.div`
  flex: 1;
  input {
    /* background: #ffffff; */
    border: 1px solid rgb(23 7 40);
    border-radius: 20px;
    padding: 10px;
    outline: none;
  }
`;

const SwapSwitch = styled.div`
  display: flex;
  align-items: center;
  background: #f5f4f6;
`;

const SwitchItem = styled.div<{ label: string; type: string }>`
  position: relative;
  height: 63px;
  cursor: pointer;
  border-radius: 8px;
  text-transform: uppercase;
  font-size: 18px;
  z-index: 1;
  padding: 8px 8px;
  span {
    opacity: 0;
  }

  &:after {
    content: "${({ label }) => label}";
    height: 43px;
    position: relative;
    /* margin-top: -26px; */
    margin-top: -14px;

    z-index: -1;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 25px;
  }

  &.active {
    z-index: 1;
    color: #fff;
    position: relative;
    background: #fff;
    transform: translateY(10px);
    border-radius: 8px 8px 0px 0px;

    border: 1px solid #170728;
    border-bottom: 1px solid transparent;

    .shape_t,
    .shape_n1,
    .shape_n2 {
      position: absolute;
      bottom: 8px;
      right: -20px;
      height: 20px;
      width: 20px;
      background: #f5f4f6;
      border-bottom-left-radius: 8px;
      border-left: 1px solid #000;
      border-bottom: 1px solid #000;
      box-shadow: -3px 14px 0px 0px;
    }

    .shape_n1 {
      left: -20px;
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      border-left: transparent;
      border-bottom-right-radius: 8px;
      box-shadow: 5px 11px 0px 0px;
      border-bottom-left-radius: 0px;
    }

    &:after {
      background: #170728;
      margin-top: -26px;
    }
  }
`;

const ListCard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openS, setOpenS] = useState<boolean>(false);
  const [give, setGive] = useState<TokenI | undefined>(undefined);
  const [get, setGet] = useState<TokenI | undefined>(undefined);
  const [action, setAction] = useState<"giving" | "getting">("giving");
  const { setForm, form } = useContext(ListContext) as ListContextType;
  const [show, setShow] = useState<boolean>(false);
  const [listType, setListType] = useState<"Token" | "Nft">("Token");
  const [hasDeadline, setHasDeadline] = useState<boolean>(false);
  const { account, chainId, library } = useWeb3React<Web3Provider>();
  const { connect } = useContext(ConnectContext) as ConnectContextType;
  const w_tokens = useGetWalletTokens(account, chainId);
  const navigate = useNavigate();

  const handleSelect = (action: "giving" | "getting") => {
    setAction(action);
    setOpen(true);
  };

  const handleDChange = () => {
    setHasDeadline((prev) => !prev);
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

  const isValid = () => {
    return form.amount_in !== (0 || "") && form.amount_out !== (0 || "");
  };

  const getByAddress = (address: string) => {
    const tokens = getDefaultTokens(chainId);
    // return tokens && tokens.find((token: any) => token?.address === address);
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

  const handleChange = (e: any) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name == "amount_in" || "amount_out") {
      value = value.replace(/,/g, ".");
      const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group
      if (
        value === "" ||
        inputRegex.test(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      ) {
      } else {
        return;
      }
    }

    if (name == "deadline") {
      const date = new Date(value);
      const seconds = Math.floor(date.getTime() / 1000);
      value = seconds;
    }

    setForm((initialState: any) => ({
      ...initialState,
      [name]: value,
    }));
  };

  const handleContinue = () => {
    if (!get || !give) {
      parseError("Input field is required");
      return;
    }
    setForm((initialState: any) => ({
      ...initialState,
      token_in_metadata: get,
      token_out_metadata: give,
      receiving_wallet: account,
      signatory: account,
      forever: hasDeadline ? false : true,
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
      })
    );

    navigate("/list");
  };

  useEffect(() => {
    const tokens: any[] = getDefaultTokens(chainId);

    const dGive =
      tokens && tokens.find((token: any) => token.symbol === "WETH");
    const dGet =
      tokens && tokens.find((token: any) => token.symbol === "VetMe");

    setGive(dGive);
    setGet(dGet);
  }, [chainId]);

  return (
    <>
      <SwapContainer>
        <SwapSwitch>
          <SwitchItem
            label="Token"
            className={listType == "Token" ? "active" : ""}
            type={listType}
            onClick={() => setListType("Token")}
          >
            <span>Token</span>
            <div className="shape_t"></div>
          </SwitchItem>
          <SwitchItem
            label="Nft"
            type={listType}
            onClick={() => setListType("Nft")}
            className={listType == "Nft" ? "active" : ""}
          >
            <div className="shape_n1"></div> <span>Nft</span>
            <div className="shape_n2"></div>
          </SwitchItem>
        </SwapSwitch>
        <Body>
          <Flex style={{ position: "relative" }} direction="column" gap={8}>
            <TokenInputBox type="offer" />
            <SwapCon onClick={handleSwap}>
              <ArrowDown />
            </SwapCon>
            <TokenInputBox type="receive" />
          </Flex>
          <Flex>
            <Text as="div">
              1 VETME = 21 ETH <Text as="span">(~$203k)</Text>
            </Text>
            <Text as="div">
              Your price is <Text as="span">12% higher</Text>
            </Text>
          </Flex>

          <Spacer height={31} />

          <Flex align="center" justify="space-between">
            <div />
            <SwapCon onClick={handleSwap}>
              <Swap />
            </SwapCon>
            <div onClick={() => setOpenS(true)} style={{ cursor: "pointer" }}>
              <SettingsIcon2 />
            </div>
          </Flex>

          <Spacer height={6} />

          <InputCon>
            <InputBox>
              <label htmlFor="">You get</label>
              <InputInner>
                <Input
                  onChange={handleChange}
                  name="amount_in"
                  value={form.amount_in}
                  type="number"
                  step={0.1}
                  placeholder="0.0"
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  minLength={1}
                  maxLength={79}
                  spellCheck="false"
                />
                <AnimatePresence>
                  {get && form.amount_in > 0 && (
                    <UsdVal
                      key={form.amount_in}
                      as={motion.span}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    >
                      ~$
                      {get.usd
                        ? computeUsdPrice(get.usd, form.amount_in)
                        : "--"}
                    </UsdVal>
                  )}
                </AnimatePresence>
                <div>
                  <TokenBadge
                    token={get}
                    hasCaret={true}
                    handleClick={() => handleSelect("getting")}
                  />
                </div>
              </InputInner>
            </InputBox>
          </InputCon>
          <Spacer height={20} />

          <InputCon>
            <label htmlFor="">Time of Contract</label>
            <Flex align="center" style={{ height: "50px" }}>
              <DurationInput>
                {hasDeadline ? (
                  <input
                    type="datetime-local"
                    name="deadline"
                    onChange={handleChange}
                  />
                ) : (
                  <Text weight="700">Off (Set as Forever)</Text>
                )}
              </DurationInput>
              <Toggle
                checked={hasDeadline}
                onChange={handleDChange}
                offstyle="btn-off"
                onstyle="btn-on"
              />
            </Flex>
          </InputCon>
          <Spacer height={30} />

          {account ? (
            <Center>
              <ActionBtn
                size="56px"
                disabled={!isValid()}
                onClick={handleContinue}
              >
                Continue{" "}
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
      </SwapContainer>
      <TokenSelect
        handleSelected={(token: TokenI) => handleSelected(token)}
        show={open}
        handleClose={() => setOpen(false)}
        chainId={chainId}
        provider={account}
        w_tokens={w_tokens}
      />
      <Settings show={openS} handleClose={() => setOpenS(false)} />

      <ConnectModal
        show={show}
        connect={(connector) => {
          setShow(false);
          connect(connector);
        }}
        handleClose={() => setShow(false)}
      />
    </>
  );
};

export default ListCard;
