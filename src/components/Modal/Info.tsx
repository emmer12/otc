import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { InfoBg } from "../bgs";
import { BgWrapper, Flex, IconWrapper, Spacer, Text } from "..";
import { AddCopy, TokenLogoWrap } from "@/views/list/styles";
import { ArrowUpward, CopyIcon, GainIcon } from "../Icons";

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  z-index: 99999;
  background: rgba(23, 7, 40, 0.6);
`;
const Inner = styled.div`
  width: 418px;
  max-width: 95%;
  /* margin: auto; */
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100%;

  left: 50%;
  top: 10%;
  position: relative;
  transform: translate(-50%, 0%);
  padding: 40px 0px;
  position: relative;
  z-index: 99999;

  @media (max-width: 640px) {
    height: auto;
    background-image: url(/images/bg/message-m.png);
  }
`;

const Close = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  right: 0px;
  top: 0px;
  background: #170728;
  border: 1px solid #453953;
  border-radius: 12px;
  display: grid;
  place-content: center;
  cursor: pointer;

  @media (max-width: 640px) {
    width: 50px;
    height: 50px;
    top: -3px;
    right: 5px;
  }
`;

const Contain = styled.div`
  padding: 24px;
`;

const Title = styled.div`
  position: absolute;
  top: 0px;
  left: 40px;
  color: #ffffff;
  text-transform: uppercase;
  font-size: 14px;
`;

const Price = styled.div`
  border: 1px solid #170728;
  background: #eff1ea;
  border-radius: 8px;
  display: flex;

  .order,
  .market {
    padding: 12px;
    flex: 1;
  }

  .order {
    border-right: 1px solid #170728;
  }
`;

const Rate = styled.div`
  background: #170728;
  border-radius: 4px;
  padding: 10px 12px;
  color: #eff1ea;
  font-size: 14px;
`;

interface IProps {
  handleClose: () => void;
  show: boolean;
}

const InformationModal = ({ show, handleClose }: IProps) => {
  const navigate = useNavigate();

  return (
    <>
      <CSSTransition
        in={show}
        timeout={400}
        classNames={"alert-zoom"}
        unmountOnExit
      >
        <Container onClick={handleClose}>
          <Inner onClick={(e) => e.stopPropagation()}>
            <Close onClick={handleClose}>
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
                  fill="white"
                />
              </svg>
            </Close>

            <Title>Token Information</Title>

            <Contain>
              <Flex justify="space-between">
                <Flex gap={16}>
                  <TokenLogoWrap>
                    <img
                      onError={(e: any) => (e.target.src = "/no-token.png")}
                      src={"/no-token.png"}
                      alt="Logo"
                    />
                  </TokenLogoWrap>
                  <div>
                    <Flex>
                      <Text weight="500" size="big" as="span">
                        $OWJ
                      </Text>
                      <ArrowUpward />
                    </Flex>
                    <Spacer height={8} />
                    <AddCopy>
                      <span>0x38...2345</span>
                      <CopyIcon />
                    </AddCopy>
                  </div>
                </Flex>
                <Flex gap={4} align="center">
                  <GainIcon />
                  <Text size="tiny" color="#094A1E">
                    23.23%
                  </Text>
                </Flex>
              </Flex>

              <Spacer height={29} />

              <Price>
                <div className="order">
                  <Flex justify="space-between">
                    <Text color="#5D5169" size="s3">
                      Order Price
                    </Text>
                    <Flex gap={4} align="center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={8}
                        height={7}
                        fill="none"
                      >
                        <path
                          fill="#009F34"
                          d="M2.897.922a1.328 1.328 0 0 1 2.206 0l2.624 3.75C8.4 5.636 7.753 7 6.624 7H1.376C.247 7-.4 5.635.273 4.673L2.897.923Z"
                        />
                      </svg>
                      <Text size="tiny" color="#094A1E">
                        23.23%
                      </Text>
                    </Flex>
                  </Flex>
                  <Spacer height={16} />
                  <Text size="h4">$34.90K</Text>
                </div>
                <div className="market">
                  <Flex>
                    <Text color="#5D5169" size="s3">
                      Market Price
                    </Text>
                  </Flex>
                  <Spacer height={16} />
                  <Text size="h4">$34.90K</Text>
                </div>
              </Price>

              <Spacer height={8} />

              <Rate>
                <Flex justify="space-between">
                  <Text>1 OWJ</Text>
                  <Text>100k USDT</Text>
                </Flex>
              </Rate>

              <Spacer height={16} />
              <Flex gap={12} direction="column">
                <Flex justify="space-between" style={{ width: "100%" }}>
                  <Text size="s4" color="#5D5169">
                    Total supply
                  </Text>
                  <Text size="s1" color="#170728">
                    $34.90K
                  </Text>
                </Flex>
                <Flex justify="space-between" style={{ width: "100%" }}>
                  <Text size="s4" color="#5D5169">
                    Total Market cap
                  </Text>
                  <Text size="s1" color="#170728">
                    $344.90K
                  </Text>
                </Flex>
                <Flex justify="space-between" style={{ width: "100%" }}>
                  <Text size="s4" color="#5D5169">
                    Holders
                  </Text>
                  <Text size="s1" color="#170728">
                    44.90K
                  </Text>
                </Flex>
                <Flex justify="space-between" style={{ width: "100%" }}>
                  <Text size="s4" color="#5D5169">
                    Total Transactions
                  </Text>
                  <Text size="s1" color="#170728">
                    $3449.90K
                  </Text>
                </Flex>

                <Flex justify="space-between" style={{ width: "100%" }}>
                  <Text size="s4" color="#5D5169">
                    Total Transactions
                  </Text>
                  <Text size="s1" color="#170728">
                    49
                  </Text>
                </Flex>

                <Flex justify="space-between" style={{ width: "100%" }}>
                  <Text size="s4" color="#5D5169">
                    24H VOlume
                  </Text>
                  <Text size="s1" color="#170728">
                    $34.90K
                  </Text>
                </Flex>
              </Flex>
            </Contain>

            <BgWrapper>
              <InfoBg />
            </BgWrapper>
          </Inner>
        </Container>
      </CSSTransition>
    </>
  );
};

export default InformationModal;
