import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request, { params }: { params: Promise<{ uuid: string; filename: string }> }) {
  const { uuid, filename } = await params;
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/signed-download/${uuid}/${filename}`, {
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