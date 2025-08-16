'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestEmailPage() {
  const [email, setEmail] = useState('qaramyanv210@gmail.com')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')

  const testEmail = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Email sent successfully! Message ID: ${data.messageId}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Email Configuration</CardTitle>
          <CardDescription>Test your Gmail SMTP setup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email to send test to:</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <Button 
            onClick={testEmail} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Test Email'}
          </Button>
          
          {result && (
            <div className={`p-3 rounded-lg text-sm ${
              result.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {result}
            </div>
          )}
          
          <div className="text-xs text-neutral-500 space-y-1">
            <p>This will send a test email to verify your Gmail SMTP configuration.</p>
            <p>Check the server console for detailed logs.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
