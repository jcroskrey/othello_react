import { Inter } from 'next/font/google'
import '../globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Othello: Local Match',
}

export default function RootLayout({ children }) {
    return (
      <html lang="en" data-bs-theme="dark">
        <body className={inter.className}>{children}</body>
      </html>
    )
  }