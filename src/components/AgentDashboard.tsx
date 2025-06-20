'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { MagicLink } from '@/types';

const ROWS_PER_PAGE = 10;

export default function AgentDashboard() {
  const [links, setLinks] = useState<MagicLink[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get('/api/magic-links');
        setLinks(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load links');
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const totalPages = Math.ceil(links.length / ROWS_PER_PAGE);
  const paginatedLinks = links.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
    } catch (e) {
      alert('Logout failed.');
    }
    localStorage.clear();
    sessionStorage.clear();
    router.push('/agent');
    window.location.reload();
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="dashboard-card">
      <button className="dashboard-logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h2 className="text-2xl font-bold mb-4 text-[#1A2233] text-center">Agent Dashboard</h2>
      <div className="overflow-x-auto">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th className="dashboard-table-th">Ticket ID</th>
              <th className="dashboard-table-th">Email</th>
              <th className="dashboard-table-th">Magic Link</th>
              <th className="dashboard-table-th">Status</th>
              <th className="dashboard-table-th">Created At</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLinks.map((link) => (
              <tr key={link.ticket_id}>
                <td className="dashboard-table-td">
                  <Link href={`/agent/ticket/${link.ticket_id}`}>
                    <span className="dashboard-pill cursor-pointer hover:bg-[#e0e7ef] transition">{link.ticket_id}</span>
                  </Link>
                </td>
                <td className="dashboard-table-td">{link.customer_email}</td>
                <td className="dashboard-table-td truncate max-w-xs">
                  <a href={link.magic_link} target="_blank" rel="noopener noreferrer" className="text-[#1A2233] hover:underline font-semibold">
                    Open Link
                  </a>
                </td>
                <td className="dashboard-table-td">
                  <span className={`dashboard-status-pill ${link.status === 'pending' ? 'pending' : 'complete'}`}>{link.status.charAt(0).toUpperCase() + link.status.slice(1)}</span>
                </td>
                <td className="dashboard-table-td">{new Date(link.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="dashboard-pagination">
          <button
            className="dashboard-pagination-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`dashboard-pagination-btn${page === i + 1 ? ' active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="dashboard-pagination-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}