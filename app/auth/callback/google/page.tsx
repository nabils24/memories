"use client";

import { useEffect, useState } from "react";
import supabase from '@/lib/supabase/config';

const PopupCallback = () => {
  const [mounted, setMounted] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      // Ambil parameter dari hash URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const token = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (token && refreshToken) {
        setAccessToken(token);
        supabase.auth.setSession({
          access_token: token,
          refresh_token: refreshToken
        }).then(async ({ data, error }) => {
          if (error) {
            console.log(error);
          } else {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
              console.log(userError);
            } else {
              if (window.opener && typeof window.opener.handleGetDataFromCallback === 'function') {
                window.opener.handleGetDataFromCallback(user);
                window.close();
              } else {
                console.log("Callback function not found on opener window.");
              }
            }
          }
        });
      } else {
        console.log("Access token tidak ditemukan.");
        window.close(); // Bisa aktifkan jika ingin langsung menutup popup jika tidak ada token
      }
    }
  }, []);

  if (!mounted) return null;

  return <div>Processing authentication...</div>;
};

export default PopupCallback;
