import { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const draftSchema = z.object({
  applicationId: z.string().optional(),
  department: z.string(),
  departmentId: z.string().optional(),
  query: z.string(),
  subject: z.string().optional(),
  applicantDetails: z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    pan: z.string().optional(),
  }).optional(),
  language: z.string(),
  templateId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const data = draftSchema.parse(body)

    // If we have an applicationId, update existing draft
    if (data.applicationId) {
      await prisma.rTI.update({
        where: { id: data.applicationId },
        data: {
          content: data.query,
          department: data.department,
          departmentId: data.departmentId,
          subject: data.subject,
          language: data.language,
          templateId: data.templateId,
          applicantDetails: data.applicantDetails,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new draft
      await prisma.rTI.create({
        data: {
          userId: session.user.id,
          content: data.query,
          department: data.department,
          departmentId: data.departmentId,
          subject: data.subject,
          language: data.language,
          templateId: data.templateId,
          applicantDetails: data.applicantDetails,
          status: 'DRAFT',
        },
      })
    }

    return new Response('Draft saved', { status: 200 })
  } catch (error) {
    console.error('Auto-save error:', error)
    return new Response('Failed to save draft', { status: 500 })
  }
} 