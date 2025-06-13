export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          type: 'anonymous' | 'authenticated'
          full_name: string | null
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          type?: 'anonymous' | 'authenticated'
          full_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'anonymous' | 'authenticated'
          full_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          parent_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          content: string
          language_code: string
          tags: string[]
          is_active: boolean
          is_featured: boolean
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          content: string
          language_code?: string
          tags?: string[]
          is_active?: boolean
          is_featured?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          content?: string
          language_code?: string
          tags?: string[]
          is_active?: boolean
          is_featured?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          application_number: string | null
          profile_id: string
          department_id: string | null
          department_name: string
          subject: string
          content: string
          status: 'draft' | 'submitted' | 'pending' | 'responded' | 'rejected' | 'closed'
          language_code: string
          template_id: string | null
          applicant_details: Json
          metadata: Json
          is_public: boolean
          created_at: string
          updated_at: string
          submitted_at: string | null
        }
        Insert: {
          id?: string
          application_number?: string | null
          profile_id: string
          department_id?: string | null
          department_name: string
          subject: string
          content: string
          status?: 'draft' | 'submitted' | 'pending' | 'responded' | 'rejected' | 'closed'
          language_code?: string
          template_id?: string | null
          applicant_details: Json
          metadata?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
        }
        Update: {
          id?: string
          application_number?: string | null
          profile_id?: string
          department_id?: string | null
          department_name?: string
          subject?: string
          content?: string
          status?: 'draft' | 'submitted' | 'pending' | 'responded' | 'rejected' | 'closed'
          language_code?: string
          template_id?: string | null
          applicant_details?: Json
          metadata?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
        }
      }
      attachments: {
        Row: {
          id: string
          application_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      responses: {
        Row: {
          id: string
          application_id: string
          response_type: string
          content: string
          responded_by: string | null
          responded_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          application_id: string
          response_type: string
          content: string
          responded_by?: string | null
          responded_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          application_id?: string
          response_type?: string
          content?: string
          responded_by?: string | null
          responded_at?: string
          metadata?: Json
        }
      }
      analytics: {
        Row: {
          id: string
          event_type: string
          profile_id: string | null
          department_name: string | null
          language_code: string | null
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          profile_id?: string | null
          department_name?: string | null
          language_code?: string | null
          event_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          profile_id?: string | null
          department_name?: string | null
          language_code?: string | null
          event_data?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      rti_status: 'draft' | 'submitted' | 'pending' | 'responded' | 'rejected' | 'closed'
      user_type: 'anonymous' | 'authenticated'
    }
  }
} 