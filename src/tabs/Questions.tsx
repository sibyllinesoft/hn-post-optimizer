import assistantAvatar from "../assets/robot.png";
import { QuestionList } from "../QuestionList";
import { useAppStore } from "../store";
import { IconButton } from "../IconButton";

export const QuestionsTab = () => {
  const { questions, generateQuestions, setActiveTab } = useAppStore();

  const baseStyle = questions.length > 0 ? { height: "85vh" } : {};

  return (
    <div style={{ ...baseStyle, display: "flex", flexDirection: "column" }}>
      {/* Flex container for the paragraph and button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "20px",
        }}
      >
        <div style={{ flexGrow: 1, marginRight: "20px", textAlign: "justify" }}>
          Our post optimizer engages with you through targeted questions to help
          the model gain a deep understanding of your product or service's value
          proposition, special features, and unique benefits. Your answers will
          help generate a compelling and tailored post that resonates with your
          audience and highlights what makes your offering stand out.
        </div>

        {/* Use the IconButton component */}
        <IconButton
          text="Get Questions"
          onClick={generateQuestions}
          iconSrc={assistantAvatar}
        />
      </div>

      {questions.length ? (
        <div
          style={{
            flexGrow: 1, // Allow the question list to grow
            overflowY: "auto", // Enable scrolling when questions exceed the container
            border: "1px solid #ccc",
            margin: "0 20px 20px 20px",
            padding: "10px",
            boxSizing: "border-box",
          }}
        >
          <QuestionList />
        </div>
      ) : null}

      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}
      >
        <button className="action-button" onClick={() => setActiveTab(3)}>
          Next
        </button>
      </div>
    </div>
  );
};
