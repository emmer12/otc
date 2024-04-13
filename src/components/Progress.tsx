import React from "react";
import styled from "styled-components";
import { Spacer, Text } from ".";

const ProgressWrapper = styled.div``;
const ProgressContainer = styled.div`
  height: 5px;
  background: #eff1ea;
`;
const ProgressInner = styled.div`
  background: #170728;
  height: 100%;
`;

type ProgressType = {
  value: number;
};

const Progress = ({ value }: ProgressType) => {
  return (
    <ProgressWrapper>
      <ProgressContainer className="">
        <ProgressInner
          style={{ width: `${Math.min(value, 100)}%` }}
        ></ProgressInner>
      </ProgressContainer>
      <Spacer height={4} />
      <Text size="tiny" weight="500">
        {Math.min(value, 100)}%
      </Text>
    </ProgressWrapper>
  );
};

export default Progress;
