"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFromField, { FormFieldType } from "../CustomFromField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { userCreate } from "@/lib/actions/patient.actions";
import { PatientFormDefaultValues } from "@/constants";


const PatientForm = () => {
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
            username: "",
            email: "",
            phone: "",
        },
    });

    async function onSubmit({username,email,phone}: z.infer<typeof UserFormValidation>) {
        setIsLoading(true);
        try{
            const userData = {
                name: username,
                email,
                phone
            };
            
            const user = await userCreate(userData);

            if (user) {
                router.push(`/patient/${user.$id}/register`);
            }

        }catch(err){
            console.log(err);
        }

        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <div className="mb-12 space-y-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p className="text-dark-700">Schedule your first appointment</p>
                </div>
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="username"
                    label="Fullname"
                    placeholder="John doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.PHONE_INPUT}
                    name="phone"
                    label="Phone Number"
                    placeholder="(963) 123-4567"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />
                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    );
};

export default PatientForm;
