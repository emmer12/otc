import { Flex } from "@/components";
import styled from "styled-components";

export const List = styled.div``;

export const TradeWrapper = styled.div`
  background-image: url(/images/bg/list-3.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  border-radius: 10px;
  position: relative;

  .header {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }

  padding: 30px 126px;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    padding: 15px 15px;
  }
`;
export const TradeInner = styled(Flex)`
  flex: 1;
`;
export const LeftContent = styled(Flex)`
  flex: 1;
`;
export const TradeItem = styled.div`
  @media (max-width: 640px) {
    text-align: inherit;
  }
`;

export const RightContent = styled(Flex)`
  flex: 1;
  text-align: end;
  height: 90%;
`;
export const LTop = styled.div``;
export const SwitchTab = styled(Flex)`
  width: 249px;
  height: 73px;

  background: #d9d9d9;
  border-radius: 20px;
  /* flex: none; */
  order: 0;
  flex-grow: 0;
  position: relative;
  transition: 0.3s;

  &:after {
    content: "";
    position: absolute;
    top: 6px;
    height: 80%;
    width: 50%;
    background: #7da9ff;
    box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
    border-radius: 10px;
    z-index: 1;
    display: flex;
    transition: 0.3s;
    font-weight: 500;
  }

  &.visible {
    transition: 0.3s;
    font-weight: 700;
    &:after {
      left: calc(50% - 10px);
    }
  }
  &.invisible {
    font-weight: 700;
    &:after {
      left: 10px !important;
    }
  }
`;
export const Tab = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
`;
export const RTop = styled.div``;
export const Footer = styled.div``;
export const BtnWrapper = styled.div`
  width: 50%;

  @media (max-width: 640px) {
    width: 80%;
  }
`;

export const Stepper = styled.div<{ status: number }>`
  width: 460px;
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: auto;

  @media (max-width: 640px) {
    width: 300px;
  }
`;
export const Step = styled.div<{ leftMsg?: string; rightMsg?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative;
  z-index: 3;
  color: #fff;
  font-size: 12px;

  &.active {
    /* background: #7da9ff; */
  }

  &:nth-child(1) {
    left: -2px;
  }
  &:nth-child(5) {
    left: 2px;
  }

  &:before {
    /* content: "${({ leftMsg }) => leftMsg}"; */
    position: absolute;
    top: 0px;
    left: -240px;
    width: 230px;
    text-align: end;
    font-weight: 500;
  }
  &:after {
    content: "${({ rightMsg }) => rightMsg}";
    position: absolute;
    top: -24px;
    white-space: nowrap;
    left: 50%;
    text-align: start;
    font-weight: 500;
    transform: translateX(-50%);

    @media (max-width: 640px) {
      font-size: 12px;
    }
  }
`;

export const Transaction = styled.div`
  padding: 10px;
  margin-top: 30px;

  table {
    border: 1px solid #170728;
    border-radius: 18px;
    padding: 10px;
    width: 100%;

    th {
      text-align: inherit;

      &.right {
        text-align: end;
      }
    }

    tr {
      height: 60px;

      small {
        color: #170728b5;
      }

      td {
        min-width: 150px;
      }
    }

    /* @media screen and (max-width: 600px) {
      border: 0;

      thead {
        border: none;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      tr {
        border-bottom: 3px solid #ddd;
        display: block;
        margin-bottom: 0.625em;
      }

      td {
        border-bottom: 1px solid #ddd;
        display: block;
        font-size: 0.8em;
        text-align: right;
      }

      td::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        text-transform: uppercase;
      }

      td:last-child {
        border-bottom: 0;
      }
    }
  }

  td {
    &.right {
      text-align: end;
    } */
  }
`;

export const THeader = styled.div`
  font-size: 16px;
  margin: 20px 0px;
`;
