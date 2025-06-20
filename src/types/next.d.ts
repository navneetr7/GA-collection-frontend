import 'next';

declare module 'next' {
  interface RouteHandlerContext {
    params: Record<string, string>;
  }
}

declare module 'next/server' {
  interface NextRequest {
    params: Record<string, string>;
  }
}
