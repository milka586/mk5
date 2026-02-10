import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Script 컴포넌트를 반드시 가져와야 에러가 나지 않습니다.
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

// 2. 브라우저 탭에 표시될 메타데이터 설정
export const metadata: Metadata = {
  title: "컬러로그 (Color Log) - 오늘의 감정 주파수 스캔",
  description: "오늘 당신의 감정은 어떤 색인가요? 0.1초 만에 기록하는 나의 감정 주파수 로그.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 3. 구글 애드센스 기본 스크립트 (본인의 ca-pub ID로 유지) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1233645734653401"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}