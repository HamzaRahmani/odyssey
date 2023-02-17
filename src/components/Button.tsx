import React from "react";

interface ButtonProps {
  text: string;
  onClick: Function;
}

const Button = ({ onClick, text }: ButtonProps) => {
  return <button onClick={() => onClick()}>{text}</button>;
};

export default Button;
