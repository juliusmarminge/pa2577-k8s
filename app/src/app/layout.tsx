import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/transcripts", label: "Transcripts" },
  ];

  return (
    <html lang="en">
      <body
        className={`min-h-screen font-sans antialiased ${fontSans.variable}`}
      >
        <nav className="flex w-full p-4 gap-4 border-b">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              className="hover:font-bold"
              href={href}
              title={label}
            >
              {label}
            </Link>
          ))}
        </nav>
        {props.children}
        <Toaster />
      </body>
    </html>
  );
}
