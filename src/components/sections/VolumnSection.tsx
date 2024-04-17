import React from "react";
import { Text } from "..";
import styled from "styled-components";
import { VetmeIcon } from "../Icons";
import { useTokenPrice } from "@/hooks/useTokenPrice";

const VolumeContainer = styled.div`
  background: #170728;
  border: 1px solid #2e203e;
  border-radius: 6px;
  margin-bottom: 24px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const Volumes = styled.div`
  display: flex;
  flex: 1;
  /* grid-template-columns: repeat(auto-fit, minmax(00px, 1fr)); */
  gap: 32px;

  > div {
    position: relative;
    color: #b9b5bf;

    font-size: 12px;
    font-weight: 400;

    span {
      color: #f5f4f6;
    }

    &:not(:last-child) {
      &:after {
        content: "";
        height: 12px;
        position: absolute;
        right: -16px;
        top: calc(50% - 6px);
        border: 1px solid #453953;
      }
    }

    @media (max-width: 420px) {
      font-size: 10px;
    }
  }
`;

const VetMeVolume = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  color: #f5f4f6;

  a {
    color: #befecd;
  }
  > div {
    display: flex;
    align-items: center;
    position: relative;
    gap: 4px;
    &:after {
      content: "";
      height: 12px;
      position: absolute;
      right: -16px;
      top: 6px;
      border: 1px solid #453953;
    }
  }
`;

const VolumeSection = ({
  loading,
  volume,
}: {
  loading: boolean;
  volume: any;
}) => {
  const { price } = useTokenPrice(
    "0xe7eF051C6EA1026A70967E8F04da143C67Fa4E1f",
    1
  );
  return (
    <>
      {!loading && (
        <VolumeContainer>
          <Volumes>
            <div>
              24H volume:{" "}
              <span>
                $
                {volume.hour.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div>
              Weekly volume: $
              <span>
                {volume.weekly.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div>
              Month volume: $
              <span>
                {" "}
                {volume.monthly.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div>
              All time volume: $
              <span>
                {" "}
                {volume.allTime.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </Volumes>
          <VetMeVolume>
            <div>
              <VetmeIcon />
              <Text>${price}</Text>
            </div>
            <a
              href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0xe7eF051C6EA1026A70967E8F04da143C67Fa4E1f"
              target="_blank"
            >
              Buy $VetMe
            </a>
          </VetMeVolume>
        </VolumeContainer>
      )}
    </>
  );
};

export default VolumeSection;
