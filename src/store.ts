import { create } from "zustand";
import { getKeywords, getQuestions, getSuggestedPosts } from "./prompts"; // Assuming getSuggestedPosts is your query function for suggested posts
import { searchHNPosts } from "./hnSearch";
import { APPLICATION_ID } from "./config";
import { createAdapter } from "./adapters";
import { Tag, Question, HNPost, SuggestedTitle, SuggestedBody } from "./types";

// Define types for the store state and actions
type AppState = {
  adapter: any | null;
  isModalOpen: boolean;
  details: string;
  tags: Tag[];
  questions: Question[];
  suggestedTitles: SuggestedTitle[];
  suggestedBodies: SuggestedBody[];
  goodRelatedPosts: HNPost[];
  badRelatedPosts: HNPost[];
  relevantPosts: Record<string, boolean>; // Object to track relevant/irrelevant posts
  activeTab: number;

  // Actions
  setAdapter: (adapter: any) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setDetails: (details: string) => void;
  setTags: (tags: Tag[]) => void;
  setQuestions: (questions: Question[]) => void;
  setSuggestedTitles: (titles: SuggestedTitle[]) => void;
  setSuggestedBodies: (bodies: SuggestedBody[]) => void;
  setGoodRelatedPosts: (posts: any[]) => void;
  setBadRelatedPosts: (posts: any[]) => void;
  markAsIrrelevant: (postId: string) => void;
  markAsRelevant: (postId: string) => void;
  setActiveTab: (tabIndex: number) => void;
  getGoodRelatedPosts: () => Promise<void>;
  getBadRelatedPosts: () => Promise<void>;
  generateTags: () => Promise<void>;
  generateQuestions: () => Promise<void>;
  createSuggestedPosts: () => Promise<void>; // New action for suggested posts
  openModal: () => void;
  closeModal: () => void;
  initializeAdapter: (sessionId: string) => void;
};

// Create Zustand store
export const useAppStore = create<AppState>((set, get) => ({
  adapter: null,
  isModalOpen: false,
  details: "",
  tags: [],
  questions: [],
  suggestedTitles: [],
  suggestedBodies: [],
  goodRelatedPosts: [],
  badRelatedPosts: [],
  relevantPosts: {}, // Initialize as an empty object for relevance
  activeTab: 0,

  // Actions
  setAdapter: (adapter: any) => set({ adapter }),
  setIsModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
  setDetails: (details: string) => set({ details }),
  setTags: (tags: Tag[]) => set({ tags }),
  setQuestions: (questions: Question[]) => set({ questions }),
  setSuggestedTitles: (titles: SuggestedTitle[]) =>
    set({ suggestedTitles: titles }),
  setSuggestedBodies: (bodies: SuggestedBody[]) =>
    set({ suggestedBodies: bodies }),
  setGoodRelatedPosts: (posts: any[]) => set({ goodRelatedPosts: posts }),
  setBadRelatedPosts: (posts: any[]) => set({ badRelatedPosts: posts }),

  // Mark a post as irrelevant
  markAsIrrelevant: (postId: string) => {
    const { relevantPosts } = get();
    set({ relevantPosts: { ...relevantPosts, [postId]: false } });
  },

  // Mark a post as relevant
  markAsRelevant: (postId: string) => {
    const { relevantPosts } = get();
    set({ relevantPosts: { ...relevantPosts, [postId]: true } });
  },

  setActiveTab: (tabIndex: number) => set({ activeTab: tabIndex }),

  getGoodRelatedPosts: async () => {
    const { tags } = get();
    const goodPosts = await searchHNPosts(tags.map((t) => t.text)); // Assume good posts come from general tag search
    set({ goodRelatedPosts: goodPosts });
  },

  getBadRelatedPosts: async () => {
    const { tags } = get();
    const badPosts = await searchHNPosts(tags.map((t) => t.text)); // Adjust logic if needed to fetch "bad" posts
    set({ badRelatedPosts: badPosts });
  },

  generateTags: async () => {
    const { adapter, details, tags } = get();
    if (adapter) {
      const newTags = await getKeywords({
        service: adapter,
        text: details,
        keywords: tags,
      });
      set({ tags: [...tags, ...newTags] });
    }
  },

  generateQuestions: async () => {
    const { adapter, details, questions } = get();
    if (adapter) {
      const newQuestions = await getQuestions({
        service: adapter,
        text: details,
        questions,
      });
      set({ questions: [...questions, ...(newQuestions as any)] });
    }
  },

  // New Action: createSuggestedPosts
  createSuggestedPosts: async () => {
    const {
      adapter,
      details,
      questions: baseQuestions,
      tags: keywords,
      goodRelatedPosts,
      relevantPosts,
    } = get();
    if (adapter) {
      const posts = goodRelatedPosts.filter(p => relevantPosts[p.objectID]);
      const questions = baseQuestions.filter(q => q.answer);

      const result = await getSuggestedPosts({
        service: adapter,
        text: details,
        keywords,
        questions,
        posts,
      });
      set({
        suggestedTitles: result.titles.map((content, id) => ({ content, id })),
        suggestedBodies: result.bodies.map((content, id) => ({ content, id })),
      });
    }
  },

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  initializeAdapter: (sessionId: string) => {
    const applicationId = APPLICATION_ID;
    const adapter = createAdapter({
      sessionId,
      applicationId,
      openModal: () => get().openModal(), // Using Zustand's get to call openModal
    });
    set({ adapter });
  },
}));
