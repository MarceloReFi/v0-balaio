import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Remove qualquer CSP existente
  response.headers.delete('Content-Security-Policy')
  response.headers.delete('Content-Security-Policy-Report-Only')
  
  // Adiciona CSP permissivo que permite WalletConnect
  response.headers.set(
    'Content-Security-Policy',
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
  )

  return response
}

export const config = {
  matcher: '/:path*',
}
