"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFromField, { FormFieldType } from "../CustomFromField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { registerPatient } from "@/lib/actions/patient.actions";


const RegisterForm = ({ user }: { user: User}) => {
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
            ...PatientFormDefaultValues,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
    });

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);
        let formData;
        if(values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]],{
                type: values.identificationDocument[0].type,
            });
            formData = new FormData();
            formData.append('blobFile',blobFile);
            formData.append('fileName', values.identificationDocument[0].name);
        }
        try{
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument : formData,
            }

            //@ts-ignore
            const newPatient = await registerPatient(patientData);

            if (newPatient) {
                router.push(`/patient/${user.$id}/new-appointment`);
            }
            
        }catch(error){
            console.log(error)
        }
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <div className="space-y-4">
                    <h1 className="header">Welcome👋</h1>
                    <p className="text-dark-700">Let us know more about your self.</p>
                </div>
                <div className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </div>
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="name"
                    placeholder="John doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
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
                </div>
                <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.DATE_PICKER}
                        name="birthDate"
                        label="Date of Birth"
                    />
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.SKELETON}
                        name="gender"
                        label="Gender"
                        renderSkeleton={( field ) => {
                            return (
                                <FormControl>
                                    <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                                        {
                                            GenderOptions.map((item) => (
                                                <div key={item} className="radio-group">
                                                    <RadioGroupItem value={item} id={item}/>
                                                    <Label htmlFor={item} className="cursor-pointer" >{item}</Label>
                                                </div>
                                            ))
                                        }
                                    </RadioGroup>
                                </FormControl>
                            );
                        }}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="address"
                        label="Address"
                        placeholder="14th Street, New York"
                    />
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="emergencyContactName"
                        label="Emergency contact name"
                        placeholder="Guardians name"
                    />
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.PHONE_INPUT}
                        name="emergencyContactNumber"
                        label="Emergency contact number"
                        placeholder="(963) 123-4567"
                    />
                </div>
                <div className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </div>
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.SELECT}
                    name="primaryPhysician"
                    label="Primary Physician"
                    placeholder="Select a physician"
                >
                    {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image className="rounded-full border border-dark-500" src={doctor.image} alt={doctor.name} width={32} height={32}/>
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFromField>
                <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="insuranceProvider"
                        label="Insurance provider"
                        placeholder="BlueCross BlueShield"
                    />
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        name="insurancePolicyNumber"
                        label="Insurance policy number"
                        placeholder="ABC123456789"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Peanuts, Penicillin, Pollen"
                    />
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name="currentMedication"
                        label="Current medication (if any)"
                        placeholder="Ibuprofen 200mg, Paracetamol 500mg"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name="familyMedicalHistory"
                        label="Family medical history"
                        placeholder="Mother had brain cancer, Father has hypertension"
                    />
                    <CustomFromField 
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        name="pastMedicalHistory"
                        label="Past medical history"
                        placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                    />
                </div>
                <div className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </div>
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.SELECT}
                    name="identificationType"
                    label="Identification type"
                    placeholder="Select an identification type"
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type} className="cursor-pointer">
                            {type}
                        </SelectItem>
                    ))}
                </CustomFromField>
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="identificationNumber"
                    label="Identification number"
                    placeholder="123456789"
                />
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.SKELETON}
                    name="identificationDocument"
                    label="Scanned copy of identification documents"
                    renderSkeleton={( field ) => {
                        return (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange}/>
                            </FormControl>
                        );
                    }}
                />
                <div className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </div>
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    name="treatmentConsent"
                    label="I consent to receive treatment for my health condition."
                />
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    name="disclosureConsent"
                    label="I consent to the use and disclosure of my health information for treatment purposes."
                />
                <CustomFromField 
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    name="privacyConsent"
                    label="I acknowledge that I have reviewed and agree to the privacy policy"
                />
                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    );
};

export default RegisterForm;
