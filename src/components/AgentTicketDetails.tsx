'use client';

import { CustomFormData } from '@/types';
import { useState } from 'react';
import axios from 'axios';

interface Props {
  form: CustomFormData;
}

export default function AgentTicketDetails({ form }: Props) {
  const [fileUrls, setFileUrls] = useState<{ [key: number]: { url: string; filename: string } }>({});
  const [isDownloading, setIsDownloading] = useState<{ [key: number]: boolean }>({});

  const getFilename = (answer: string) => {
    if (answer.startsWith('http')) {
      const urlParts = answer.split('/');
      return decodeURIComponent(urlParts[urlParts.length - 1].split('?')[0]);
    }
    return decodeURIComponent(answer);
  };

  const handleDownload = async (uuid: string, answer: string, index: number) => {
    try {
      setIsDownloading((prev) => ({ ...prev, [index]: true }));
      const filename = getFilename(answer);
      const response = await axios.get(`/api/signed-download/${uuid}/${encodeURIComponent(filename)}`);
      setFileUrls((prev) => ({
        ...prev,
        [index]: { url: response.data.signed_url, filename: response.data.filename }
      }));
    } catch {
      alert('Failed to generate download link');
    } finally {
      setIsDownloading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const triggerDownload = async (url: string, filename: string, index: number) => {
    try {
      setIsDownloading((prev) => ({ ...prev, [index]: true }));
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
          'Content-Type': 'application/pdf'
        },
        credentials: 'omit'
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      alert(`Download failed: ${errorMessage}. Please try again or contact support.`);
      console.error('Download failed:', error);
    } finally {
      setIsDownloading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Format UTC timestamp in browser's local timezone
  const formatLocalDate = (utcDate: string) => {
    const date = new Date(utcDate);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZoneName: 'short'
    };
    return date.toLocaleString(undefined, options);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-[#1A2233]">Ticket {form.ticket_id || form.uuid?.slice(0, 6)} Details</h2>
      <div className="ticket-details-card">
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3 items-start">
          <div className="flex flex-row gap-3 items-center mb-2">
            <span className="ticket-details-pill blue">UUID: {form.uuid}</span>
            <span className={`ticket-details-pill status-${form.status}`}>{form.status.charAt(0).toUpperCase() + form.status.slice(1)}</span>
          </div>
          <div className="text-[#1A2233] font-medium">Customer Email: {form.customer_email}</div>
          <div className="text-gray-500 text-sm">Created At: {formatLocalDate(form.created_at)}</div>
        </div>
        <h4 className="text-lg font-bold mb-2 text-[#1A2233]">Questions and Answers</h4>
        {form.questions.map((q, index) => (
          <div key={index} className="ticket-details-section">
            <div className="font-semibold mb-1 text-[#1A2233]">{q.question}</div>
            <div className="mb-1 text-sm text-gray-500">Type: {q.type}</div>
            {(q.type === 'single' || q.type === 'multiple') && q.choices && (
              <div className="mb-1 text-sm text-gray-500">Choices: {q.choices.join(', ')}</div>
            )}
            {q.type === 'file' && q.answer ? (
              fileUrls[index] ? (
                <button
                  onClick={() => triggerDownload(fileUrls[index].url, fileUrls[index].filename, index)}
                  disabled={isDownloading[index]}
                  className="ticket-details-btn"
                >
                  {isDownloading[index] ? 'Downloading...' : 'Download File'}
                </button>
              ) : (
                <button
                  onClick={() => handleDownload(form.uuid, q.answer as string, index)}
                  disabled={isDownloading[index]}
                  className="ticket-details-btn"
                >
                  {isDownloading[index] ? 'Generating...' : 'Generate Download Link'}
                </button>
              )
            ) : (
              <div className="text-[#1A2233]">Answer: {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer || 'N/A'}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}