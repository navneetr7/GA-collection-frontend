'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import AgentTicketDetails from '@/components/AgentTicketDetails';
import { use } from 'react';
import { CustomFormData } from '@/types';

export default function TicketDetails({ params }: { params: Promise<{ ticket_id: string }> }) {
  const { ticket_id } = use(params);
  const [forms, setForms] = useState<CustomFormData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`/api/ticket-responses/${ticket_id}`);
        setForms(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load responses');
        setLoading(false);
      }
    };
    fetchResponses();
  }, [ticket_id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-ga-white rounded-lg shadow-md">
      {forms.map((form) => (
        <AgentTicketDetails key={form.uuid} form={form} />
      ))}
    </div>
  );
}