import { Question } from "../types";

type QuestionsArguments = {
  service: any;
  text: string;
  questions?: Question[];
};

const getQuestionsPrompt = (text: string) =>
  `
Your task is to generate insightful questions that will help the user create a compelling Hacker News post. Focus on questions that clarify key details, highlight the value, and engage the audience.

Your response must be in the following format:

json
Copy code
[{ "text": "question 1" }, { "text": "question 2" }, ...]
Here are some examples to guide you:

Example 1:
Input: "The economic growth of countries is largely influenced by international trade, market competition, and technological advancements."
Output:
[
  { "text": "How does international trade drive economic growth?" },
  { "text": "What role does market competition play in national growth?" },
  { "text": "How are technological advancements influencing economies?" }
]

Example 2:
Input: "Climate change is one of the most pressing global challenges. It affects ecosystems, human health, and economies worldwide."
Output:
[
  { "text": "How is climate change impacting ecosystems?" },
  { "text": "What are the human health risks associated with climate change?" },
  { "text": "How is climate change affecting global economies?" }
]

Example 3:
Input: "Artificial intelligence and machine learning are revolutionizing industries such as healthcare, finance, and transportation."
Output:
[
  { "text": "How is AI transforming the healthcare industry?" },
  { "text": "What are the applications of machine learning in finance?" },
  { "text": "How is AI impacting transportation technologies?" }
]

Now, please generate high-impact questions for the following text and return them as a JSON array:

${text}
`;

const getQuestionsPromptExtension = (questions: Question[]) =>
  `

The user has already answered the following questions, consider them and identify questions yet to be asked that might help craft a successful hacker news post in your reply:

${JSON.stringify(questions)}
`;

const systemPrompt =
  "Always respond only with a JSON array of strings. Do not include any additional text or explanation, and do not return any other format but valid JSON.";

export const getQuestions = async ({
  service,
  text,
  questions,
}: QuestionsArguments) => {
  const answered = questions?.filter((q) => q.answer);
  const message = answered?.length
    ? getQuestionsPrompt(text) + getQuestionsPromptExtension(answered)
    : getQuestionsPrompt(text);
  const content = await service.batchText(message, systemPrompt, false);
  const qObjs: { text: string }[] = JSON.parse(content);
  return qObjs.map((q, i: number) => ({ ...q, id: i }));
};
