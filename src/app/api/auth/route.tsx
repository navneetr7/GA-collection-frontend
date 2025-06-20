import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    if (key === process.env.API_KEY) {
      return NextResponse.json({ status: 'success' });
    }
    return NextResponse.json({ detail: 'Invalid API key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}