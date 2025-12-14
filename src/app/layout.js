import './globals.css'

export const metadata = {
  title: 'RecoverAI Platform | Autonomous Deployment Agent',
  description: 'Production-ready AI-powered error recovery and auto-healing system for modern applications. Intelligent monitoring, analysis, and automated remediation.',
  keywords: 'AI, DevOps, Error Recovery, Auto-healing, Monitoring, Kestra, Automation',
  authors: [{ name: 'DevOps Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
