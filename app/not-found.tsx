'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-destructive" strokeWidth={1.5} />
          <CardTitle className="text-3xl font-bold">404 - Halaman yang kamu tidak ada!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Oops! mungkin halaman kamu tidak ada atau sudah diganti!
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/">
                Go to Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}