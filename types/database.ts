// Database types to ensure consistency
export interface Department {
  id: string
  name: string
  code: string
  description: string | null
  parent_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RTITemplate {
  id: string
  title: string
  description: string | null
  category: string
  template_content: string
  language_code: string
  tags: string[]
  is_active: boolean
  is_featured: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface RTIApplication {
  id: string
  application_number: string | null
  user_id: string
  department_id: string | null
  department_name: string
  subject: string
  content: string
  status: string
  language_code: string
  template_id: string | null
  applicant_details: {
    name: string
    address: string
    phone?: string
    email?: string
    pan?: string
  }
  metadata: Record<string, any>
  is_public: boolean
  created_at: string
  updated_at: string
  submitted_at: string | null
}

export interface RTIAttachment {
  id: string
  application_id: string
  file_name: string
  file_type: string
  file_size: number
  file_path: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface RTIResponse {
  id: string
  application_id: string
  response_type: string
  content: string
  responded_by: string | null
  responded_at: string
  metadata: Record<string, any>
}

export interface RTIAnalytics {
  id: string
  event_type: string
  user_id: string | null
  department_name: string | null
  language_code: string | null
  event_data: Record<string, any>
  created_at: string
}
