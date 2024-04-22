import {
  Avatar,
  CardGray,
  Center,
  ContainerSm,
  Flex,
  OnlyDesktop,
  OnlyMobile,
  Spacer,
  Text,
  Wrapper,
} from "@/components";
import { Button } from "@/components/Button";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  TradeWrapper,
  TradeCon,
  VisibleWrap,
  TradeItem,
  Footer,
  Stepper,
  Step,
  TradeInfo,
} from "./styles";
import { ListContext, ListContextType } from "@/context/Listcontext";
import { truncate } from "@/helpers";
import {
  getTokenAllowance,
  approveToken,
  getTotalSupply,
} from "@/helpers/contract";
import CustomButton from "@/components/Button/CustomButton";
import { fromBigNumber, getTradeLink, parseSuccess } from "@/utils";
import {
  BrandBlock,
  Copy,
  Info,
  PCircle,
  StepHLine,
  Lock,
} from "@/components/Icons";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import Api from "@/helpers/apiHelper";
import { Message, Share } from "@/components/Modal";
import { ListDetailsBg } from "@/components/bgs";
import { ESCROW_FEE } from "@/constansts/tokens";
import { useTokenPrice } from "@/hooks/useTokenPrice";

const Trans = () => {
  const [status, setStatus] = useState<number>(1);
  const [approving, setApproving] = useState<boolean>(false);
  const [allowance, setAllowance] = useState<string | number>("");
  const [open, setOpen] = useState<boolean>(false); //
  const [openS, setOpenS] = useState<boolean>(false); //
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  const { setForm, form, saveList, loading, clearLocal, privateLink } =
    useContext(ListContext) as ListContextType;
  const context = useWeb3React<Web3Provider>();
  const { library, chainId, account } = context;

  const { price } = useTokenPrice(form.token_out_metadata.address, chainId);

  const listToken = async () => {
    try {
      await saveList(id);
      setStatus(3);
    } catch (err) {}
  };

  const setPrivacy = (value: boolean) => {
    // setForm((prev: any) => ({
    //   ...prev,
    //   is_private: value,
    //   receiving_wallet: account,
    //   signatory: account,
    // }));
  };
  useEffect(() => {
    getAllowance();
  }, [account, form]);

  useEffect(() => {
    getAccount();
  }, [account]);

  if (form.amount_in == "") {
    window.location.replace("/");
  }

  const getAccount = async () => {
    const {
      data: { account: raccount },
    } = await Api.getAccount(account);
    if (raccount) {
      setForm((prev: any) => ({
        ...prev,
        nonce: raccount.nonce,
      }));
    }
  };

  const getAllowance = async () => {
    const allowance = await getTokenAllowance(
      form?.token_out_metadata.address,
      library,
      chainId,
      account
    );
    setAllowance(fromBigNumber(allowance.toString()));
    if ((+fromBigNumber(allowance.toString()) as number) >= form.amount_out) {
      if (status == 3) return;
      setStatus(2);
    }
  };

  const approve = async () => {
    try {
      setApproving(true);
      const totalSupply = await getTotalSupply(
        form?.token_out_metadata?.address,
        library,
        chainId
      );

      const approval = await approveToken(
        form?.token_out_metadata?.address,
        library,
        chainId,
        totalSupply
      );

      setStatus(2);
      setAllowance(form.amount_out);
      parseSuccess(
        `${form?.amount_out} ${form?.token_out_metadata.symbol} approved`
      );
    } catch (err) {
      if (err === undefined) return;

      toast.error("Opps, something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setApproving(false);
    }
  };

  const handleCancel = () => {
    clearLocal();

    if(id){
      navigate("/dashboard");
    }else{
      navigate("/");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(privateLink);
    parseSuccess("Copied");
  };

  const fee = (ESCROW_FEE / 100) * form.amount_out;

  return (
    <ContainerSm>
      <Flex directionM="column" gap={35}>
        <TradeInfo>
          <Flex gap={24} direction="column">
            <div>
              <Text color="#746A7E" size="s3">
                Offer
              </Text>
              <Flex gap={4} align="center">
                <Text size="big" color="#000000" weight="500">
                  {form.amount_out}
                </Text>
                <Text
                  color="#5D5169"
                  weight="500"
                  size="tiny"
                  style={{ lineHeight: "15.31px" }}
                >
                  {form.token_out_metadata.symbol}
                </Text>
                <Avatar size="tiny">
                  <img
                    onError={(e: any) => (e.target.src = "/no-token.png")}
                    src={form.token_out_metadata.icon || "/no-token.png"}
                    alt="Logo"
                  />
                </Avatar>
              </Flex>
            </div>
            <div>
              <Text color="#746A7E" size="s3">
                Receive
              </Text>
              <Flex gap={4} align="center">
                <Text size="big" color="#000000" weight="500">
                  {form.amount_in}
                </Text>
                <Text
                  color="#5D5169"
                  weight="500"
                  size="tiny"
                  style={{ lineHeight: "15.31px" }}
                >
                  {form.token_in_metadata.symbol}
                </Text>
                <Avatar size="tiny">
                  <img
                    onError={(e: any) => (e.target.src = "/no-token.png")}
                    src={form.token_in_metadata.icon || "/no-token.png"}
                    alt="Logo"
                  />
                </Avatar>
              </Flex>
            </div>
            <CardGray>
              <Flex direction="column">
                <Flex align="center" gap={4}>
                  <Text color="#746A7E" size="s3">
                    Escrow Fee ({ESCROW_FEE}%)
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
                    {fee.toFixed(4)} {form.token_out_metadata.symbol}
                    <Text
                      style={{ display: "inline" }}
                      color="#746A7E"
                      size="s3"
                    >
                      (${(price * fee).toFixed(2)})
                    </Text>
                  </Text>
                </Flex>
              </Flex>
            </CardGray>
          </Flex>
        </TradeInfo>

        <TradeWrapper>
          <TradeCon>
            <Text className="header" as="h2" size="s3" uppercase>
              {id ? "Update" : "List"} Transaction Queue
            </Text>
            <Spacer height={20} />
            <TradeItem style={{ textAlign: "center" }}>
              <VisibleWrap>
                <Button>
                  {form.is_private ? (
                    <>
                      <Lock /> Private{" "}
                    </>
                  ) : (
                    "Public"
                  )}
                </Button>
              </VisibleWrap>
            </TradeItem>
            <Spacer height={28} />
            {buildStepper(status)}
            <Spacer height={20} />

            <div>
              <Flex align="end" justify="center">
                <BrandBlock />
                <Spacer width={24} />
                <Text
                  style={{ top: "-12px", position: "relative" }}
                  size="s1"
                  uppercase
                  color="#FFFFFF"
                >
                  Approve trade in your wallet
                </Text>
              </Flex>
            </div>

            <Spacer height={20} />

            <Center style={{ flexDirection: "column" }}>
              {privateLink ? (
                <>
                  <Spacer height={24} />
                  <Flex>
                    <Text as="div" size="s1" color="#E8E6EA" uppercase>
                      {" "}
                      <span>
                        Private link:{" "}
                        {truncate(privateLink || "", 50, "...", "end")}
                      </span>
                    </Text>
                    <Spacer width={5} />
                    <Wrapper style={{ cursor: "pointer" }} onClick={copyLink}>
                      <Copy />
                    </Wrapper>
                  </Flex>
                  <Spacer height={20}></Spacer>

                  <Button
                    not_rounded
                    className="secondary m-sm"
                    onClick={handleCancel}
                  >
                    Ok
                  </Button>
                </>
              ) : (
                <>
                  <Spacer height={24} />
                  <OnlyMobile>
                    {status < 3 ? (
                      <Flex>
                        {(Number(allowance) as number) < form.amount_out ? (
                          <CustomButton
                            loading={loading || approving}
                            disabled={loading || approving}
                            classNames="secondary"
                            onClick={() => approve()}
                            text="Approve"
                          />
                        ) : (
                          // <Button className="primary md" onClick={() => listToken()}>
                          //   List Token
                          // </Button>
                          <CustomButton
                            classNames="secondary"
                            text={id ? "Update" : "List Token"}
                            onClick={() => listToken()}
                            loading={loading || approving}
                            disabled={loading || approving}
                            not_rounded
                          />
                        )}
                        <Spacer width={41} />
                        <Button not_rounded className="" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Flex>
                    ) : (
                      <Flex>
                        <CustomButton
                          classNames="secondary semi-rounded lg"
                          onClick={() => setOpenS(true)}
                          text="Share your Offer"
                          not_rounded
                        />
                        <Spacer width={8} />
                        <Button
                          onClick={() => navigate(`/`)}
                          className="semi-rounded lg"
                        >
                          View Listed Coin
                        </Button>
                      </Flex>
                    )}
                  </OnlyMobile>
                  <OnlyDesktop>
                    {status < 3 ? (
                      <Flex>
                        {(Number(allowance) as number) < form.amount_out ? (
                          <CustomButton
                            loading={loading || approving}
                            disabled={loading || approving}
                            classNames="secondary"
                            onClick={() => approve()}
                            text="Approve"
                            not_rounded
                          />
                        ) : (
                          // <Button className="primary md" onClick={() => listToken()}>
                          //   List Token
                          // </Button>
                          <CustomButton
                            classNames="secondary"
                            text={id ? "Update" : "List Token"}
                            onClick={() => listToken()}
                            loading={loading || approving}
                            disabled={loading || approving}
                            not_rounded
                          />
                        )}

                        <Spacer width={41} />
                        <Button not_rounded className="" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Flex>
                    ) : (
                      <Flex>
                        <CustomButton
                          classNames="secondary semi-rounded lg"
                          onClick={() => setOpenS(true)}
                          text="Share your Offer"
                          not_rounded
                        />
                        <Spacer width={8} />
                        <Button
                          onClick={() => navigate(`/`)}
                          className="semi-rounded lg"
                        >
                          View Listed Coin
                        </Button>
                      </Flex>
                    )}
                  </OnlyDesktop>

                  <Footer>
                    <Spacer height={47} />
                    <Center style={{ flexDirection: "column" }}>
                      <Text size="s2" weight="300" color="#E8E6EA">
                        Approve trade in your wallet
                      </Text>
                    </Center>
                  </Footer>
                </>
              )}
            </Center>
            <Spacer height={35} />
          </TradeCon>

          <ListDetailsBg className="bg" />
        </TradeWrapper>
      </Flex>
      <Spacer height={20} />
      <OnlyMobile>
        <Center>
          <Text as="div" size="s1" uppercase>
            NB:{" "}
            <div
              onClick={() => setOpen(true)}
              style={{
                textDecoration: "underline",
                display: "inline-block",
              }}
            >
              Escrow
            </div>{" "}
            Fee Applies
          </Text>
        </Center>
      </OnlyMobile>

      <Message
        show={open}
        headerText="Escrow Fee"
        type="info"
        handleClose={() => setOpen(false)}
        msg="Escrow Fee is a trading fee we charge to guarantee you a secured transaction. We charge from both parties to safe guard token transactions. Our fee’s are not more than 3% per trade. If trades are cancelled at any point in the transaction queue, we would refund all payments inclusive of the Escrow Fee. We provide this feature on all token and coin transactions on our platform. If you have anymore questions please reach us on our email support@vetme.com or via our telegram platform. Thanks for trading with us."
      />

      {form._id && (
        <Share
          show={openS}
          handleClose={() => setOpenS(false)}
          headerText="Share offer via"
          url={getTradeLink(form._id)}
        />
      )}
    </ContainerSm>
  );
};

const buildStepper = (status: number) => (
  <Stepper status={status}>
    <Step
      className={status >= 1 ? "active" : ""}
      rightMsg={status == 1 ? "Transaction  Opened" : ""}
    >
      <PCircle color={status >= 1 ? "#BEFECD" : ""} />
    </Step>
    <Flex align="center" style={{ width: "162px" }}>
      <StepHLine color={status >= 2 ? "#BEFECD" : ""} />
    </Flex>
    <Step
      className={status >= 2 ? "active" : ""}
      rightMsg={status == 2 ? "Approved" : ""}
    >
      <PCircle color={status >= 2 ? "#BEFECD" : ""} />
    </Step>
    <Flex align="center" style={{ width: "162px" }}>
      <StepHLine color={status >= 3 ? "#BEFECD" : ""} />
    </Flex>
    <Step
      className={status >= 3 ? "active" : ""}
      rightMsg={status == 3 ? "Coin Listed" : ""}
    >
      <PCircle color={status >= 3 ? "#BEFECD" : ""} />
    </Step>
  </Stepper>
);

export default Trans;
