import QuestionGroup from "./QuestionGroup";
import { Question } from "./types";
import { TabBar } from "./TabBar"; // Import the TabBar component
import { useAppStore } from "./store";
import { useState } from "react";

export const QuestionList: React.FC = () => {
  const { questions, setQuestions } = useAppStore();

  const [activeTab, setActiveTab] = useState(0);
  // Function to update the answer to a question
  const handleAnswerChange = (id: number, answer: string) => {
    const newQuestions = questions.map(
      (q: Question): Question => (q.id === id ? { ...q, answer } : q)
    );
    setQuestions(newQuestions);
  };

  const answeredQuestions = questions.filter((q) => q.answer?.trim());
  const unansweredQuestions = questions.filter((q) => !q.answer?.trim());

  // Tab labels for the TabBar
  const tabs = [
    `Unanswered Questions (${unansweredQuestions.length})`,
    `Answered Questions (${answeredQuestions.length})`,
  ];

  return (
    <div>
      <h2>Questions</h2>

      {/* Use TabBar component to switch between tabs */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {/* Tab Content */}
      <div>
        {activeTab === 0 && (
          <QuestionGroup
            questions={unansweredQuestions}
            handleAnswerChange={handleAnswerChange}
          />
        )}
        {activeTab === 1 && (
          <QuestionGroup
            questions={answeredQuestions}
            handleAnswerChange={handleAnswerChange}
          />
        )}
      </div>
    </div>
  );
};
