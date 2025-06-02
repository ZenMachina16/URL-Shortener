import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/providers/SessionProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shrinkr - Modern URL Shortener",
  description: "Transform your long URLs into powerful, trackable short links with advanced analytics.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

// Client-side scroll animation observer
const ScrollObserver = () => {
  if (typeof window !== 'undefined') {
    const observerScript = `
      // Scroll animation observer
      const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });

        const animateElements = document.querySelectorAll('.scroll-animate');
        animateElements.forEach(el => observer.observe(el));
      };

      // Initialize when DOM is loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeElements);
      } else {
        observeElements();
      }

      // Re-observe on navigation (for SPAs)
      let lastUrl = location.href;
      new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          setTimeout(observeElements, 100);
        }
      }).observe(document, { subtree: true, childList: true });
    `;
    
    return (
      <script 
        dangerouslySetInnerHTML={{ __html: observerScript }}
        suppressHydrationWarning
      />
    );
  }
  return null;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-black via-gray-900 to-blue-900 min-h-screen`}
        suppressHydrationWarning
      >
        <SessionProvider>
        {children}
        </SessionProvider>
        <ScrollObserver />
      </body>
    </html>
  );
}
