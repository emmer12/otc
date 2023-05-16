import React from "react";
import { Flex, Text } from "..";
import styled, { css } from "styled-components";
import { toHumanReadable } from "@/utils/BigNumber";
import { toEther } from "@/helpers";

const Container = styled(Flex)`
  gap: 13px;
  margin: 15px 0px;
  cursor: pointer;
`;

const Avatar = styled.div`
  height: 37px;
  width: 37px;
  border-radius: 50%;
  background: #f4eeee;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 50%;
    height: 100%;
    width: 100%;
    /* width: 100%; */
  }
`;
const Details = styled.div``;
const Balance = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
`;

interface IToken {
  symbol: string;
  name?: string;
  icon?: string;
  address: string;
  balance?: any;
  decimal_place?: any;
  callback: (arg: string) => void;
}
{
  /* symbol == title  */
}
{
  /* name == fullTitle  */
}

const TokenCard = ({
  symbol,
  name,
  icon,
  address,
  balance,
  decimal_place,
  callback,
}: IToken) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      onClick={() => callback(address)}
    >
      <Container align="center">
        <Avatar>
          {icon ? (
            <img
              src={icon}
              onError={(e: any) => (e.target.src = "/no-token.png")}
              alt="Logo"
            />
          ) : (
            <img src={"/no-token.png"} alt="Logo" />
          )}
        </Avatar>
        <Details>
          <Text size="s1" weight="400" color="#170728">
            {symbol}
          </Text>
          <Text size="tiny" weight="400" color="#453953">
            {name}
          </Text>
        </Details>
      </Container>
      {balance && (
        <Balance>{Number(toEther(balance, decimal_place)).toFixed(2)}</Balance>
      )}
    </Flex>
  );
};

export default TokenCard;
