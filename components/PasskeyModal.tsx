"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PasskeyModal = () => {
    const router = useRouter();
    const [open,setOpen] = useState(false);
    const [passkey,setPasskey] = useState('');
    const [error, setError] = useState('');
    const encryptedkey = typeof window !== "undefined" ? window.localStorage.getItem("accessKey") : null;

    useEffect(() => {
        const accessKey = encryptedkey && decryptKey(encryptedkey);
        if(accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
            setOpen(false);
            router.push('/admin');
        }else{
            setOpen(true);
        }
        
    },[encryptedkey])

    const closeModal = () => {
        setOpen(false);
        router.push('/');
    }

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
            const encryptedkey = encryptKey(passkey);
            localStorage.setItem('accessKey', encryptedkey);
            setOpen(false);
        }else{
            setError('Invalid passkey please try again');
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between">
                        Admin Access Verification
                        <Image className="cursor-pointer" onClick={closeModal} src={'/assets/icons/close.svg'} alt={"close"} width={20} height={20}/>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page please enter the passkey.
                        <p className="shad-error text-14-regular mt-4 flex justify-start">the passkey is 111111 , I put it because its a learning project.</p>
                    </AlertDialogDescription>
                    <div className="pt-4">
                        <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
                            <InputOTPGroup className="shad-otp">
                                <InputOTPSlot index={0} className="shad-otp-slot" />
                                <InputOTPSlot index={1} className="shad-otp-slot" />
                                <InputOTPSlot index={2} className="shad-otp-slot" />
                                <InputOTPSlot index={3} className="shad-otp-slot" />
                                <InputOTPSlot index={4} className="shad-otp-slot" />
                                <InputOTPSlot index={5} className="shad-otp-slot" />
                            </InputOTPGroup>
                        </InputOTP>
                        {error && <p className="shad-error text-14-regular mt-4 flex justify-center">{error}</p>}
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={validatePasskey} className="shad-primary-btn w-full">Enter Admin Passkey</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PasskeyModal;
