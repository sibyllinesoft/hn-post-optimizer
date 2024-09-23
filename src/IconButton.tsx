import React, { useState } from "react";
import loadingSpinner from "./assets/loading-spinner.svg"; // Assume you have a loading spinner icon
import errorIcon from "./assets/error.svg"; // Assume you have an error icon

type IconButtonProps = {
  text: string;
  onClick: () => Promise<void>; // Make the onClick async
  iconSrc: string;
};

export const IconButton: React.FC<IconButtonProps> = ({
  text,
  onClick,
  iconSrc,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      await onClick();
    } catch (error) {
      console.error("Error occurred:", error);
      setIsError(true); // Set to error state if an exception is thrown
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  };

  const displayIcon = isLoading
    ? loadingSpinner
    : isError
    ? errorIcon
    : iconSrc;

  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        padding: "5px 20px",
        cursor: "pointer",
        border: "none",
        backgroundColor: "rgb(204, 82, 0)",
        color: "rgb(0, 0, 0)",
        fontWeight: 700,
        borderRadius: "5px",
        whiteSpace: "nowrap", // Prevent text wrapping
      }}
    >
      <img
        src={displayIcon}
        alt="Icon"
        style={{ width: 32, marginRight: "8px" }}
      />
      <span>{text}</span>
    </button>
  );
};
