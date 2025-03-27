import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

// Import ToastWrapper with dynamic import to avoid SSR
const ToastWrapper = dynamic(() => import('@/components/ui/toast-wrapper'), {
  ssr: false,
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "FreeFlow - AI-Powered Flowchart Builder",
  description: "Create intelligent flowcharts with AI assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <body>
        {children}
        <ToastWrapper />
      </body>
    </html>
  )
}
