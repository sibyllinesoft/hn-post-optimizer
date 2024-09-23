import { Tag } from "../types";

type KeywordArguments = {
  service: any;
  text: string;
  keywords?: Tag[];
};

const getKeywordsPrompt = (text: string) =>
  `
Your task is to analyze the supplied text and extracts important keywords, topics, and concepts from it.  These keywords will be used to guide users to find relevant example hacker news posts to use as examples for a successful post.

Select a maximum of 5 keywords, choosing the ones that are the most central to the supplied text.  If there aren't 5 keywords that are central to the text and useful or informative, you may return fewer keywords.

The format of your response should be:

["keyword1", "keyword2", "keyword3", ...]

Here are some examples to guide you:

Example 1:
Input: "The economic growth of countries is largely influenced by international trade, market competition, and technological advancements."
Output: ["economic growth", "international trade", "market competition", "technological advancements"]

Example 2:
Input: "Climate change is one of the most pressing global challenges. It affects ecosystems, human health, and economies worldwide."
Output: ["climate change", "global challenges", "ecosystems", "human health", "economies"]

Example 3:
Input: "Artificial intelligence and machine learning are revolutionizing industries such as healthcare, finance, and transportation."
Output: ["artificial intelligence", "machine learning", "healthcare", "finance", "transportation"]

Example 4:
Input: "Social media platforms have changed how people communicate and consume information, influencing public opinion and personal relationships."
Output: ["social media platforms", "communication", "information consumption", "public opinion", "personal relationships"]

Now, please extract the keywords from the following text and return them in JSON format:

${text}
`;

const getKeywordsPromptExtension = (keywords: Tag[]) =>
  `

The user has already selected the following key words to guide your analysis, use them to select new keywords:

${JSON.stringify(keywords)}
`;

const systemPrompt = "Always respond only with a JSON array of strings. Do not include any additional text or explanation, and do not return any other format but valid JSON.";

export const getKeywords = async ({
  service,
  text,
  keywords,
}: KeywordArguments) => {
  const message = keywords?.length
    ? getKeywordsPrompt(text) + getKeywordsPromptExtension(keywords)
    : getKeywordsPrompt(text);
  const content = await service.batchText(message, systemPrompt, false);
  const newKeywords = JSON.parse(content);
  return newKeywords.map((kw: string) => ({ id: kw, text: kw }))
};


