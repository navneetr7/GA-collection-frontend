import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  try {
    const formData = await request.formData();
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/submit-answer/${uuid}`, formData, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.response?.data?.detail || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}