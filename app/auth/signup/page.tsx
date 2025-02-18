"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EyeIcon, EyeOffIcon, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { uploadAvatar } from '@/lib/supabase/upload';
import supabase from "@/lib/supabase/config.js";
import { updateUser } from '@/lib/supabase/user';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: null
    });
    const [showPassword, setShowPassword] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [url, setUrl] = useState('')
    const [tabs, setTabs] = useState('signup')
    const { toast } = useToast();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast({
                variant: "destructive",
                title: "Name is required",
                description: "Please enter your name",
            });
            return false;
        }

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

        if (!formData.avatar) {
            toast({
                variant: "destructive",
                title: "Avatar required",
                description: "Please upload an avatar image",
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
            // Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            });

            if (authError) throw authError;

            // Insert user profile into public.users table
            const { error: profileError } = await supabase
                .from('user')
                .insert([{
                    user_id: authData.user.id,
                    name: formData.name,
                    avatar: formData.avatar
                }]);

            if (profileError) throw profileError;

            toast({
                title: "Success!",
                description: "Your account has been created successfully.",
            });
            setTabs('seturl');

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                avatar: null
            });
            setPreviewUrl('');

        } catch (error) {
            console.error('Error creating account:', JSON.stringify(error));
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to create account. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarUpload = async (file) => {
        if (file.size > 5 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: "Please upload an image smaller than 5MB",
            });
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast({
                variant: "destructive",
                title: "Invalid file type",
                description: "Please upload an image file",
            });
            return;
        }

        try {
            setIsUploading(true);
            let url = await uploadAvatar(file);

            if (url) {
                url = 'https://gyditryslflaxxjupqvi.supabase.co/storage/v1/object/public/' + url.fullPath;
                setPreviewUrl(url);
                setFormData(prev => ({
                    ...prev,
                    avatar: url
                }));

                toast({
                    title: "Upload successful",
                    description: "Your avatar has been uploaded.",
                });
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: error.message || "Failed to upload avatar. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    //Url

    const handleUpdateUrlChange = async (value) => {
        setUrl(value);
    }

    const handleUpdateUrl = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser()
            await updateUser(user?.id, { uniq_url: url })
            if (user) {
                const { data, error } = await supabase
                    .from('title')
                    .insert([
                        { user_id: user?.id, title: url },
                    ])
            }
            toast({
                title: "Success!",
                description: "Your Url has been updated!",
            });
        } catch (error) {
            console.error('Error update url account:', JSON.stringify(error));
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update url account. Please try again.",
            });
        } finally {
            setIsLoading(false);
            router.push(`/id/${url}`);
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {tabs === 'signup' && (
                    <Card className="w-full max-w-md shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Buat Akun
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="mt-1"
                                        disabled={isLoading}
                                        required
                                    />
                                </motion.div>

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
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-2"
                                >
                                    <Label>Avatar</Label>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-16 h-16">
                                            {isUploading ? (
                                                <AvatarFallback>
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                </AvatarFallback>
                                            ) : previewUrl ? (
                                                <AvatarImage src={previewUrl} alt="Avatar preview" />
                                            ) : (
                                                <AvatarFallback>
                                                    <Upload className="w-6 h-6" />
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <Input
                                            id="avatar"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleAvatarUpload(file);
                                                }
                                            }}
                                            className="max-w-[200px]"
                                            disabled={isLoading || isUploading}
                                        />
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
                                        disabled={isLoading || isUploading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Sign Up'
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>
                    </Card>
                )}
                {tabs === 'seturl' && (
                    <Card className="w-full max-w-md shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Buat URL Unik mu
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateUrl} className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Label htmlFor="name">URL Unik Kamu🤗</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={url}
                                        onChange={(e) => handleUpdateUrlChange(e.target.value)}
                                        placeholder="Misal /kenangan_nabil&soffie"
                                        className="mt-1"
                                        disabled={isLoading}
                                        required
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading || isUploading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sabar ya...
                                            </>
                                        ) : (
                                            'Lanjut'
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </div>
    );
}