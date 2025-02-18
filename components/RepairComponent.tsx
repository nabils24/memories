'use client'

import Link from 'next/link'
import { BadgeInfo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="flex flex-col items-center space-y-4">
                    <BadgeInfo className="h-16 w-16 text-destructive" strokeWidth={1.5} />
                    <CardTitle className="text-3xl font-bold">Halaman Sedang dalam perbaikan!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        maaf yaa halaman ini sedang dalam perbaikan tunggu info selanjutnya dari instagram kami🤗
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button asChild>
                            <Link href="https://instagram.com/kenangankamu">
                                instagram
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}