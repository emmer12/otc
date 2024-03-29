import React from "react";
import { Flex, Text } from "..";
import { Volume } from "@/views/home/styles";

const VolumeSection = ({
  loading,
  volume,
}: {
  loading: boolean;
  volume: any;
}) => {
  return (
    <>
      {!loading && (
        <Flex wrap style={{ marginBottom: "24px" }} align="center">
          <Text as="h3" size="h3">
            Market orders
          </Text>
          <Volume>
            24H volume: $
            {volume.hour.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Volume>
          <Volume>
            Weekly volume: $
            {volume.weekly.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Volume>
          <Volume>
            Month volume: $
            {volume.monthly.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Volume>
          <Volume>
            All time volume: $
            {volume.allTime.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Volume>
        </Flex>
      )}
    </>
  );
};

export default VolumeSection;
