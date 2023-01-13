import { Spacer, Text } from "@/components";
import { Button } from "@/components/Button";
import { claimToken } from "@/helpers/contract";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import styled from "styled-components";
import CustomButton from "@/components/Button/CustomButton";
import { useState } from "react";
import { parseError, parseSuccess } from "@/utils";

const SwapContainer = styled.div`
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 20px 20px 20px rgba(0, 0, 0, 0.03);
  border-radius: 20px;
  width: 508px;
  max-width: 100%;
  margin-bottom: 114px;
  margin: auto;
`;
const Header = styled.div`
  background: rgba(125, 169, 255, 0.47);
  padding: 17px 50px;
  border-radius: 20px 20px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Body = styled.div`
  padding: 28px 50px;

  @media (max-width: 640px) {
    padding: 20px 25px;
  }
`;
const Claim = () => {
  const { library } = useWeb3React<Web3Provider>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvertWeth = async (token: any) => {
    try {
      setLoading(true);
      await claimToken(library, token.address);
      parseSuccess(`${token.name} Claimed`);
    } catch (error) {
      console.log(error, "error");
      parseError("Opps, Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <SwapContainer>
        <Header>
          <Text uppercase weight="700" size="16px">
            Token Rewards
          </Text>
        </Header>
        <Body>
          <CustomButton
            onClick={() =>
              handleConvertWeth({
                address: "0x9a2992BA2d4dF6ea92Bae65951a68da48fbb70fB",
                name: "Cool Tokens",
              })
            }
            text="Get 100 Cool Tokens"
            classNames="primary block"
            loading={loading}
            disabled={loading}
          />
          <Spacer height={42} />
          <CustomButton
            onClick={() =>
              handleConvertWeth({
                address: "0x63bEf5e5bd830F61aD5C19fD8Db80462D44ea323",
                name: "Vetme Token",
              })
            }
            text="Get 100 VETME Tokens"
            classNames="primary block"
            loading={loading}
            disabled={loading}
          />
          <Spacer height={42} />
          <CustomButton
            onClick={() =>
              handleConvertWeth({
                address: "0x1004e8AE4387B587eCb06dcf4398c2A395c4b2F2",
                name: "Hot Token",
              })
            }
            text="Get 100 Hot Tokens"
            classNames="primary block"
            loading={loading}
            disabled={loading}
          />
        </Body>
      </SwapContainer>
    </div>
  );
};

export default Claim;
``;