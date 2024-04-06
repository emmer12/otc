import { TokenI } from "@/types";
import React from "react";
import styled from "styled-components";
import { Spacer, Text } from ".";
import { AngleDown2, Caret, Chart, DropDown } from "./Icons";

const Container = styled.div`
  border-radius: 100px;
  display: flex;
  align-items: center;
  color: #170728;
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
          <Spacer width={4} />
          {hasCaret && (hasChart ? <Chart /> : <DropDown />)}
        </>
      ) : (
        <>
          <Text size="s3" weight="400">
            Select Token
          </Text>
          <Spacer width={4} />

          <AngleDown2 />
        </>
      )}
    </Container>
  );
};

export default TokenBadge;
