"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GoogleSignIn = () => {
    const [popup, setPopup] = useState<Window | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!popup) return;

        const channel = new BroadcastChannel("popup-channel");
        channel.addEventListener("message", getDataFromPopup);

        return () => {
            channel.removeEventListener("message", getDataFromPopup);
            setPopup(null);
        };
    }, [popup]);

    const login = async () => {

        const origin = location.origin;
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback/google`,
                queryParams: { prompt: "select_account" },
                skipBrowserRedirect: true,
            },
        });
        if (error || !data) {
            console.log(data)
            return toast({
                title: "Login Failed",
                description: "Failed to login with Google. Please try again.",
                variant: "destructive",
            });
        }

        const popup = openPopup(data.url);
        setPopup(popup);
    };

    const openPopup = (url: string) => {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const windowFeatures = `scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`;
        const popup = window.open(url, "popup", windowFeatures);
        return popup;
    };

    const getDataFromPopup = (e: any) => {
        if (e.origin !== window.location.origin) return;

        const code = e.data?.authResultCode;
        if (!code) return;

        setPopup(null);
        router.replace(`/api/~~/?code=${code}`);
    };

    return (
        <Button onClick={login} variant="outline">
            Google Login {popup ? "processing..." : ""}
        </Button>
    );
};

export default GoogleSignIn;
