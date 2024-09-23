import React, { useState } from "react";
import { Question } from "./types";

type QuestionProps = {
  question: Question;
  handleAnswerChange: (id: number, answer: string) => void;
}

const QuestionBox: React.FC<QuestionProps> = ({
  question,
  handleAnswerChange,
}) => {
  const [answer, setAnswer] = useState(question.answer);

  const handleBlur = () => {
    handleAnswerChange(question.id, answer);
  };

  return (
    <div style={{ marginBottom: '20px', textAlign: "left" }}>
      <label htmlFor={`question-${question.id}`} style={{ display: 'block', marginBottom: '5px' }}>
        {question.text}
      </label>
      <textarea
        id={`question-${question.id}`}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onBlur={handleBlur}
        placeholder="Type your answer here"
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
    </div>
  );
};

export default QuestionBox;
