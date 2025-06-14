import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  is_active: boolean
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createClient()
        
        const { data, error: fetchError } = await supabase
          .from('departments')
          .select('id, name, code, description, is_active')
          .eq('is_active', true)
          .order('name')

        if (fetchError) {
          throw fetchError
        }

        setDepartments(data || [])
      } catch (err) {
        console.error('Error fetching departments:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch departments')
        
        // Fallback to hardcoded departments if fetch fails
        setDepartments([
          { 
            id: '1', 
            name: "Education Department", 
            code: "EDU", 
            description: "Education policy and programs",
            is_active: true 
          },
          { 
            id: '2', 
            name: "Health Department", 
            code: "HEALTH", 
            description: "Health policy and programs",
            is_active: true 
          },
          { 
            id: '3', 
            name: "Public Works Department", 
            code: "PWD", 
            description: "Public infrastructure and works",
            is_active: true 
          },
          { 
            id: '4', 
            name: "Revenue Department", 
            code: "REV", 
            description: "Revenue and taxation",
            is_active: true 
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  return { departments, loading, error }
} 