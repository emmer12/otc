import { truncate } from "@/helpers";
import apiHelper from "@/helpers/apiHelper";
import { ListI } from "@/types";
import {
  formatDateTime,
  formatSecTime,
  getForever,
  parseError,
  parseSuccess,
} from "@/utils";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { ActionBtn, Divider, Flex, Spacer, Text, TokenBadge } from "..";
import CustomButton from "../Button/CustomButton";
import { Delete, Send, Swap, VToken, VUser } from "../Icons";
import { Chart, Counter, ListModal } from "../Modal";

const common = css`
  position: absolute;
  color: #453953;
`;

const SwapContainer = styled.div`
  width: 540px;
  max-width: 100%;
  margin-bottom: 27px;
  height: 234px;

  background-image: url(/images/bg/c1.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100%;

  &.completed {
    filter: blur(0.8px);
    /* background: #13871345; */
  }

  &.auth {
    width: 520px;
    max-width: 100%;
    background-image: url(/images/bg/c3.png);
  }

  @media (max-width: 640px) {
    margin-bottom: 30px;
    margin-top: 10px;
    height: inherit;
    background-image: none;

    border: 1px solid #a19ba8;
    border-radius: 10px;
    &.auth {
      background-image: none;
      width: 100%;
      border: 1px solid #a19ba8;
      border-radius: 10px;
    }
  }
`;
const Header = styled.div`
  /* background: rgba(125, 169, 255, 0.47);
  padding: 17px 50px;
  border-radius: 20px 20px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between; */
  position: relative;

  @media (max-width: 640px) {
    padding: 17px 20px;
  }
`;
const Body = styled.div`
  @media (max-width: 640px) {
    /* padding: 10px; */
  }
`;
const Details = styled.div``;
const Actions = styled.div`
  width: 179px;
  height: 54px;
  display: flex;
  align-self: end;
`;

const Action2 = styled.div`
  width: 104px;
  height: 54px;
`;

const ActionIcon = styled.div`
  height: 54px;
  width: 54px;
`;

const TopFRight = styled.div`
  ${common};
  right: 85px;
  display: flex;
  align-items: center;
  gap: 8px;

  &.auth {
    right: 78px;
  }

  @media (max-width: 640px) {
    right: 40px;
    top: 5px;
  }
`;
const TopFLeft = styled.div`
  ${common};
  left: 90px;

  @media (max-width: 640px) {
    left: 40px;
    top: 5px;
  }
`;
const BottomFLeft = styled.div`
  ${common};
  right: 70px;
  top: 0px;

  @media (max-width: 640px) {
    right: 40px;
  }
`;

const DetailWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: url(/images/bg/c2.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% auto;
  padding: 18px;
  position: relative;
  gap: 10px;
`;

const DetailWrapperT = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 39px 18px 18px;
`;

const ActionWrapper = styled.button`
  background: #ffffff;
  border: 2px solid #7da9ff;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
`;

const Price = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 25px;
  top: -20px;
  position: relative;
`;

const CounterGrid = ({
  counter,
  state,
}: {
  counter: any;
  state: "auth" | "guest";
}) => {
  const [token, setToken] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setEditOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChart = (token: any) => {
    setOpen(true);
    setToken(token);
  };

  const handleTrade = (list: ListI) => {
    // confirmFriction(list);
  };

  const handleRemove = async (list: ListI) => {
    const confirm_it = confirm("Are you sure ?");
    if (!confirm_it) return;

    try {
      // await apiHelper.removeList({ id: list._id, account: account });
      parseSuccess("List Deleted");
    } catch (error) {
      parseError("Unable to delete");
    }
  };

  return (
    <>
      <SwapContainer className={state == "auth" ? "auth" : "guest"}>
        <Header>
          <TopFLeft>
            <Text size="s3" uppercase>
              {counter.list_id.token_out_metadata?.symbol}/
              {counter.list_id.token_in_metadata?.symbol}
            </Text>
          </TopFLeft>
        </Header>
        <Body>
          <DetailWrapperT>
            <Flex align="center">
              <TokenBadge
                token={counter.list_id.token_out_metadata}
                handleClick={() =>
                  handleChart(counter.list_id.token_out_metadata)
                }
              />
              <Spacer width={15} widthM={10} />
              <Text
                uppercase
                weight="400"
                sizeM="10px"
                size="s3"
                color="#453953"
              >
                Give
              </Text>
            </Flex>
            <Swap />
            <Flex align="center">
              <Text
                uppercase
                weight="400"
                size="s3"
                sizeM="10px"
                color="#453953"
              >
                Get
              </Text>
              <Spacer width={15} widthM={10} />
              <TokenBadge
                token={counter.list_id.token_in_metadata}
                handleClick={() =>
                  handleChart(counter.list_id.token_in_metadata)
                }
              />
            </Flex>
          </DetailWrapperT>
          <Price>
            <Text
              style={{ whiteSpace: "nowrap" }}
              uppercase
              size="s1"
              color=" #170728"
            >
              {Number(counter.amount_out).toFixed(2)} &nbsp;
              {counter.list_id.token_out_metadata?.symbol}
            </Text>

            <Text
              uppercase
              size="s1"
              color=" #170728"
              style={{ whiteSpace: "nowrap" }}
            >
              {Number(counter.amount_in).toFixed(2)} &nbsp;
              {counter.list_id.token_in_metadata?.symbol}
            </Text>
          </Price>

          <DetailWrapper>
            <Flex justify="space-between" gap={16} style={{ marginTop: 10,width: '100%' }}>
              <Details>
                <Text size="s3" color="#5D5169 " uppercase>
                  Published : {formatDateTime(counter.list_id.createdAt)}
                </Text>
                <Text size="s3" color="#5D5169" uppercase>
                  Expiry Time :{" "}
                  {counter.list_id.deadline == getForever
                    ? "Forever"
                    : formatSecTime(counter.list_id.deadline)}
                </Text>
              </Details>
              <Action2>
                <ActionBtn className="sm" onClick={() => setEditOpen(true)}>
                  Edit
                </ActionBtn>
              </Action2>
            </Flex>
          </DetailWrapper>
        </Body>
      </SwapContainer>
      {token && (
        <Chart show={open} handleClose={() => setOpen(false)} token={token} />
      )}

      {openEdit && (
        <ListModal
          show={openEdit}
          handleClose={() => setEditOpen(false)}
          list={counter.list_id}
        />
      )}
    </>
  );
};

export default CounterGrid;
