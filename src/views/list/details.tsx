import React, { useState } from "react";
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
} from "@/components";
import { Button } from "@/components/Button";
import {
  BackArrow,
  ArrowUpward,
  CopyIcon,
  Info,
  Copy,
} from "@/components/Icons";
import { Link } from "react-router-dom";
import InformationModal from "@/components/Modal/Info";

enum ModalType {
  INFO = "Information Modal",
  COUNTER = "Counter Modal",
}

const ListDetails = () => {
  const [showModal, setSetShowModal] = useState<ModalType | null>(null);

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
        <Flex gap={16}>
          <Flex style={{ flex: 1 }} gap={16} direction="column">
            <Card>
              <Flex align="center" justify="space-between">
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

                <div style={{ textAlign: "end" }}>
                  <Text color="#2E203E" weight="500">
                    20% Filled
                  </Text>
                  <Text weight="500" size="tiny" color="#746A7E">
                    23.45 $OWJ of 2351 $OWJ
                  </Text>
                </div>
              </Flex>
            </Card>
            <Card>
              <Flex gap={16} justify="space-between">
                <div>
                  <TextCus>0.00</TextCus>
                  <Text color="#8B8394" as="span" size="tiny" weight="500">
                    $0.034
                  </Text>
                </div>

                <Flex gap={4} align="center">
                  <Text
                    color="#5D5169"
                    weight="500"
                    style={{ lineHeight: "15.31px", fontSize: "24px" }}
                  >
                    $OWJ
                  </Text>
                  <Avatar size="xs">
                    <img
                      onError={(e: any) => (e.target.src = "/no-token.png")}
                      src={"/no-token.png"}
                      alt="Logo"
                    />
                  </Avatar>
                </Flex>
              </Flex>
              <Spacer height={12} />

              <Flex align="center" gap={12}>
                <Range className="field" style={{ flex: 1 }}>
                  <input style={{ width: "100%" }} type="range" />
                </Range>
                <Text size="small" weight="500" color="#2E203E">
                  30%
                </Text>
                <Button className="secondary xs">Max</Button>
              </Flex>
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
                      32.23 USDT
                    </Text>
                  </Flex>
                </Flex>
              </CardGray>

              <Spacer height={40} />
              <ActionBtn size="56px">Connect wallet</ActionBtn>
            </Card>
          </Flex>
          <Flex style={{ flex: 1 }} gap={16} direction="column">
            <Card>
              <Flex justify="space-between" align="center">
                <Text color="#746A7E" size="s3">
                  Offer
                </Text>
                <Flex gap={4} align="center">
                  <Text size="big" color="#000000" weight="500">
                    0.01
                  </Text>
                  <Text
                    color="#5D5169"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "15.31px" }}
                  >
                    VETME
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
                    0.01
                  </Text>
                  <Text
                    color="#5D5169"
                    weight="500"
                    size="tiny"
                    style={{ lineHeight: "15.31px" }}
                  >
                    USDT
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
              <Button className="primary">Send Counter Offer</Button>
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
                    0xf7...557b
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
                    0xf7...557b
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
                    32.23 USDT
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
                    Partial Fill
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
                    23.23%
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
                    12 June, 2023
                  </Text>
                </Flex>
              </Flex>
            </Card>
            <Card>
              <Text as="h4" weight="500" size="big" color="#000">
                Order History
              </Text>
              <Spacer height={16} />

              <table style={{ width: "100%" }}>
                <TableHead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Filled Amount</th>
                    <th>Paid Amount</th>
                    <th>Tx</th>
                  </tr>
                </TableHead>
                <TableBody>
                  <tr>
                    <td>2 hours ago</td>
                    <td>
                      <Flex>
                        <span>23.123</span>
                      </Flex>
                    </td>
                    <td>
                      <Flex>
                        <span>23.123</span>
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
                          0xf7...557b
                        </Text>
                        <ArrowUpward />
                      </Flex>
                    </td>
                  </tr>

                  <tr>
                    <td>2 hours ago</td>
                    <td>
                      <Flex>
                        <span>23.123</span>
                      </Flex>
                    </td>
                    <td>
                      <Flex>
                        <span>23.123</span>
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
                          0xf7...557b
                        </Text>
                        <ArrowUpward />
                      </Flex>
                    </td>
                  </tr>
                </TableBody>
              </table>
            </Card>
          </Flex>
        </Flex>
      </DWrapper>

      {showModal && (
        <InformationModal
          handleClose={() => setSetShowModal(null)}
          show={!!showModal}
        />
      )}
    </div>
  );
};

export default ListDetails;
