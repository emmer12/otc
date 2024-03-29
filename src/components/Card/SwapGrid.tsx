import { ListI } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { Flex, ImgWrap, Spacer, Text } from "..";
import { Chart, ListModal } from "../Modal";
import Progress from "../Progress";
import { anim, grid_item_trans } from "@/utils/transitions";
import { motion } from "framer-motion";

const common = css`
  position: absolute;
  color: #453953;
`;

const SwapContainer = styled.div`
  width: 540px;
  max-width: 100%;
  height: 234px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 24px;

  border: 1px solid #2e203e;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;

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
  position: relative;

  @media (max-width: 640px) {
    /* padding: 10px; */
  }
`;
const Details = styled.div``;
const ListType = styled.div`
  font-size: 12px;
  position: absolute;
  bottom: -4px;
  background: #170728;
  left: 50%;
  transform: translateX(-50%);
  padding: 0px 10px;
  border: 1px solid #170728;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: none;
  height: 20px;
  line-height: 20px;
  color: #fff;

  @media (max-width: 640px) {
    bottom: 0px;
  }
`;

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

    &.auth {
      right: 40px;
    }
  }
`;
const TopFLeft = styled.div`
  ${common};
  left: 95px;

  @media (max-width: 640px) {
    left: 40px;
    top: 5px;

    &.auth {
      left: 40px;
    }
  }
`;
const BottomFLeft = styled.div`
  ${common};
  right: 80px;
  top: 0px;

  @media (max-width: 640px) {
    right: 51px;
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

const TokenLogoWrap = styled.div`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  border: 1px solid #170728;
  display: grid;
  place-content: center;

  img {
    height: 24px;
    width: 24px;
    object-fit: cover;
  }
`;

const FillType = styled.div`
  padding: 8px;
  border-radius: 4px;
  background: #eff1ea;
  font-size: 12px;
  color: #000;
  align-self: start;
  line-height: 19px;
  text-transform: uppercase;
`;

const SwapGrid = ({
  list,
  state,
  account,
  confirmFriction,
  handleRemove,
}: {
  list: ListI;
  state: "auth" | "guest";
  account?: string | null;
  confirmFriction: (list: ListI) => void;
  handleRemove?: (list: ListI) => void;
}) => {
  const [token, setToken] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setEditOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  function translateY(
    arg0: number
  ): import("csstype").Property.Transform | undefined {
    throw new Error("Function not implemented.");
  }

  const handleChart = (token: any) => {
    setOpen(true);
    setToken(token);
  };

  const handleTrade = (list: ListI) => {
    confirmFriction(list);
  };

  return (
    <>
      <SwapContainer
        as={motion.div}
        {...anim(grid_item_trans)}
        className={state == "auth" ? "auth" : "guest"}
      >
        <Flex justify="space-between">
          <Flex align="center" gap={10}>
            <TokenLogoWrap>
              <img
                onError={(e: any) => (e.target.src = "/no-token.png")}
                src={list.token_out_metadata.icon || "/no-token.png"}
                alt="Logo"
              />
            </TokenLogoWrap>
            <Text color="#000" size="big" weight="500">
              {list.token_out_metadata.symbol}
            </Text>
          </Flex>

          <FillType>
            {list.is_friction ? "Partial Fill" : "Fixed Fill"}
          </FillType>
        </Flex>

        <Body>
          <Flex align="center" justify="space-between">
            <Text weight="400" size="s3" color="#8B8394">
              Offer
            </Text>

            <Text weight="400" size="s3" color="#8B8394">
              For
            </Text>
          </Flex>
          <Spacer height={4} />
          <Flex align="center" justify="space-between">
            <Flex gap={4} align="center">
              <Flex gap={4}>
                <Text
                  style={{ whiteSpace: "nowrap" }}
                  size="big"
                  weight="500"
                  color=" #000000"
                >
                  {" "}
                  {Number(list.amount_out).toFixed(2)}
                </Text>
                <Text
                  style={{ lineHeight: "20.31px", alignSelf: "flex-end" }}
                  as="span"
                  size="tiny"
                >
                  {" "}
                  {list.token_out_metadata?.symbol}
                </Text>
              </Flex>
              <ImgWrap height={16} width={16}>
                <img
                  onError={(e: any) => (e.target.src = "/no-token.png")}
                  src={list.token_out_metadata.icon || "/no-token.png"}
                  alt="Logo"
                />
              </ImgWrap>
            </Flex>

            <Flex gap={4} align="center">
              <Flex gap={4}>
                <Text
                  style={{ whiteSpace: "nowrap" }}
                  size="big"
                  weight="500"
                  color=" #000000"
                >
                  {" "}
                  {Number(list.amount_in).toFixed(2)}
                </Text>
                <Text
                  style={{ lineHeight: "20.31px", alignSelf: "flex-end" }}
                  as="span"
                  size="tiny"
                >
                  {" "}
                  {list.token_in_metadata?.symbol}
                </Text>
              </Flex>
              <ImgWrap height={16} width={16}>
                <img
                  onError={(e: any) => (e.target.src = "/no-token.png")}
                  src={list.token_in_metadata.icon || "/no-token.png"}
                  alt="Logo"
                />
              </ImgWrap>
            </Flex>
          </Flex>
          <Spacer height={2} />
          <Flex align="center" justify="space-between">
            {" "}
            <Flex gap={4}>
              <Text weight="400" size="s3" color="#8B8394">
                $0.034/Token
              </Text>
              <Text weight="400" size="s3" color="#8B8394">
                (~$203k)
              </Text>
            </Flex>
            <Text weight="400" size="s3" color="#8B8394">
              $203
            </Text>
          </Flex>
        </Body>
        <Progress value={40} />
      </SwapContainer>
      {token && (
        <Chart show={open} handleClose={() => setOpen(false)} token={token} />
      )}

      {openEdit && (
        <ListModal
          show={openEdit}
          handleClose={() => setEditOpen(false)}
          list={list}
        />
      )}
    </>
  );
};

export default SwapGrid;
