import React from 'react'
import './styles.css'

export const metadata = {
  title: 'Digitale Gewinner CMS',
  description: 'Admin- und Content-System für Digitale Gewinner.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
