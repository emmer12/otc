import React, { useState, useEffect, useContext } from "react";
import {
  DWrapper,
  BackArrowWrapper,
  TokenLogoWrap,
  AddCopy,
  TextCus,
  Range,
  TableHead,
  TableBody,
} from "./styles";
import {
  Flex,
  Spacer,
  Card,
  Text,
  Avatar,
  CardGray,
  ActionBtn,
  Center,
} from "@/components";
import { Button } from "@/components/Button";
import {
  BackArrow,
  ArrowUpward,
  CopyIcon,
  Info,
  Copy,
  ScanLogo,
} from "@/components/Icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import InformationModal from "@/components/Modal/Info";
import { getTokenList } from "@/helpers/apiHelper";
import { ListI } from "@/types";
import {
  checkRelay,
  computeUsdPrice,
  getPercentage,
  truncate,
} from "@/helpers";
import Slider from "react-smooth-range-input";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import {
  formatDate,
  formatTimeAgo,
  getScanLink,
  listSign,
  parseError,
  parseSuccess,
  showComingSoon,
} from "@/utils";
import { loader } from "@/components/styles";
import Skeleton from "react-loading-skeleton";
import { useTokenDetails } from "@/hooks/useTokenDetails";
import { useApprove } from "@/hooks/useApprove";
import { useAllowance } from "@/hooks/useAllowance";
import { ConnectContext, ConnectContextType } from "@/context/ConnectContext";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Connect as ConnectModal } from "@/components/Modal";
import BigNumber from "bignumber.js";
import { matchTokenOrder } from "@/helpers/contract";
import Api, { BASE_URL } from "@/helpers/apiHelper";
import TransactionLoading from "@/components/loader/TransactionLoading";

enum ModalType {
  INFO = "Information Modal",
  COUNTER = "Counter Modal",
  CONNECT = "Connect Modal",
  LOADING = "Loading Modal",
}

const ListDetails = () => {
  const [showModal, setSetShowModal] = useState<ModalType | null>(null);
  const [list, setListing] = useState<ListI | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [matchLoading, setMatchLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<any>(0);
  const { account, chainId, library } = useWeb3React<Web3Provider>();
  const { connect } = useContext(ConnectContext) as ConnectContextType;

  // list?.token_out_metadata.address
  const { price, loading: loadingPrice } = useTokenPrice(
    list?.token_out_metadata.address,
    list?.chain
  );
  const { approve, loading: approvalLoading } = useApprove();
  const {
    allowance,
    loading: allowanceLoading,
    refetch,
  } = useAllowance(list?.token_in_metadata?.address, amount);

  let { id } = useParams();
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      setLoading(true);
      const {
        data: { listing },
      } = await getTokenList(id);
      setLoading(false);
      setListing(listing);

      if (!listing?.is_friction) {
        setAmount(listing.amount_out_balance);
      }
    } catch (e) {
      navigate(`/v/not-found`);
    }
  };

  const handleSwap = async () => {
    setSetShowModal(ModalType.LOADING);
    if (Number(allowance) < list?.amount_in) {
      const actualAmount: number = +Number(amount).toFixed(4);

      await approve(
        list?.token_in_metadata?.address,
        actualAmount,
        list?.token_in_metadata?.symbol
      );
      setSetShowModal(null);
      refetch();
    } else {
      await matchOrder();
      setSetShowModal(null);
      fetchList();
    }
  };

  const matchOrder = async () => {
    const amountComputed = (amount * list?.amount_out) / list?.amount_in;

    const aIn = list?.is_friction ? amount : list?.amount_in;
    const aOut = list?.is_friction
      ? amountComputed.toFixed(4)
      : list?.amount_out_balance;
    let listCopy: any = { ...list };

    try {
      setMatchLoading(true);
      setSetShowModal(ModalType.LOADING);
      let signatureData = {
        signatory: account,
        receivingWallet: account,
        tokenIn: list?.token_out,
        tokenOut: list?.token_in,
        amountOut: new BigNumber(aIn)
          .shiftedBy(list?.token_in_metadata.decimal_place)
          .toString(),
        amountIn: new BigNumber(aOut as number)
          .shiftedBy(list?.token_out_metadata.decimal_place)
          .toString(),
        deadline: list?.deadline,
        nonce: list?.nonce_friction,
      };

      listCopy.aIn = aIn;
      listCopy.aOut = aOut;

      const signer = library?.getSigner();
      const { signature } = await listSign(signer, signatureData, chainId);
      const response = await matchTokenOrder(
        library,
        chainId,
        list?.signature,
        signature,
        listCopy,
        account
      );

      let hash;
      const hasRelay = checkRelay(chainId);

      if (hasRelay) {
        const interval = setInterval(async () => {
          setMatchLoading(true);
          const { data } = await Api.checkRelayStatus(response.taskId);

          if (data.task.taskState == "ExecSuccess") {
            hash = data.task.transactionHash;

            const datas = {
              buyerSignature: signature,
              sellerSignature: list?.signature,
              id: list?._id,
              account,
              transactionHash: hash,
              amount: list?.is_friction ? amountComputed : list?.amount_out,
            };

            await Api.upDateListComp(datas);
            // setStatus(3);
            parseSuccess("Swap Successful");
            setMatchLoading(false);
            setSetShowModal(null);

            clearInterval(interval);
          } else if (data.task.taskState == "Cancelled") {
            setMatchLoading(false);
            setSetShowModal(null);
            clearInterval(interval);
            parseError("Swap Not successful. Please try again or contact us");
          }
        }, 5000);
      } else {
        hash = response.transactionHash;
        const datas = {
          buyerSignature: signature,
          sellerSignature: list?.signature,
          id: list?._id,
          account,
          transactionHash: hash,
          amount: list?.is_friction ? amountComputed : list?.amount_out,
        };

        await Api.upDateListComp(datas);
        parseSuccess("Swap Successful");
        setMatchLoading(false);
        setSetShowModal(null);
      }

      setAmount(0);
      // transactionHash: response.transactionHash || response.taskId,
    } catch (err: any) {
      console.log({
        err,
        aIn,
        aOut,
      });
      if (err.status && err.status == 401) {
        // setStatus(3);
      } else {
        parseError(err.reason || err.message);
      }
      setMatchLoading(false);
    } finally {
      // setMatchLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="container">
      <DWrapper>
        <Flex justify="space-between" align="center">
          <Link to={"/"}>
            <BackArrowWrapper>
              <Flex gap={10} role="button">
                <BackArrow />
                <span>Back</span>
              </Flex>
            </BackArrowWrapper>
          </Link>

          <Button
            onClick={() => setSetShowModal(ModalType.INFO)}
            className="secondary"
            style={{ textTransform: "capitalize" }}
          >
            Token information
          </Button>
        </Flex>
        <Spacer height={24} />
        <Flex gap={16} wrap>
          <Flex style={{ flex: 1 }} gap={16} direction="column">
            <Card>
              <Flex align="center" justify="space-between">
                <Flex gap={16}>
                  <TokenLogoWrap>
                    <img
                      onError={(e: any) => (e.target.src = "/no-token.png")}
                      src={list?.token_out_metadata.icon || "/no-token.png"}
                      alt="Logo"
                    />
                  </TokenLogoWrap>
                  <div>
                    <Flex>
                      <Text weight="500" size="big" as="span">
                        {list?.token_out_metadata.symbol}
                      </Text>
                      <ArrowUpward />
                    </Flex>
                    <Spacer height={8} />
                    <AddCopy>
                      {list && (
                        <span>
                          {truncate(list?.token_out_metadata.address, 9)}
                        </span>
                      )}
                      <CopyIcon />
                    </AddCopy>
                  </div>
                </Flex>

                <div style={{ textAlign: "end" }}>
                  <Text color="#2E203E" weight="500">
                    {getPercentage(list?.amount_out, list?.amount_bought)} %
                    Filled
                  </Text>
                  <Text weight="500" size="tiny" color="#746A7E">
                    {list?.amount_bought?.toFixed(4)}{" "}
                    {list?.token_out_metadata.symbol} of {list?.amount_out}{" "}
                    {list?.token_out_metadata.symbol}
                  </Text>
                </div>
              </Flex>
            </Card>
            {(list?.status as number) < 3 && (
              <Card>
                <Flex gap={16} justify="space-between">
                  <div>
                    <TextCus>{Number(amount).toFixed(2)}</TextCus>
                    {loadingPrice ? (
                      <>
                        <Skeleton style={loader.hText2} />
                      </>
                    ) : (
                      <Text color="#8B8394" as="span" size="tiny" weight="500">
                        ${computeUsdPrice(price, amount)}
                      </Text>
                    )}
                  </div>

                  <Flex gap={4} align="center">
                    <Text
                      color="#5D5169"
                      weight="500"
                      style={{ lineHeight: "15.31px", fontSize: "24px" }}
                    >
                      {list?.token_out_metadata.symbol}
                    </Text>
                    <Avatar size="xs">
                      <img
                        onError={(e: any) => (e.target.src = "/no-token.png")}
                        src={list?.token_out_metadata.icon || "/no-token.png"}
                        alt="Logo"
                      />
                    </Avatar>
                  </Flex>
                </Flex>
                <Spacer height={12} />
                {/* <div>
                <Slider
                  value={amount}
                  min={0.01}
                  max={5000}
                  padding={0}
                  barColor="#170728"
                  barHeight={10}
                  barStyle={{ borderRadius: "200px" }}
                  hasTickMarks={false}
                  onChange={(e) => {
                    console.log(e);
                    setAmount(e as number);
                  }}
                  customController={({ ref }) => (
                    <div
                      ref={ref}
                      style={{
                        width: "18px",
                        height: "18px",
                        background: "#170728",
                        display: "block",
                        borderRadius: 200,
                      }}
                    />
                  )}
                />
              </div> */}
                {list?.is_friction && (
                  <Flex align="center" gap={12}>
                    <Range className="field" style={{ flex: 1 }}>
                      <input
                        style={{ width: "100%" }}
                        type="range"
                        max={list?.amount_out_balance}
                        step={0.01}
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                      />
                    </Range>
                    <Text size="small" weight="500" color="#2E203E">
                      {getPercentage(list?.amount_out_balance, amount)}%
                    </Text>
                    <Button
                      className="secondary xs"
                      onClick={(e) => setAmount(list?.amount_out_balance)}
                    >
                      Max
                    </Button>
                  </Flex>
                )}
                <Spacer height={12} />
                <CardGray>
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={4}>
                      <Text color="#746A7E" size="s3">
                        Price/Token
                      </Text>
                      <Info />
                    </Flex>
                    <Flex gap={4} align="center">
                      <Text
                        color="#2E203E"
                        weight="500"
                        size="tiny"
                        style={{ lineHeight: "17.88px" }}
                      >
                        {price == 0 ? "--" : price.toFixed(4)} USDT
                      </Text>
                    </Flex>
                  </Flex>
                </CardGray>
                <Spacer height={40} />
                {/* {Number(allowance)}/{list?.amount_in} */}
                {account ? (
                  <Center>
                    {list?.amount_out_balance >= 0 && (
                      <ActionBtn
                        disabled={
                          matchLoading ||
                          approvalLoading ||
                          allowanceLoading ||
                          amount == 0
                        }
                        size="56px"
                        onClick={() => handleSwap()}
                      >
                        {Number(allowance) < list?.amount_in
                          ? "Approve"
                          : "Swap"}
                      </ActionBtn>
                    )}
                  </Center>
                ) : (
                  <ActionBtn
                    size="56px"
                    onClick={() => setSetShowModal(ModalType.CONNECT)}
                  >
                    Connect Your wallet
                  </ActionBtn>
                )}
              </Card>
            )}
          </Flex>
          <Flex style={{ flex: 1 }} gap={16} direction="column">
            <Card>
              <Flex justify="space-between" align="center">
                <Text color="#746A7E" size="s3">
                  Offer
                </Text>
                <Flex gap={4} align="center">
                  <Text size="big" color="#000000" weight="500">
                    {list?.amount_out}
                  </Text>
                  <Text
                    color="#5D5169"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "15.31px" }}
                  >
                    {list?.token_out_metadata.symbol}
                  </Text>
                  <Avatar size="tiny">
                    <img
                      onError={(e: any) => (e.target.src = "/no-token.png")}
                      src={"/no-token.png"}
                      alt="Logo"
                    />
                  </Avatar>
                </Flex>
              </Flex>
              <Spacer height={16} />
              <Flex justify="space-between" align="center">
                <Text color="#746A7E" size="s3">
                  To Receive
                </Text>
                <Flex gap={4} align="center">
                  <Text size="big" color="#000000" weight="500">
                    {list?.amount_in}
                  </Text>
                  <Text
                    color="#5D5169"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "15.31px" }}
                  >
                    {list?.token_in_metadata.symbol}
                  </Text>
                  <Avatar size="tiny">
                    <img
                      onError={(e: any) => (e.target.src = "/no-token.png")}
                      src={"/no-token.png"}
                      alt="Logo"
                    />
                  </Avatar>
                </Flex>
              </Flex>
              <Spacer height={16} />
              {(list?.status as number) < 3 && (
                <Button className="primary" onClick={showComingSoon}>
                  Send Counter Offer
                </Button>
              )}
            </Card>
            <Card>
              <Text as="h4" weight="500" size="big" color="#000">
                Offer Details
              </Text>
              <Spacer height={16} />

              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Text color="#746A7E" size="s3">
                    Order ID
                  </Text>
                  <Info />
                </Flex>
                <Flex gap={4} align="center">
                  <Text
                    color="#2E203E"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "17.88px" }}
                  >
                    {list && truncate(list?._id, 11)}
                  </Text>
                  <CopyIcon />
                </Flex>
              </Flex>
              <Spacer height={16} />
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Text color="#746A7E" size="s3">
                    Created by
                  </Text>
                  <Info />
                </Flex>
                <Flex gap={4} align="center">
                  <Text
                    color="#2E203E"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "17.88px" }}
                  >
                    {list && truncate(list?.signatory, 11)}
                  </Text>
                  <CopyIcon />
                </Flex>
              </Flex>
              <Spacer height={16} />
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Text color="#746A7E" size="s3">
                    Price/Token
                  </Text>
                  <Info />
                </Flex>
                <Flex gap={4} align="center">
                  <Text
                    color="#2E203E"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "17.88px" }}
                  >
                    {price == 0 ? "--" : price.toFixed(4)} USDT
                  </Text>
                </Flex>
              </Flex>
              <Spacer height={16} />
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Text color="#746A7E" size="s3">
                    Fill type
                  </Text>
                  <Info />
                </Flex>
                <Flex gap={4} align="center">
                  <Text
                    color="#2E203E"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "17.88px" }}
                  >
                    {list?.is_friction ? "Partial Fill" : "Fixed Fill"}
                  </Text>
                </Flex>
              </Flex>
              <Spacer height={16} />
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Text color="#746A7E" size="s3">
                    Whitelist
                  </Text>
                  <Info />
                </Flex>
                <Flex gap={4} align="center">
                  <Text
                    color="#2E203E"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "17.88px" }}
                  >
                    No
                  </Text>
                </Flex>
              </Flex>
              <Spacer height={16} />
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Text color="#746A7E" size="s3">
                    Gain relative to Chart Prices:
                  </Text>
                  <Info />
                </Flex>
                <Flex gap={4} align="center">
                  <Text
                    color="#094A1E"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "17.88px" }}
                  >
                    {/* 23.23% */}
                    --
                  </Text>
                </Flex>
              </Flex>
              <Spacer height={16} />
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={4}>
                  <Text color="#746A7E" size="s3">
                    Date published
                  </Text>
                  <Info />
                </Flex>
                <Flex gap={4} align="center">
                  <Text
                    color="#2E203E"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "17.88px" }}
                  >
                    {formatDate(list?.createdAt)}
                  </Text>
                </Flex>
              </Flex>
            </Card>
            <Card>
              <Text as="h4" weight="500" size="big" color="#000">
                Order History
              </Text>
              <Spacer height={16} />

              {list?.transactions.length == 0 ? (
                <>No Transactions</>
              ) : (
                <table style={{ width: "100%" }}>
                  <TableHead>
                    <tr>
                      <th>Date/Time</th>
                      <th>Amount</th>
                      <th>Tx</th>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {list?.transactions.map((transaction: any, i: number) => (
                      <tr key={i}>
                        <td>{formatTimeAgo(transaction.createdAt)}</td>
                        <td>
                          <Flex>
                            <span>{transaction.amount_out}</span>
                            <Spacer width={6} />
                            {list?.is_private ? (
                              "(Private Sale)"
                            ) : (
                              <>
                                <Text size="s2" weight="400">
                                  {list?.token_out_metadata?.symbol}
                                </Text>
                              </>
                            )}
                          </Flex>
                        </td>
                        <td>
                          <Flex gap={4} align="center">
                            <Text
                              color="#2E203E"
                              weight="500"
                              size="tiny"
                              style={{ lineHeight: "17.88px" }}
                            >
                              <a
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                                href={getScanLink(
                                  transaction.chain,
                                  transaction.transaction_hash
                                )}
                                target="_blank"
                              >
                                <ScanLogo />
                                {truncate(transaction.transaction_hash, 9)}
                              </a>
                            </Text>
                            <ArrowUpward />
                          </Flex>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </table>
              )}
            </Card>
          </Flex>
        </Flex>
      </DWrapper>
      {showModal === ModalType.INFO && (
        <InformationModal
          handleClose={() => setSetShowModal(null)}
          show={!!showModal}
          list={list}
        />
      )}
      {showModal === ModalType.CONNECT && (
        <ConnectModal
          show={!!showModal}
          connect={(connector) => {
            setSetShowModal(null);
            connect(connector);
          }}
          handleClose={() => setSetShowModal(null)}
        />
      )}

      {showModal === ModalType.LOADING && (
        <TransactionLoading
          show={!!showModal}
          handleClose={() => setSetShowModal(null)}
        />
      )}
    </div>
  );
};

export default ListDetails;
