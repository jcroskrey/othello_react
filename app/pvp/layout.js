import { Inter } from 'next/font/google'
import '../globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Othello: PvP',
}

export default function RootLayout({ children }) {

    return (
      <>{children}</>
    )
  }