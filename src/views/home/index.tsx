import { ContainerSm, Flex, Text } from "@/components";
import { ListCard, SwapGrid, MobileList } from "@/components/Card";
import {
  Filter,
  FilterCircle,
  Grid,
  Linear,
  List,
  ListGrid,
  LSearch,
  Search,
} from "@/components/Icons";
import { useState } from "react";
import CustomButton from "@/components/Button/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import classNames from "classnames";

import {
  Wrapper,
  ActionSwitch,
  HomeHeader,
  LayoutSwitch,
  SearchContainer,
  SwitchItem,
  SwitchItem2,
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
  Volume,
} from "./styles";
import { useListFetch } from "@/hooks/customHooks";
import { getDailyVolume, truncate } from "@/helpers";
import { formatDateTime, formatSecTime, getForever } from "@/utils";
import { Chart, Counter, CounterOffer, Message } from "@/components/Modal";
import { ListI } from "@/types";
import Empty from "@/components/Empty";

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
          <LeftSide>
            <LayoutSwitch className={classNames({ hidden: mode == "list" })}>
              <SwitchItem
                onClick={() => setDisplay("grid")}
                className={display === "grid" ? "active" : ""}
              >
                <Linear />
              </SwitchItem>
              {/* onClick={() => setDisplay("list")} */}
              <SwitchItem
                className={display === "list" ? "active list" : "list"}
              >
                <ListGrid />
              </SwitchItem>
            </LayoutSwitch>
          </LeftSide>

          <Flex justify="space-between" align="center" style={{ flex: 1 }}>
            <ActionSwitch>
              <SwitchItem2 onClick={() => navigate("/")} className="active">
                Swap
              </SwitchItem2>
              <SwitchItem2 onClick={() => navigate("/list/create")}>
                List
              </SwitchItem2>
            </ActionSwitch>
            <SearchContainer className={classNames({ hidden: mode == "list" })}>
              <InputWrapper>
                <LSearch />
                <input
                  placeholder="SEARCH"
                  value={query}
                  onChange={(e) => onChangeHandler(e)}
                />
                <FilterCircle />
              </InputWrapper>
            </SearchContainer>
          </Flex>
        </HomeHeader>
        <HomeBody>
          {!loading && (
            <Flex wrap style={{ marginBottom: "24px" }} align="center">
              <Text as="h3" size="h3">
                Market orders
              </Text>
              <Volume>
                24H volume: $
                {volume.hour.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Volume>
              <Volume>
                Weekly volume: $
                {volume.weekly.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Volume>
              <Volume>
                Month volume: $
                {volume.monthly.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Volume>
              <Volume>
                All time volume: $
                {volume.allTime.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Volume>
            </Flex>
          )}

          {mode == "swap" ? (
            <Swap>
              {display === "grid" ? (
                <GridWrapper>
                  {loading ? (
                    <span>loading...</span>
                  ) : data.length < 1 ? (
                    <Empty />
                  ) : (
                    data.map((list: any, i: number) => (
                      <SwapGrid
                        confirmFriction={(list) => handleFriction(list)}
                        list={list}
                        key={i}
                        state="guest"
                      />
                    ))
                  )}
                </GridWrapper>
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
    </ContainerSm>
  );
};

export default HomePage;
``;
