import { HNPost, Question, Tag } from "../types";

type PostArguments = {
  service: any;
  text: string;
  posts: HNPost[];
  questions: Question[];
  keywords: Tag[];
};

const getPostPrompt = (
  text: string,
  posts: HNPost[],
  questions: Question[],
  keywords: Tag[]
) =>
  `
Your task is to generate optimized titles and bodies for for a Hacker News post using a specified response.  Use the raw data, related posts, answered questions and keywords as inspiration to craft optimized post titles and bodies according to the supplied instructions.

Try to conform to the structure and style of the related posts closely while highlighting the special aspects of this specific post.  For example, if the related posts are mostly Show HN or Launch HN posts, use that style.

## Title instructions

Be Clear and Direct: Focus on clarity and accuracy, explaining exactly what the post is about without excessive embellishment. Titles that are too clever or ambiguous often get ignored.

Spark Curiosity Without Clickbait: Use a title that piques interest but stays grounded in facts. Avoid sensationalism, but do make readers want to learn more by hinting at the core problem or insight.

Use Numbers or Data When Relevant: Including specifics, such as "5 Lessons I Learned From Scaling Our SaaS," can grab attention and set expectations without feeling forced.

Frame It as a Problem-Solving Narrative: Titles that suggest a personal challenge or technical problem, like "How We Solved X Problem Using Y Approach," resonate with HN readers because they promise a story with practical takeaways.

Tailor to a Tech-Savvy Audience: HN users appreciate intellectual depth. Avoid marketing jargon and speak to your audience as peers—engineers, entrepreneurs, and problem solvers who value substance over style.

If the related posts contain many Show HN or Launch HN posts and it looks like the user is trying to make a Show HN or Launch HN post, make sure to prefix the title with the correct label (i.e. "Show HN: ..." or "Launch HN: ...").

## Body instructions

Get to the Point Quickly: Start with the key insight, problem, or idea. HN users prefer concise, information-rich content. Avoid unnecessary introductions or lengthy backstories.

Explain Why It Matters: Address why your post or solution is relevant. Whether it's a technical solution or personal insight, clarify the problem you’re solving and its broader impact.

Support with Data or Examples: HN readers appreciate posts that back up claims with concrete evidence, data, or examples. Use real numbers, code snippets, or practical examples to illustrate your point.

Be Honest and Transparent: Be straightforward about limitations, failures, or what didn't work. HN users value authenticity and open discussions around challenges and setbacks.

Encourage Engagement: Ask thoughtful questions or invite feedback to spark a discussion. HN thrives on community dialogue, so engaging the audience in a meaningful way can boost your post's success.

Most importantly, use a natural and somewhat conversational writing style, people tend to stop paying attention when a post looks like it was AI generated.

## Response format

{ titles: ["title 1", "title 2", "title 3"], bodies: ["post body 1", "post body 2", "post body 3"] }

## Raw data

${text}

## Keywords

${keywords.join(", ")}

## Questions

${JSON.stringify(questions)}

## Related posts

${JSON.stringify(posts)}

---
Now, please generate ten high-impact titles and three bodies and return them as a JSON object
`;

const systemPrompt =
  "Always respond only with a JSON object using the specified response format. Do not include any additional text or explanation, and do not return any other format but valid JSON.";

export const getSuggestedPosts = async ({
  service,
  text,
  posts,
  keywords,
  questions,
}: PostArguments): Promise<{ titles: string[]; bodies: string[] }> => {
  const message = getPostPrompt(text, posts, questions, keywords);
  const content = await service.batchText(message, systemPrompt, false);
  const data: { titles: string[]; bodies: string[] } = JSON.parse(content);
  return data;
};
