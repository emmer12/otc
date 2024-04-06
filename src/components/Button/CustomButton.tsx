import React from "react";
import { Button } from ".";
import { IconWrapper, Loader } from "..";
import { Loading } from "../Icons";

interface BtnI {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  classNames?: string;
  not_rounded?: boolean;
}

const CustomButton = ({
  classNames,
  text,
  onClick,
  loading,
  disabled,
  not_rounded,
}: BtnI) => {
  return (
    <Button
      className={`${classNames}`}
      not_rounded
      disabled={disabled}
      onClick={onClick}
    >
      {text}
      {loading && <Loading />}
    </Button>
  );
};

export default CustomButton;
