import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReviewResult } from "@/lib/ai/providers";

interface ReviewState {
  // Current review form state
  code: string;
  language: string;
  title: string;
  provider: string;
  model: string;
  context: string;

  // Review result
  result: ReviewResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTitle: (title: string) => void;
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  setContext: (context: string) => void;
  setResult: (result: ReviewResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  code: "",
  language: "auto",
  title: "",
  provider: "openai",
  model: "gpt-4o",
  context: "",
  result: null,
  isLoading: false,
  error: null,
};

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      ...initialState,

      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),
      setTitle: (title) => set({ title }),
      setProvider: (provider) => set({ provider }),
      setModel: (model) => set({ model }),
      setContext: (context) => set({ context }),
      setResult: (result) => set({ result }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: "joyviews-review",
      partialize: (state) => ({
        provider: state.provider,
        model: state.model,
        language: state.language,
      }),
    }
  )
);
