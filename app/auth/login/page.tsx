"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase/config.js";
import GoogleSignIn from '@/components/ui/GoogleSignIn';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast({
                variant: "destructive",
                title: "Invalid email",
                description: "Please enter a valid email address",
            });
            return false;
        }

        if (!formData.password || formData.password.length <= 3) {
            toast({
                variant: "destructive",
                title: "Invalid password",
                description: "Password must be at least 6 characters long",
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsLoading(true);
            // Sign in with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (authError) throw authError;

            const { data: { user } } = await supabase.auth.getUser();

            console.log(user);

            const { data: dataUser, error: profileError } = await supabase
                .from('user')
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (profileError) throw profileError;
            console.log(dataUser);

            toast({
                title: "Success!",
                description: "Your account login successfully.",
            });

            // Reset form
            setFormData({
                email: '',
                password: '',
            });

            // Redirect to dashboard
            router.push('/id/' + dataUser.uniq_url);

        } catch (error) {
            console.error('Error creating account:', JSON.stringify(error));
            let { err } = await supabase.auth.signOut();
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to create account. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Login
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="mt-1"
                                    disabled={isLoading}
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="relative"
                            >
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        className="mt-1"
                                        disabled={isLoading}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                    </Button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Login...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className='flex flex-col mt-3'>
                                <div className='text-center mb-3'>
                                    Or
                                </div>
                                <GoogleSignIn />
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}