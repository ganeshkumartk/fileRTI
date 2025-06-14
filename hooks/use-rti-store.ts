import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ApplicantDetails {
  name: string;
  email: string;
  contact: string;
  address?: string;
}

interface RTIDraft {
  title: string;
  query: string;
  content: string;
  departmentId?: string;
  language: string;
  applicantDetails?: ApplicantDetails;
  templateId?: number;
}

interface RTIStore {
  draft: RTIDraft;
  isGuestMode: boolean;
  guestSessionId: string;
  
  // Actions
  updateDraft: (updates: Partial<RTIDraft>) => void;
  clearDraft: () => void;
  setApplicantDetails: (details: ApplicantDetails) => void;
  setGuestMode: (isGuest: boolean) => void;
  loadTemplate: (templateContent: string, templateId: number) => void;
}

const defaultDraft: RTIDraft = {
  title: "",
  query: "",
  content: "",
  language: "en",
};

export const useRTIStore = create<RTIStore>()(
  persist(
    (set, get) => ({
      draft: defaultDraft,
      isGuestMode: true,
      guestSessionId: crypto.randomUUID(),
      
      updateDraft: (updates) =>
        set((state) => ({
          draft: { ...state.draft, ...updates },
        })),
      
      clearDraft: () =>
        set({
          draft: defaultDraft,
        }),
      
      setApplicantDetails: (details) =>
        set((state) => ({
          draft: {
            ...state.draft,
            applicantDetails: details,
          },
        })),
      
      setGuestMode: (isGuest) =>
        set({
          isGuestMode: isGuest,
          guestSessionId: isGuest ? crypto.randomUUID() : "",
        }),
      
      loadTemplate: (templateContent, templateId) =>
        set((state) => ({
          draft: {
            ...state.draft,
            content: templateContent,
            templateId: templateId,
          },
        })),
    }),
    {
      name: "rti-store",
      partialize: (state) => ({
        draft: state.draft,
        isGuestMode: state.isGuestMode,
        guestSessionId: state.guestSessionId,
      }),
    }
  )
); 