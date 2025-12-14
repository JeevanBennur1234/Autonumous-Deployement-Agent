import './globals.css'

export const metadata = {
  title: 'Autonomous Deployment Agent | AI-Powered DevOps',
  description: 'Production-ready AI-powered error recovery and auto-healing system for modern applications. Intelligent monitoring, analysis, and automated remediation.',
  keywords: 'AI, DevOps, Error Recovery, Auto-healing, Monitoring, Kestra, Automation',
  authors: [{ name: 'DevOps Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e1b4b',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}