import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/components/ReduxProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: '게시판',
  description: '게시판 서비스',
  icons: {
    icon: '/asset/IMG_5412.png',
    shortcut: '/asset/IMG_5412.png',
    apple: '/asset/IMG_5412.png',
  },
  // 성능 최적화 메타데이터
  other: {
    'mobile-web-app-capable': 'yes',
  },
  // Open Graph 최적화
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '게시판',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}

