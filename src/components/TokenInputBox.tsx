import React, { useContext, useEffect, useState } from "react";
import { TokenInputBgUp, TokenInputBgDown } from "./bgs";
import styled from "styled-components";
import TokenBadge from "./TokenBadge";
import { Flex, Spacer, Text } from ".";
import { computeUsdPrice, getBlockName, truncate } from "@/helpers";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { selectionSetMatchesResult } from "@apollo/client/cache/inmemory/helpers";
import { ListContext, ListContextType } from "@/context/Listcontext";

const Container = styled.div`
  position: relative;
  height: 109px;
  padding: 12px 16px;
  width: 100%;
  .bg {
    position: absolute;
    inset: 0px;
    z-index: 0;
  }

  .inner {
    position: relative;
    z-index: 1;

    input {
      font-size: 20px;
      border: none;
      outline: none;
      width: 100px;
      text-align: end;
      font-weight: 500;
    }
  }

  .max-btn {
    border: 1px solid #170728;
    background: #befecd;
    padding: 4px;
    border-radius: 100px;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 12px;
  }
`;

type TokenProps = {
  type: "offer" | "receive";
  handleClick: () => void;
  onChange: (e: any) => void;
  data: any;
  input_val: string | number;
  setMax: (e: any) => void;
};

const TokenInputBox = ({
  type,
  handleClick,
  data,
  onChange,
  input_val,
  setMax,
}: TokenProps) => {
  const { chainId } = useWeb3React<Web3Provider>();
  const [token_usd, setTokenUsd] = useState(0);
  const { balance } = useWalletBalance(data?.address, data?.decimal_place);
  const { setForm } = useContext(ListContext) as ListContextType;

  const getTokenPrice = async (token: any) => {
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${getBlockName(
          chainId
        )}/contract/${token.address}`
      );

      const usdPrice = data?.market_data?.current_price?.usd;
      setTokenUsd(usdPrice);

      if (type == "offer") {
        setForm((init: any) => {
          return {
            ...init,
            token_out_metadata: {
              ...init.token_out_metadata,
              usd: usdPrice,
              id: data.id,
            },
          };
        });
      } else {
        setForm((init: any) => {
          return {
            ...init,
            token_in_metadata: {
              ...init.token_in_metadata,
              usd: usdPrice,
              id: data.id,
            },
          };
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (data) {
      getTokenPrice(data);
    }
  }, [data]);

  return (
    <Container>
      <div className="inner">
        <Text size="tiny" uppercase>
          {type == "offer" ? "Offer" : "to Receive"}
        </Text>
        <Flex justify="space-between">
          <div>
            <TokenBadge
              token={data}
              hasCaret={true}
              handleClick={handleClick}
            />
            <Flex align="center" gap={5}>
              <Text color="#746A7E" size="tiny">
                Bal: {truncate(String(balance), 9, "...", "end")} {data?.symbol}
              </Text>

              {type == "offer" && (
                <button
                  disabled={balance == 0}
                  onClick={() => setMax(balance)}
                  className="max-btn"
                >
                  Max
                </button>
              )}
            </Flex>
          </div>

          <Flex align="end" direction="column" gap={8}>
            <input
              onChange={onChange}
              value={input_val}
              name={type == "offer" ? "amount_out" : "amount_in"}
              type="number"
              step={0.1}
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              pattern="^[0-9]*[.,]?[0-9]*$"
              minLength={1}
              maxLength={79}
              spellCheck="false"
              placeholder="0.00"
            />
            <AnimatePresence>
              {input_val && (
                <Text
                  color="#746A7E"
                  size="tiny"
                  as={motion.span}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  $ {computeUsdPrice(token_usd, input_val as number)}
                </Text>
              )}
            </AnimatePresence>
          </Flex>
        </Flex>
      </div>

      {/*  BG Shape */}

      {type == "offer" ? (
        <TokenInputBgUp className="bg" />
      ) : (
        <TokenInputBgDown className="bg" />
      )}
    </Container>
  );
};

export default TokenInputBox;
