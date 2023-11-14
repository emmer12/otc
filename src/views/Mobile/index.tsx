import { ActionBtn, Center, Container,  Flex, Input, InputBox, InputCon, InputInner, Spacer, Text, TokenBadge } from "@/components";
import ListCard from "../../components/Modal/CounterOffer";
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
import useSWR from 'swr'
import { getDailyVolume, truncate } from "@/helpers";
import { formatDateTime, formatSecTime, getForever } from "@/utils";
import { Chart, Counter, CounterOffer, Message } from "@/components/Modal";
import { ListI } from "@/types";
import Empty from "@/components/Empty";
import axios from "axios";
import styled from "styled-components";
import apiHelper, {getIdCounter} from "@/helpers/apiHelper";

const SwapContainer = styled.div`
  width: 431px;
  max-width: 100%;
  height: 100%;
  /* margin-bottom: 114px; */
  /* background: #ffffff; */
  margin: auto;
  background-image: url(/images/bg/counter-offer.png);
  background-repeat: no-repeat;
  background-position: top center;
  /* background-size: cover; */
  background-size: 100% 100%;
  position: relative;
  
  .header {
    position: absolute;
    left: 58px;

    @media (max-width: 640px) {
      left: 48px;
      font-size: 12px;
    }
  }

  @media (max-width: 640px) {
    width: 90%;
    background-image: url(/images/bg/counter-offer.png);
    background-repeat: no-repeat;
    background-position: top center;
    background-size: 100% 100%;
    border-radius: 10px;
  }
`;
const ContainerSm = styled.div`
height: 45em;
  

`;
const Body = styled.div`
height: 100%;
 


  
  @media (max-width: 640px) {
    /* padding: 20px 25px; */
  }
`;

const Inner = styled.div`
  left: 50%;
  top: 50%;
  width: fit-content;
  position: relative;
  transform: translate(-50%, -50%);
  /* padding: 50px 16px; */

  @media (max-width: 640px) {
    left: 50%;
    top: 10%;
    transform: translate(-50%, 0%);
    position: relative;
  }
`;

const Close = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  right: 0px;
  top: 0px;
  background: #170728;
  border: 1px solid #453953;
  border-radius: 12px;
  display: grid;
  place-content: center;
  cursor: pointer;
  z-index: 99;

  @media (max-width: 640px) {
    width: 50px;
    height: 50px;
    top: 15px;
    right: 18px;
  }
`;

const DetailsWrapper = styled.div`
  padding: 0px 16px 16px;
`;

const InputWrapper = styled.div`
  width: 100%;
  background-image: url(/images/bg/counter-divide.png);
  background-repeat: no-repeat;
  background-position: top;
  padding: 24px 16px 16px;

  @media (max-width: 640px) {
    background-size: 100%;
  }
`;

interface ICounter {
  handleClose: () => void;
  show: boolean;
  firstOffer: ListI;
}

const init = {
  amount_in: "",
  amount_out: "",
};

const Mobile =  () => {
  const [display, setDisplay] = useState<"grid" | "list">("grid");
  const [counterListStuff, setCounterListStuff] = useState<any>(null);

  let { chain } = useParams();
  const savedChainId = JSON.parse(localStorage.getItem("chain") as string);
  const {  data, setQuery, query, volume } = useListFetch(
    chain || savedChainId
  );
  const navigate = useNavigate();
  const [openC, setOpenC] = useState<boolean>(false);
  const [openO, setOpenO] = useState<boolean>(false);
  const [counterList, setCounterList] = useState<any>(null);


  const  yourParameter  = useParams();
  console.log(yourParameter.id)


 const { error: dataError, isLoading: dataLoading, data: counterListData } = useSWR(
  yourParameter.id, 
  getCounter,
  {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  revalidateOnMount: true,
  revalidateIfStale: true,
  }
)
useSWR(yourParameter.id, getCounter, { refreshInterval: 500})
const [loading, setLoading] = useState(false);
const [open, setOpen] = useState(false);
const [form, setForm] = useState(init);

const isValid = () => {
  // return form.amount_in !== (0 || "") && form.amount_out !== (0 || "");
};


const handleSubmit = async () => {
  const data = {
    ...form,
    list_id: counterListData?.data.listing._id,
  };
  try {
    setLoading(true);
    const res = await apiHelper.counter(data);

    setOpen(true);
    setForm(init);
  } catch (error) {
 
  } finally {
    setLoading(false);
  }

  // navigate("/list");
};

const handleChange = (e: any) => {
  let value = e.target.value;
  const name = e.target.name;

  setForm((prevState: any) => ({
    ...prevState,
    [name]: value,
  }));
};


console.log(counterListData?.data.listing)
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
    <><div className=""><ContainerSm>


      <Inner onClick={(e) => e.stopPropagation()}>

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
            fill="white" />
        </svg>

        <SwapContainer>
          <Text
            className="header"
            uppercase
            weight="400"
            size="s3"
            color="#453953"
          >
            Counter Offer
          </Text>
          <Body>
            <DetailsWrapper>
              <Text
                as="h4"
                size="h4"
                sizeM="h4"
                color="#170728"
                weight="450"
              >
                First Offer
              </Text>
              <Spacer height={24} />

              <Flex gap={33} align="center">
                <TokenBadge
                  token={counterListData?.data.listing.token_in_metadata}
                  hasCaret={false}
                  handleClick={() => null} />
                <Text size="s1" sizeM="s1" color="#170728">
                  {counterListData?.data.listing.amount_in}{" "}
                  {counterListData?.data.listing.token_in_metadata.symbol}
                </Text>
              </Flex>
              <Spacer height={16} />
              <Flex gap={33} align="center">
                <TokenBadge
                  token={counterListData?.data.listing.token_out_metadata}
                  hasCaret={false}
                  handleClick={() => null} />
                <Text size="s1" sizeM="s1" color="#170728">
                  {counterListData?.data.listing.amount_out}{" "}
                  {counterListData?.data.listing.token_out_metadata.symbol}
                </Text>
              </Flex>
            </DetailsWrapper>
            <Spacer height={28} />

            <InputWrapper>
              <Text
                as="h4"
                size="h4"
                sizeM="h4"
                color="#170728"
                weight="450"
              >
                Counter Offer
              </Text>
              <Spacer height={24} />

              <InputCon>
                <InputBox>
                  <InputInner>
                    <Input
                      onChange={handleChange}
                      name="amount_in"
                      placeholder="0.0"
                      type="number"
                      value={form.amount_in}
                      step={0.1} />
                    <div>
                      <TokenBadge
                        token={counterListData?.data.listing.token_in_metadata}
                        hasCaret={false}
                        handleClick={() => null} />
                    </div>
                  </InputInner>
                </InputBox>
              </InputCon>
              <Spacer height={31} />
              <InputCon>
                <InputBox>
                  <InputInner>
                    <Input
                      onChange={handleChange}
                      name="amount_out"
                      value={form.amount_out}
                      type="number"
                      step={0.1}
                      placeholder="0.0" />
                    <div>
                      <TokenBadge
                        token={counterListData?.data.listing.token_out_metadata}
                        hasCaret={false}
                        handleClick={() => null} />
                    </div>
                  </InputInner>
                </InputBox>
              </InputCon>

              <Spacer height={20} />
              {/* disabled={!isValid()} */}
              <Center>
                <ActionBtn disabled={loading} onClick={handleSubmit}>
                  Send offer
                </ActionBtn>
              </Center>
            </InputWrapper>
          </Body>
        </SwapContainer>
      </Inner>








      </ContainerSm>
   </div></>
  );
};

export default Mobile;
``;

async function getCounter(id: string){
  let s = await axios.get("https://api.vetmeblock.com/api/lists/" + id)
  return s

}
