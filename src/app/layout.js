import "./globals.css";

export const metadata = {
  title: "Crypto AI Insights — Curated Crypto & AI Research",
  description:
    "A premium research aggregation platform curating high-quality crypto and AI research from top investors and thought leaders including a16z, Paradigm, Goldman Sachs, JPMorgan, and more.",
  keywords: [
    "crypto research",
    "AI research",
    "blockchain",
    "DeFi",
    "institutional research",
    "market analysis",
  ],
  openGraph: {
    title: "Crypto AI Insights",
    description:
      "Curated crypto & AI research from top investors and thought leaders.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
