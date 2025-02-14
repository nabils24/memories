"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Sabar yaaa. lagi ambil datanya..</p>
        </div>
    );
}
