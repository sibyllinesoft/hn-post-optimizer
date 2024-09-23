import React from "react";

type TabBarProps = {
  activeTab: number;
  setActiveTab: (tabIndex: number) => void;
  tabs: string[]; // Array of tab labels
};

export const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginBottom: 10
      }}
    >
      {tabs.map((tab, index) => (
        <button
          key={index}
          style={{
            flex: 1,
            padding: "6px",
            cursor: "pointer",
            border: "none",
            color: activeTab === index ? "rgb(204, 82, 0)" : "rgba(0, 0, 0, 0.5)",
            borderBottom: `2px solid ${
              activeTab === index ? "rgb(204, 82, 0)" : "rgba(0, 0, 0, 0.5"
            }`, // Active tab border color vs inactive
            fontWeight: activeTab === index ? 700 : 400, // Bold font if active
            backgroundColor: "transparent", // No background color
          }}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
