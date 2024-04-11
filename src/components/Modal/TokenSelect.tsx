import { useState } from "react";
import styled from "styled-components";
import { Flex, Spacer, Text } from "..";
import { LSearch } from "../Icons";
import TokenCard from "./TokenCard";
import { TokenI } from "@/types";
import { InputWrapper } from "@/views/home/styles";
import { useTokenFetch } from "@/hooks/customHooks";
import { getBlockName } from "@/helpers";
import axios from "axios";
import { TokenSelectBg } from "../bgs";
import { AnimatePresence, motion } from "framer-motion";
import { anim, fadeIn, slideInUp } from "@/utils/transitions";

const SwapContainer = styled.div`
  width: 418px;
  max-width: 100%;
  margin-bottom: 114px;
  margin: auto;
  position: relative;
  top: 100px;
  position: relative;

  .header {
    position: absolute;
    left: 50px;
  }
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
  z-index: 1;

  @media (max-width: 640px) {
    width: 50px;
    height: 50px;
    top: -3px;
    right: 5px;
  }
`;

const Body = styled.div`
  padding: 16px 25px;
  z-index: 1;
  position: relative;
`;
const InputCon = styled.div`
  label {
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    color: #848892;
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  z-index: 99999;
  background: rgba(23, 7, 40, 0.6);
`;

const ResultCon = styled.div`
  border-radius: 10px;
  max-height: 312px;
  overflow-y: auto;
  padding: 21px 16px;

  @media (max-width: 640px) {
    padding: 21px 16px;
  }
`;

const Msg = styled.div`
  padding: 10px;
`;

interface TokenSelect {
  handleClose: () => void;
  handleSelected: (arg: TokenI) => void;
  show: boolean;
  chainId: number | undefined;
  provider: any;
  w_tokens: any[];
}

const TokenSelect = ({
  show,
  handleClose,
  handleSelected,
  chainId,
  w_tokens,
}: TokenSelect) => {
  // const [tokens, setTokens] = useState(getD);
  const [sTokens, setSTokens] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const { loading, error, results } = useTokenFetch(query, chainId, w_tokens);

  const handleSearch = (e: any) => {
    const val = e.target.value;
    setQuery(val);
  };

  const callback = async (address: string) => {
    let token = results.find((token) => token.address === address);
    setQuery("");
    handleSelected(token);

    // setLocalToken(token);
  };

  console.log(results);

  return (
    <AnimatePresence>
      {show && (
        <ModalWrapper as={motion.div} {...anim(fadeIn)} onClick={handleClose}>
          <SwapContainer
            as={motion.div}
            {...anim(slideInUp)}
            onClick={(e) => e.stopPropagation()}
          >
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
            <Text
              className="header"
              color="#fff"
              weight="400"
              size="s3"
              uppercase
            >
              Select an asset
            </Text>
            <Spacer height={56} />
            <Body>
              <InputCon>
                <InputWrapper>
                  <LSearch />
                  <input
                    placeholder="Type a name or paste an address"
                    value={query}
                    type="text"
                    onChange={handleSearch}
                  />
                </InputWrapper>
              </InputCon>
              <Spacer height={27} />
              {results?.length ? (
                <ResultCon className="custom-scroll">
                  {results?.map((token: any, i: number) => (
                    <TokenCard {...token} key={i} callback={callback} />
                  ))}
                </ResultCon>
              ) : (
                <>
                  <Msg>
                    <Text>Not Found</Text>
                  </Msg>
                </>
              )}
            </Body>

            <TokenSelectBg
              style={{ position: "absolute", inset: 0, zIndex: 0 }}
            />
          </SwapContainer>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
};

export default TokenSelect;
