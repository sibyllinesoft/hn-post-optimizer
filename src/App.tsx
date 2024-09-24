import "./App.css";
import ktIcon from "./assets/icon.png";
import { useEffect } from "react";
import { KEYTRUSTEE_URL, APPLICATION_ID } from "./config";
import { useAppStore } from "./store";
import { Logo } from "./logo";
import { KeyTrusteeModal } from "./Modal";
import {
  CompanyInfoTab,
  RelatedPostsTab,
  QuestionsTab,
  SuggestedPostTab,
} from "./tabs";
import { TabBar } from "./TabBar";

function App() {
  const {
    adapter,
    isModalOpen,
    activeTab,
    setActiveTab,
    closeModal,
    initializeAdapter,
  } = useAppStore();

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin !== KEYTRUSTEE_URL) return;
      if (event.data && event.data.type === "LOGIN_SUCCESS") {
        const sessionId = event.data.sessionId;
        initializeAdapter(sessionId);
      }
    });
  }, [initializeAdapter]);

  const openKeyTrustee = () => {
    const newWindow = window.open(
      `${KEYTRUSTEE_URL}?application_id=${APPLICATION_ID}`,
      "_blank",
      "noopener=false"
    );
    if (newWindow) newWindow.focus();
  };

  // Define the tab labels
  const tabs = [
    "Company Info",
    "Related Posts",
    "Questions",
    "Suggested Title/Body",
  ];

  return (
    <>
      <Logo />
      {!adapter ? (
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <div>
            This site uses <a href="https://keytrustee.org/">Key Trustee</a> to
            securely provide AI inference using your existing API keys. Click
            the button and enable AI for the Hacker News Post Optimizer once
            you've logged in.
          </div>
          <button
            onClick={openKeyTrustee}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgb(0, 122, 204)",
              color: "white",
              fontWeight: 700,
              borderRadius: 3,
              border: "none",
              gap: "8px",
              padding: "10px 20px",
            }}
          >
            <img src={ktIcon} alt="KT Icon" style={{ height: "24px" }} />
            Create Session
          </button>
        </div>
      ) : null}
      {/* Use the TabBar component */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {/* Tab Content */}
      <div style={{ padding: 10, paddingBottom: 10 }}>
        {activeTab === 0 && <CompanyInfoTab />}
        {activeTab === 1 && <RelatedPostsTab />}
        {activeTab === 2 && <QuestionsTab />}
        {activeTab === 3 && <SuggestedPostTab />}
      </div>
      <KeyTrusteeModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
}

export default App;
