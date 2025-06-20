import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

interface ApiError {
  response?: {
    status?: number;
    data?: {
      detail?: string;
    };
  };
}

export async function GET(
  request: Request,
  context: { params: { uuid: string } }
): Promise<NextResponse> {
  const { uuid } = await context.params;
  
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/form-data/${uuid}`, {
      headers: { Authorization: `Bearer ${process.env.API_KEY}` },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    return NextResponse.json(
      { detail: (axiosError.response?.data as { detail?: string })?.detail || 'Internal server error' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
