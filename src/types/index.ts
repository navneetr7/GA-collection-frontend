export interface Question {
  type: 'text' | 'single' | 'multiple' | 'file';
  question: string;
  choices?: string[];
  answer?: string | string[];
  answered: boolean;
}

export interface CustomFormData {
  uuid: string;
  ticket_id: string;
  customer_email: string;
  questions: Question[];
  status: 'pending' | 'completed' | 'partial';
  total_upload_size: number;
  created_at: string;
}

export interface MagicLink {
  ticket_id: string;
  customer_email: string;
  magic_link: string;
  status: string;
  created_at: string;
}