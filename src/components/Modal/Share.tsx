import styled from "styled-components";
import { CustomLink, Flex, Spacer, Text } from "..";
import { CSSTransition } from "react-transition-group";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  z-index: 99999;
  background: rgba(242, 255, 245, 0.7);
`;
const Inner = styled.div`
  width: 588px;
  max-width: 95%;
  /* margin: auto; */
  background-image: url(/images/bg/share.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100%;

  left: 50%;
  top: 50%;
  position: relative;
  transform: translate(-50%, -50%);
  padding: 67px 16px;
`;

const Close = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  right: 0px;
  top: 8px;
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
`;

interface IMessage {
  handleClose: () => void;
  show: boolean;
  headerText: string;
  url: string;
}

const Share = ({ show, headerText, handleClose, url }: IMessage) => {
  return (
    <>
      <CSSTransition
        in={show}
        timeout={400}
        classNames={"alert-up"}
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

            <Text as="h3" size="h3" sizeM="h3" weight="375" color="#170728">
              {headerText}
            </Text>
            <Spacer height={35} />
            <Flex className="social-footer">
              <CustomLink href="https://twitter.com/VetmeToken?t=iydy_59nL4QSNB2YfQ8CIA&s=09">
                <Flex align="center">
                  <span>{"{"}</span>
                  <Text size="s2" weight="400" uppercase>
                    <TelegramShareButton url={url}>
                      Telegram
                    </TelegramShareButton>
                  </Text>
                  <span>{"}"}</span>
                </Flex>
              </CustomLink>
              <CustomLink href="#">
                <Flex align="center">
                  {" "}
                  <span>{"{"}</span>
                  <Text size="s2" weight="400" uppercase>
                    <FacebookShareButton url={url} resetButtonStyle={true}>
                      facebook
                    </FacebookShareButton>
                  </Text>
                  <span>{"}"}</span>
                </Flex>
              </CustomLink>
              <CustomLink href="#">
                <Flex align="center">
                  <span>{"{"}</span>
                  <Text size="s2" uppercase>
                    <TwitterShareButton url={url} resetButtonStyle={true}>
                      twitter
                    </TwitterShareButton>
                  </Text>
                  <span>{"}"}</span>
                </Flex>
              </CustomLink>
              <CustomLink href="#">
                <Flex align="center">
                  <span>{"{"}</span>
                  <Text size="s2" uppercase>
                    <WhatsappShareButton url={url} resetButtonStyle={true}>
                      Whatsapp
                    </WhatsappShareButton>
                  </Text>
                  <span>{"}"}</span>
                </Flex>
              </CustomLink>
            </Flex>
          </Inner>
        </Container>
      </CSSTransition>
    </>
  );
};

export default Share;
