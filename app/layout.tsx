import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Y-Learning Hub",
  description: "Learn. Grow. Succeed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body>
        <header className="site-header">
          <div className="wrap">
            <nav className="nav">
              <Link href="/" className="logo">
                Y-Learning <span>Hub</span>
              </Link>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/courses">Courses</Link></li>
                <li><Link href="/#about">About</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          © 2026 Y-Learning Hub. All rights reserved.
        </footer>
      </body>
    </html>
  );
}