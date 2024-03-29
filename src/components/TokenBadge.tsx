import { TokenI } from "@/types";
import React from "react";
import styled from "styled-components";
import { Spacer, Text } from ".";
import { Caret, Chart, DropDown } from "./Icons";

const Container = styled.div`
  background: #170728;
  border-radius: 100px;
  display: flex;
  align-items: center;
  padding: 6px 9px;
  color: #fff;
  cursor: pointer;
  height: 32px;
`;
const ImgWrap = styled.div`
  height: 20px;
  width: 20px;
  background: #f6f6f7;
  flex-shrink: 0;
  border-radius: 50%;

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    object-fit: contain;
  }
`;

interface BadgeI {
  token: TokenI | undefined;
  icon?: string;
  hasCaret?: boolean;
  hasChart?: boolean;
  handleClick: () => void;
}

const TokenBadge = ({
  token,
  hasCaret = true,
  handleClick,
  hasChart = false,
}: BadgeI) => {
  return (
    <Container onClick={() => handleClick()}>
      {token ? (
        <>
          <ImgWrap>
            <img
              onError={(e: any) => (e.target.src = "/no-token.png")}
              src={token.icon || "/no-token.png"}
              alt="Logo"
            />
          </ImgWrap>
          <Spacer width={6} />
          <Text size="s2" weight="400">
            {token.symbol}
          </Text>
          <Spacer width={6} />
          {hasCaret && (hasChart ? <Chart /> : <DropDown />)}
        </>
      ) : (
        <>
          <Text size="s2" weight="400">
            Select Token
          </Text>
          <Spacer width={6} />

          <DropDown />
        </>
      )}
    </Container>
  );
};

export default TokenBadge;
