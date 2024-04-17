import { ContainerSm, Flex } from "@/components";
import { ListCard, SwapGrid, MobileList } from "@/components/Card";
import { FilterHome, Linear, ListGrid, LSearch } from "@/components/Icons";
import { useState } from "react";
import CustomButton from "@/components/Button/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";

import {
  Wrapper,
  HomeHeader,
  LayoutSwitch,
  SearchContainer,
  SwitchItem,
  InputWrapper,
  LeftSide,
  HomeBody,
  GridWrapper,
  ListWrapper,
  ListHeader,
  HeaderItem,
  ListBody,
  ListRow,
  ListCol,
  List as ListCon,
  Swap,
  Switch,
  SItem,
  FItem,
} from "./styles";
import { useListFetch } from "@/hooks/customHooks";
import { truncate } from "@/helpers";
import { formatDateTime, formatSecTime, getForever } from "@/utils";
import { Counter, CounterOffer, Message } from "@/components/Modal";
import { ListI } from "@/types";
import Empty from "@/components/Empty";
import { anim, grid_trans } from "@/utils/transitions";
import VolumeSection from "@/components/sections/VolumnSection";

const HomePage = () => {
  const [display, setDisplay] = useState<"grid" | "list">("grid");
  const [mode, setMode] = useState<"list" | "swap">("swap");
  const [open, setOpen] = useState<boolean>(false);
  let { chain } = useParams();
  const savedChainId = JSON.parse(localStorage.getItem("chain") as string);
  const { loading, data, setQuery, query, volume } = useListFetch(
    chain || savedChainId
  );

  const navigate = useNavigate();
  const [openC, setOpenC] = useState<boolean>(false);
  const [openO, setOpenO] = useState<boolean>(false);
  const [counterList, setCounterList] = useState<any>(null);

  const onChangeHandler = async (e: any) => {
    setQuery(e.target.value);
  };

  const handleFriction = (list: ListI) => {
    setOpenC(true);
    setCounterList(list);
  };

  const handleAccept = () => {
    navigate(`/trades/${counterList._id}`);
  };
  const handleCounter = () => {
    setOpenC(false);
    setOpenO(true);
  };

  // getDailyVolume(); //change test

  return (
    <ContainerSm>
      <Wrapper>
        <HomeHeader>
          <div style={{ flex: 1 }}>
            <Switch>
              <SItem onClick={() => navigate("/")} className="active">
                Tokens
              </SItem>
              <SItem onClick={() => navigate("/nfts")}>Nfts</SItem>
            </Switch>
          </div>

          <Flex align="center" gap={12}>
            <SearchContainer className={classNames({ hidden: mode == "list" })}>
              <InputWrapper>
                <LSearch />
                <input
                  placeholder="SEARCH"
                  value={query}
                  onChange={(e) => onChangeHandler(e)}
                />
              </InputWrapper>
            </SearchContainer>

            <FItem>
              <FilterHome />
            </FItem>

            <LeftSide>
              <Button
                onClick={() => navigate(`/list/create`)}
                className="secondary lg"
              >
                Create OTC Offer
              </Button>
            </LeftSide>
          </Flex>
        </HomeHeader>
        <HomeBody>
          {mode == "swap" ? (
            <Swap>
              {display === "grid" ? (
                <>
                  {loading ? (
                    <GridWrapper as={motion.div} {...anim(grid_trans)}>
                      {Array(6)
                        .fill("")
                        .map((list: any, i: number) => (
                          <SwapGrid
                            confirmFriction={(list) => handleFriction(list)}
                            list={list}
                            key={i}
                            state="guest"
                            handleRemove={() => null}
                          />
                        ))}
                    </GridWrapper>
                  ) : data.length < 1 ? (
                    <Empty />
                  ) : (
                    <GridWrapper as={motion.div} {...anim(grid_trans)}>
                      {data.map((list: any, i: number) => (
                        <SwapGrid
                          confirmFriction={(list) => handleFriction(list)}
                          list={list}
                          key={i}
                          state="guest"
                          handleRemove={() => null}
                        />
                      ))}
                    </GridWrapper>
                  )}
                </>
              ) : (
                <>
                  <ListWrapper className="desktop">
                    <ListHeader>
                      <HeaderItem>Wallet ID</HeaderItem>
                      <HeaderItem>Published </HeaderItem>
                      <HeaderItem>Expiry Time </HeaderItem>
                      <HeaderItem>Escrow Fee</HeaderItem>
                      <HeaderItem>Give</HeaderItem>
                      <HeaderItem>Get</HeaderItem>
                      <HeaderItem>Action</HeaderItem>
                    </ListHeader>
                    <ListBody>
                      {loading ? (
                        <span>loading...</span>
                      ) : (
                        data.map((list: any, i: number) => (
                          <ListRow key={i + "grid"}>
                            <ListCol>
                              {truncate(list.receiving_wallet, 9, "***")}
                            </ListCol>
                            <ListCol>{formatDateTime(list.createdAt)}</ListCol>
                            <ListCol>
                              {list.deadline == getForever
                                ? "Forever"
                                : formatSecTime(list.deadline)}
                            </ListCol>
                            <ListCol>3%</ListCol>
                            <ListCol>
                              {Number(list.amount_out).toFixed(2)} &nbsp;
                              {list.token_out_metadata?.symbol}
                            </ListCol>
                            <ListCol>
                              {Number(list.amount_in).toFixed(2)} &nbsp;
                              {list.token_in_metadata?.symbol}
                            </ListCol>
                            <ListCol>
                              <CustomButton
                                onClick={() => navigate(`trades/${list._id}`)}
                                text="Trade"
                                classNames="primary"
                              />
                            </ListCol>
                          </ListRow>
                        ))
                      )}
                    </ListBody>
                  </ListWrapper>
                  <ListWrapper className="mobile">
                    <GridWrapper>
                      {loading ? (
                        <span>loading...</span>
                      ) : (
                        data?.map((list: any, i: number) => (
                          <MobileList list={list} key={i + "mlist"} />
                        ))
                      )}
                    </GridWrapper>
                  </ListWrapper>
                </>
              )}
            </Swap>
          ) : (
            <ListCon>
              <ListCard />
            </ListCon>
          )}
        </HomeBody>
        <Message
          type="ld"
          show={open}
          handleClose={() => setOpen(false)}
          msg="Claim Free Test tokens to trade on the platform"
        />

        <Counter
          show={openC}
          handleClose={() => setOpenC(false)}
          handleAccept={() => handleAccept()}
          handleCounter={() => handleCounter()}
        />

        {counterList && (
          <CounterOffer
            show={openO}
            handleClose={() => setOpenO(false)}
            firstOffer={counterList}
          />
        )}
      </Wrapper>

      <VolumeSection loading={loading} volume={volume} />
    </ContainerSm>
  );
};

export default HomePage;
``;
