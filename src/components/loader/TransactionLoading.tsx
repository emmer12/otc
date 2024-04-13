import styled from "styled-components";
import { ActionBtn, Center, CustomLink, Flex, Spacer, Text } from "..";
import { CSSTransition } from "react-transition-group";
import { AncIcon, Loading, Loading2 } from "../Icons";
import { AnimatePresence, motion } from "framer-motion";
import { anim, fadeIn } from "@/utils/transitions";

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
  width: 350px;
  max-width: 95%;
  /* margin: auto; */
  background-size: 100% 100%;
  height: 325px;
  left: 50%;
  top: 50%;
  position: relative;
  transform: translate(-50%, -50%);
  padding: 67px 16px 16px 16px;
  background: #fff;
  border-radius: 12px;
`;

const Close = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  right: 6px;
  top: 6px;
  background: #170728;
  border: 1px solid #453953;
  border-radius: 12px;
  display: grid;
  place-content: center;
  cursor: pointer;
`;

const Anc = styled.div`
  position: absolute;
  left: 90px;
  top: 0px;

  @media (max-width: 640px) {
    left: 48px;
  }
`;

interface ITransactionLoading {
  handleClose: () => void;
  show: boolean;
}

const TransactionLoading = ({ show, handleClose }: ITransactionLoading) => {
  return (
    <>
      <AnimatePresence>
        {show && (
          <Container as={motion.div} {...anim(fadeIn)} onClick={handleClose}>
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
              <Center>
                <Text as="h3" size="h3" sizeM="h3" weight="500" color="#170728">
                  Loading
                </Text>
              </Center>
              <Spacer height={32} />
              <Center>
                <Loading2 />
              </Center>
              <Spacer height={32} />
            </Inner>
          </Container>
        )}
      </AnimatePresence>
    </>
  );
};

export default TransactionLoading;
