import Question from "./Question";

interface QuestionType {
  id: number;
  text: string;
  answer: string;
}

interface QuestionGroupProps {
  questions: QuestionType[];
  handleAnswerChange: (id: number, answer: string) => void;
}

const QuestionGroup: React.FC<QuestionGroupProps> = ({
  questions,
  handleAnswerChange,
}) => {

  return (
    <div>
      <div style={{ overflowY: "auto" }}>
        <>
          {questions.map((question) => (
            <div key={question.id}>
              <Question
                question={question}
                handleAnswerChange={handleAnswerChange}
              />
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default QuestionGroup;
