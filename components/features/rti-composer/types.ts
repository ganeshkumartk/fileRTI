export type ComposerMode = 'manual' | 'generate' | 'combined';

export interface Department {
  id: string;
  name: string;
}

export interface ApplicantData {
  name?: string;
  email?: string;
  contact?: string;
  address?: string;
}

export interface ComplianceResult {
  score: number;
  issues: string[];
} 