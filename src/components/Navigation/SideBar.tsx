import React from "react";
import { Text } from "..";
import { SideBarCon } from "./styles";
import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import { MenuGrid } from "../Icons";

const SItems = styled(NavLink)`
  margin: 24px 0px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #eff1ea;
  padding: 9px 20px;
  border-radius: 200px;

  span {
    transition: 0.5s;
    color: #eff1ea;
  }
  &:hover,
  &.active {
    background: #eff1ea;
    span {
      color: #170728;
    }

    svg {
      path {
        stroke: #170728;
      }
    }
    &:after {
      content: "";
      height: 7px;
      width: 7px;
      border-radius: 50%;
      position: absolute;
      background: #170728;
      top: 10px;
      right: -13px;
    }
  }
`;
const SideBar = () => {
  return (
    <SideBarCon>
      <SItems to="/dashboard/my-listings">
        <MenuGrid />
        <Text size="s1" uppercase>
          Trade
        </Text>
      </SItems>
      {/* <SItems to="/dashboard/history">
        <MenuGrid />
        <Text size="s1" uppercase>
          History
        </Text>
      </SItems> */}
      <SItems to="/dashboard/profile">
        <MenuGrid />
        <Text size="s1" uppercase>
          My Profile
        </Text>
      </SItems>
    </SideBarCon>
  );
};

export default SideBar;
