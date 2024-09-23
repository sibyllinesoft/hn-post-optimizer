export type Question = {
  id: number;
  text: string;
  answer: string;
};

// Define the tag structure as per react-tag-input's expectations
export type Tag = {
  id: string;
  text: string;
};

// Type for the highlight result in a post
type HighlightResult = {
    value: string;
    matchLevel: string;
    matchedWords: string[];
  };
  
  // Type for the structure of a single post
  export type HNPost = {
    title: string;
    url: string;
    author: string;
    points: number;
    story_text: string | null;
    comment_text: string | null;
    _tags: string[];
    num_comments: number;
    objectID: string;
    _highlightResult: {
      title: HighlightResult;
      url: HighlightResult;
      author: HighlightResult;
    };
  };
  
  // Type for the overall search response from Hacker News
  export type HNSearchResponse = {
    hits: HNPost[];
    page: number;
    nbHits: number;
    nbPages: number;
    hitsPerPage: number;
    processingTimeMS: number;
    query: string;
    params: string;
  };

  export type SuggestedTitle = {
    id: number;
    content: string;
  }

  export type SuggestedBody = {
    id: number;
    content: string;
  }
  
