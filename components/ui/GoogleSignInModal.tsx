import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function GoogleSignInModal({ isOpen, onClose, onSignIn }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setIsLoading(true);
        await onSignIn();
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign In with Google</DialogTitle>
                    <DialogDescription>
                        Please click the button below to sign in with your Google account.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-4">
                    <Button onClick={handleSignIn} disabled={isLoading} className="flex items-center gap-2">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                                    alt="Google Logo"
                                    width={20}
                                    height={20}
                                />
                                Sign In with Google
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
