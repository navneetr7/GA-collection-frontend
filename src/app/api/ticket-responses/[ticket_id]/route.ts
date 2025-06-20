import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request, { params }: { params: Promise<{ ticket_id: string }> }) {
  const { ticket_id } = await params;
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/ticket-responses/${ticket_id}`, {
      headers: { Authorization: `Bearer ${process.env.API_KEY}` },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.response?.data?.detail || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}