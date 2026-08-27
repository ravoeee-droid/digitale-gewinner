import './globals.css';

export const metadata = {
  title: 'SEO Radar — Digitale Gewinner',
  description: 'SEO, Search Visibility und Kundenreports in einem Cockpit.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
