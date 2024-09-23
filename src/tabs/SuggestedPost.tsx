import { TabBar } from "../TabBar"; // Import the TabBar component
import copyIcon from "../assets/copy-icon.svg"; // Add your copy icon path
import assistantAvatar from "../assets/robot.png"; // Add your assistant avatar path
import { IconButton } from "../IconButton"; // Use the IconButton component
import { useAppStore } from "../store";
import { useState } from "react";

export const SuggestedPostTab: React.FC = () => {
  const {
    createSuggestedPosts,
    suggestedTitles,
    suggestedBodies,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState(0);
  // Create tab labels based on the number of suggested bodies (e.g., Version 1, Version 2, ...)
  const bodyTabs = suggestedBodies.map((_, index) => `Version ${index + 1}`);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div>
      {/* Flex container for the instruction text and button */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <div style={{ flexGrow: 1, marginRight: "20px", textAlign: "justify" }}>
          Almost there! If you're happy with the info you've provided, click the
          button to generate title and body suggestions.
        </div>

        {/* Use the IconButton component to generate suggestions */}
        <IconButton
          text="Generate Suggestions"
          onClick={() => createSuggestedPosts()} // Replace this with your generate function
          iconSrc={assistantAvatar}
        />
      </div>

      {/* Conditionally render suggested titles and bodies if they exist */}
      {suggestedTitles.length > 0 && (
        <>
          <label
            htmlFor="suggestedTitles"
            style={{
              fontWeight: "bold",
              marginBottom: "10px",
              display: "block",
            }}
          >
            Title Suggestions
          </label>
          <ul
            id="suggestedTitles"
            style={{ listStyleType: "none", padding: 0 }}
          >
            {suggestedTitles.map((title) => (
              <li
                key={title.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "5px",
                }}
              >
                <span>{title.content}</span>
                <img
                  src={copyIcon}
                  alt="Copy"
                  style={{ cursor: "pointer", width: "16px" }}
                  onClick={() => copyToClipboard(title.content)}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {suggestedBodies.length > 0 && (
        <>
          <label
            htmlFor="suggestedBody"
            style={{
              fontWeight: "bold",
              marginBottom: "10px",
              display: "block",
            }}
          >
            Body Suggestions
          </label>

          {/* Use the TabBar component for navigating between suggested bodies */}
          <TabBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={bodyTabs}
          />

          {/* Content for active body with copy icon */}
          <div
            id="suggestedBody"
            style={{
              position: "relative",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              marginTop: "10px",
              minHeight: "150px",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            {suggestedBodies[activeTab] && suggestedBodies[activeTab].content}

            {/* Copy icon for body content in the top-right corner */}
            <img
              src={copyIcon}
              alt="Copy"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                width: "16px",
              }}
              onClick={() =>
                copyToClipboard(suggestedBodies[activeTab].content)
              }
            />
          </div>
        </>
      )}
    </div>
  );
};
