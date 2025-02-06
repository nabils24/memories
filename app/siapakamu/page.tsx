"use client"

import { useState, useEffect } from 'react';

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast"


export default function siapakamuPage() {
    const { toast } = useToast();
    const [value, setValue] = useState("")

    useEffect(() => {
        if (value == 200324) {
            if (typeof window !== "undefined") {
                try {
                    sessionStorage.setItem("siapakamu", "true");
                    window.location.href = "/admin";

                } catch (e) {
                    toast({
                        variant: "destructive",
                        title: "Ciee salahh!",
                        description: "Coba lagi ajaaa"
                    });
                }
            }

        } else if (value.length == 6) {
            toast({
                variant: "destructive",
                title: "Ciee salahh!",
                description: "Coba lagi ajaaa"
            });
        }
    }, [value]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="space-y-2">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Siapa Kamu?</h1>
                    <p className="text-sm text-gray-500">Masukan tanggal jadian kita</p>
                </div>
                <InputOTP
                    maxLength={6}
                    value={value}
                    onChange={(value) => setValue(value)}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>

            </div>
        </div>
    );
}