import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://keyglass.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KeyGlass — Online Keyboard Tester for Every Device, Mac, Windows & Mechanical",
    template: "%s | KeyGlass Keyboard Tester",
  },
  description:
    "Free online keyboard tester for MacBook, Windows, Linux, mechanical, laptop, Bluetooth, and mobile keyboards. Test every key in real time with N-Key Rollover (NKRO), ghosting check, switch chatter detection, latency metrics, and Apple glassmorphism UI.",
  keywords: [
    "keyboard tester",
    "online keyboard test",
    "test my keyboard",
    "keyboard key test",
    "macbook keyboard tester",
    "windows keyboard tester",
    "mechanical keyboard tester",
    "keyboard ghosting test",
    "n-key rollover test",
    "nkro test online",
    "keyboard chatter test",
    "double click keyboard test",
    "laptop keyboard check",
    "wireless bluetooth keyboard test",
    "60 percent keyboard tester",
    "tkl keyboard tester",
    "full size 104 key tester",
    "key code checker",
    "keyboard latency test",
    "mobile keyboard tester",
    "online mouse tester",
    "mouse button test",
    "mouse double click test",
    "touchpad test online",
    "macbook trackpad tester",
  ],
  authors: [{ name: "KeyGlass" }],
  creator: "KeyGlass",
  publisher: "KeyGlass",
  applicationName: "KeyGlass Online Keyboard Tester",
  category: "Utilities",
  classification: "Hardware Diagnostics & Keyboard Testing Tool",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "KeyGlass",
    title: "KeyGlass — Free Online Keyboard Tester for Every Device",
    description:
      "Instantly test mechanical, MacBook, Windows, laptop, and mobile keyboards online. Live key highlight, NKRO anti-ghosting test, switch chatter detector, and keycode inspector.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "KeyGlass Online Keyboard Tester — Apple Glassmorphism Interactive Keyboard UI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyGlass — Online Keyboard Tester for All Keyboards & Devices",
    description:
      "Test every key on Mac, Windows, mechanical, laptop & mobile keyboards online. Live NKRO, chatter detector & key event inspector.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f9fc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-300">
        {children}
      </body>
    </html>
  );
}
