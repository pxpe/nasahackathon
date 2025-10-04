import type { Metadata } from 'next'
import { Crimson_Pro, Poppins } from 'next/font/google'
import './globals.css'

const crimsom = Crimson_Pro({ 
  subsets: ['latin'],
  variable: '--font-crimsom',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'TreeSAR - NASA Space Apps', 
  description: 'Satellite SAR analysis for deforestation monitoring and environmental impact assessment',
  keywords: ['NASA', 'Space Apps', 'SAR', 'deforestation', 'satellite', 'environment'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${crimsom.variable}`}>
      <head>
        <link rel="icon" href="/images/logo.jpg" />
      </head>
      <body className="font-body antialiased">
        <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-blue to-space-purple">
          {children}
        </div>
      </body>
    </html>
  )
}
