import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne, Space_Grotesk } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Toaster } from "sonner";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://asyncnode.builder-net.tech";
const SITE_DESCRIPTION =
  "AsyncNode is an AI workflow automation platform. Build, connect, and run AI-powered workflows on a visual node-based canvas — with live execution updates and no boilerplate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AsyncNode — AI Workflow Automation Platform",
    template: "%s | AsyncNode",
  },
  description: SITE_DESCRIPTION,
  applicationName: "AsyncNode",
  keywords: [
    "AI workflow automation",
    "workflow builder",
    "node-based automation",
    "AI agents",
    "no-code automation",
    "workflow orchestration",
    "AsyncNode",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "AsyncNode",
    title: "AsyncNode — AI Workflow Automation Platform",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1280,
        height: 577,
        alt: "AsyncNode — visual AI workflow builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AsyncNode — AI Workflow Automation Platform",
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "AsyncNode",
      url: SITE_URL,
      logo: `${SITE_URL}/og.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "AsyncNode",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "AsyncNode",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier — no credit card required",
      },
      featureList: [
        "Visual node-based workflow builder",
        "AI integrations: OpenAI, Anthropic, Groq",
        "HTTP request, Slack, and email nodes",
        "Manual and webhook triggers",
        "Live execution trace with real-time updates",
      ],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0B0B0C] text-[#FAFAFA]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
