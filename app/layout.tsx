import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nowpharma.it"),
  title: {
    default: "Nowpharma — Il benessere giusto, trovato in un attimo",
    template: "%s | Nowpharma",
  },
  description:
    "Parafarmacia online: integratori, igiene, cosmesi e articoli sanitari con assistenza semplice e spedizione gratuita da 39,90 €.",
  icons: {
    icon: "/logo-nowpharma-icon.png",
    shortcut: "/logo-nowpharma-icon.png",
    apple: "/logo-nowpharma-icon.png",
  },
  openGraph: {
    title: "Nowpharma — Il benessere giusto, trovato in un attimo",
    description:
      "Prodotti selezionati, offerte chiare e assistenza vera per il benessere di tutta la famiglia.",
    type: "website",
    locale: "it_IT",
    siteName: "Nowpharma",
    images: [
      {
        url: "/og.png",
        width: 1728,
        height: 909,
        alt: "Nowpharma — Il benessere giusto, trovato in un attimo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nowpharma — Il benessere giusto, trovato in un attimo",
    description:
      "Prodotti selezionati, offerte chiare e assistenza vera per tutta la famiglia.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
