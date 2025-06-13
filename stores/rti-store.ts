import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase"
import { Database } from "@/types/supabase"

type Application = Database['public']['Tables']['applications']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface ApplicantDetails {
  name: string
  address?: string
  phone?: string
  email?: string
  pan?: string
}

interface RTIStore {
  draft: {
    applicationId?: string
    department?: string
    departmentId?: string
    query: string
    subject?: string
    applicantDetails: ApplicantDetails
    language: string
    templateId?: string
  }
  updateDraft: (updates: Partial<RTIStore["draft"]>) => void
  clearDraft: () => void
  saveDraft: (profile: Profile) => Promise<void>
  loadDraft: (applicationId: string) => Promise<void>
}

export const useRTIStore = create<RTIStore>()(
  persist(
    (set, get) => ({
      draft: {
        query: "",
        language: "en",
        applicantDetails: {
          name: "",
        },
      },
      updateDraft: (updates) =>
        set((state) => ({
          draft: { ...state.draft, ...updates },
        })),
      clearDraft: () =>
        set({
          draft: {
            query: "",
            language: "en",
            applicantDetails: {
              name: "",
            },
          },
        }),
      saveDraft: async (profile) => {
        const { draft } = get()
        if (!draft.query.trim() || !draft.department) return

        const applicationData = {
          profile_id: profile.id,
          department_name: draft.department,
          department_id: draft.departmentId,
          subject: draft.subject || 'RTI Application',
          content: draft.query,
          language_code: draft.language,
          template_id: draft.templateId,
          applicant_details: draft.applicantDetails,
          status: 'draft' as const,
        }

        try {
          if (draft.applicationId) {
            // Update existing draft
            const { error } = await supabase
              .from('applications')
              .update(applicationData)
              .eq('id', draft.applicationId)

            if (error) throw error
          } else {
            // Create new draft
            const { data, error } = await supabase
              .from('applications')
              .insert(applicationData)
              .select()
              .single()

            if (error) throw error
            if (data) {
              set((state) => ({
                draft: { ...state.draft, applicationId: data.id },
              }))
            }
          }
        } catch (error) {
          console.error('Error saving draft:', error)
          throw error
        }
      },
      loadDraft: async (applicationId) => {
        try {
          const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('id', applicationId)
            .single()

          if (error) throw error
          if (!data) throw new Error('Application not found')

          set({
            draft: {
              applicationId: data.id,
              department: data.department_name,
              departmentId: data.department_id,
              query: data.content,
              subject: data.subject,
              applicantDetails: data.applicant_details as ApplicantDetails,
              language: data.language_code,
              templateId: data.template_id,
            },
          })
        } catch (error) {
          console.error('Error loading draft:', error)
          throw error
        }
      },
    }),
    {
      name: "rti-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
)
