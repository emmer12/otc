import { ListI } from "@/types";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { Flex, ImgWrap, Spacer, Text } from "..";
import { Chart, ListModal } from "../Modal";
import Progress from "../Progress";
import { anim, grid_item_trans } from "@/utils/transitions";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { loader } from "@/components/styles";
import { computeUsdPrice, getPercentage } from "@/helpers";
import { Button } from "../Button";
import { ListContext, ListContextType } from "@/context/Listcontext";

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
    height: auto;
    /* background-image: url(/images/bg/c3.png); */
  }

  @media (max-width: 640px) {
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

const Body = styled.div`
  position: relative;

  @media (max-width: 640px) {
    /* padding: 10px; */
  }
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
  handleRemove: (list: ListI) => void;
}) => {
  const [token, setToken] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setEditOpen] = useState<boolean>(false);
  const { setForm, form } = useContext(ListContext) as ListContextType;

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

  const setFormList = (list: ListI) => {
    setForm({
      receiving_wallet: list.receiving_wallet,
      signatory: list.signatory,
      token_in: list.token_in,
      token_out: list.token_out,
      amount_in: list.amount_in,
      amount_out: list.amount_out,
      is_private: list.is_private,
      deadline: list.deadline,
      token_in_metadata: list.token_in_metadata,
      token_out_metadata: list.token_out_metadata,
      nonce: list.nonce,
      is_active: list.is_active,
      forever: list.forever,
      is_friction: list.is_friction,
    });
  };

  return (
    <>
      <SwapContainer
        as={motion.div}
        {...anim(grid_item_trans)}
        className={state == "auth" ? "auth" : "guest"}
        onClick={() => navigate(`/list/${list._id}`)}
      >
        <Flex justify="space-between">
          <Flex align="center" gap={10}>
            {list ? (
              <TokenLogoWrap>
                <img
                  onError={(e: any) => (e.target.src = "/no-token.png")}
                  src={list.token_out_metadata.icon || "/no-token.png"}
                  alt="Logo"
                />
              </TokenLogoWrap>
            ) : (
              <Skeleton style={loader.avatar} />
            )}
            <Text color="#000" size="big" weight="500">
              {list?.token_out_metadata?.symbol || (
                <Skeleton style={loader.a_title} />
              )}
            </Text>
          </Flex>

          {list ? (
            <FillType>
              {list?.is_friction ? "Partial Fill" : "Fixed Fill"}
            </FillType>
          ) : (
            <Skeleton style={loader.btn} />
          )}
        </Flex>

        <Body>
          <Flex align="center" justify="space-between">
            {list ? (
              <>
                <Text weight="400" size="s3" color="#8B8394">
                  Offer
                </Text>

                <Text weight="400" size="s3" color="#8B8394">
                  For
                </Text>
              </>
            ) : (
              <>
                <Skeleton style={loader.hText} />
                <Skeleton style={loader.hText} />
              </>
            )}
          </Flex>
          <Spacer height={4} />
          <Flex align="center" justify="space-between">
            {list ? (
              <>
                <Flex gap={4} align="center">
                  <Flex gap={4}>
                    <Text
                      style={{ whiteSpace: "nowrap" }}
                      size="big"
                      weight="500"
                      color=" #000000"
                    >
                      {" "}
                      {Number(list?.amount_out).toFixed(2) || (
                        <Skeleton style={loader.hText2} />
                      )}
                    </Text>
                    <Text
                      style={{ lineHeight: "20.31px", alignSelf: "flex-end" }}
                      as="span"
                      size="tiny"
                    >
                      {" "}
                      {list?.token_out_metadata?.symbol}
                    </Text>
                  </Flex>
                  <ImgWrap height={16} width={16}>
                    <img
                      onError={(e: any) => (e.target.src = "/no-token.png")}
                      src={list?.token_out_metadata.icon || "/no-token.png"}
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
                      {Number(list?.amount_in).toFixed(2) || <Skeleton />}
                    </Text>
                    <Text
                      style={{ lineHeight: "20.31px", alignSelf: "flex-end" }}
                      as="span"
                      size="tiny"
                    >
                      {" "}
                      {list?.token_in_metadata?.symbol || <Skeleton />}
                    </Text>
                  </Flex>
                  {list ? (
                    <ImgWrap height={16} width={16}>
                      <img
                        onError={(e: any) => (e.target.src = "/no-token.png")}
                        src={list.token_in_metadata.icon || "/no-token.png"}
                        alt="Logo"
                      />
                    </ImgWrap>
                  ) : (
                    <Skeleton />
                  )}
                </Flex>
              </>
            ) : (
              <>
                <Skeleton style={loader.hText2} />
                <Skeleton style={loader.hText2} />
              </>
            )}
          </Flex>
          <Spacer height={2} />
          <Flex align="center" justify="space-between">
            {" "}
            {list ? (
              <>
                <Flex gap={4}>
                  <Text weight="400" size="s3" color="#8B8394">
                    $
                    {list?.token_out_metadata.usd
                      ? list?.token_out_metadata?.usd.toLocaleString("en-US")
                      : "--"}
                    /Token
                  </Text>
                  <Text weight="400" size="s3" color="#8B8394">
                    (~$
                    {list?.token_out_metadata.usd
                      ? computeUsdPrice(
                          list?.token_out_metadata.usd,
                          list.amount_out
                        )
                      : "--"}
                    )
                  </Text>
                </Flex>
                <Text weight="400" size="s3" color="#8B8394">
                  $
                  {list?.token_in_metadata.usd
                    ? computeUsdPrice(
                        list?.token_in_metadata.usd,
                        list.amount_out
                      )
                    : "--"}
                </Text>
              </>
            ) : (
              <>
                {" "}
                <Skeleton style={loader.hText3} />
                <Skeleton style={loader.hText} />
              </>
            )}
          </Flex>
        </Body>
        <div>
          {list ? (
            <Progress
              value={getPercentage(list.amount_out, list.amount_bought)}
            />
          ) : (
            <div style={{ marginTop: "-24px" }}>
              <Skeleton style={loader.progress} />
              <Skeleton style={{ width: "50px", height: "20px" }} />
            </div>
          )}
          {state == "auth" && (
            <>
              <Spacer height={24} />
              <Flex gap={8}>
                {Number(list?.status) < 3 && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormList(list);
                      setEditOpen(true);
                    }}
                    className="secondary lg"
                  >
                    Edit Trade
                  </Button>
                )}

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(list);
                  }}
                  className="error lg"
                >
                  Close Trade
                </Button>
              </Flex>
            </>
          )}
        </div>
      </SwapContainer>
      {token && (
        <Chart show={open} handleClose={() => setOpen(false)} token={token} />
      )}

      {openEdit && (
        <ListModal
          showM={openEdit}
          handleClose={() => setEditOpen(false)}
          list={list}
        />
      )}
    </>
  );
};

export default SwapGrid;
