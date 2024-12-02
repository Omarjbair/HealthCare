"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFromField, { FormFieldType } from "../CustomFromField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.action";
import { Appointment } from "@/types/appwrite.types";

interface AppointmentFromProps{
    userId: string,
    type: "create" | "schedule" | "cancel",
    patientId: string,
    appointment?: Appointment
    setOpen?: (value: boolean) => void
}
const AppointmentFrom = ({ userId, patientId, type, appointment, setOpen }: AppointmentFromProps) => {
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter();

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
            primaryPhysician: appointment?appointment.primaryPhysician:'',
            schedule: appointment?new Date(appointment.schedule):new Date(Date.now()),
            reason: appointment?appointment.reason:'',
            note: appointment?appointment.note:'',
            cancellationReason: appointment?.cancellationReason ||'',
        },
    });

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true);
        let status;
        switch(type){
            case 'schedule':
                status = 'scheduled';
                break;
            case 'cancel':
                status = 'cancelled';
                break;
            default:
                status = 'pending';
                break;
        }
        try{
            if(type === 'create' && patientId){
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,
                    schedule: new Date(values.schedule),
                }
                const appointment = await createAppointment(appointmentData);
                if(appointment){
                    form.reset();
                    router.push(`/patient/${userId}/new-appointment/success/?appointmentId=${appointment.$id}`);
                }
            }
            else{
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                    },
                    type,
                };

                const updatedAppointment = await updateAppointment(appointmentToUpdate);

                if (appointmentToUpdate) {
                    setOpen && setOpen(false);
                    form.reset();
                }
            }
        }catch(err){
            console.log(err);
        }
        setIsLoading(false);
    }

    let buttonLabel;
    switch (type) {
        case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
        case "schedule":
            buttonLabel = "Schedule Appointment";
            break;
        default:
        buttonLabel = "Submit Appointment";
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                {type === 'create' &&
                    <div className="mb-12 space-y-4">
                        <h1 className="header">New Appointment</h1>
                        <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
                    </div>
                }
                {type !== 'cancel' && (
                    <>
                        <CustomFromField 
                            control={form.control}
                            fieldType={FormFieldType.SELECT}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a doctor"
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
                        <CustomFromField 
                            control={form.control}
                            fieldType={FormFieldType.DATE_PICKER}
                            name="schedule"
                            label="Expect appointment date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                            placeholder="mm/dd/yyyy - h:mm aa"
                        />
                        <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                            <CustomFromField 
                                control={form.control}
                                fieldType={FormFieldType.TEXTAREA}
                                name="reason"
                                label="Reason for appointment"
                                placeholder="Enter reason for appointment"
                            />
                            <CustomFromField 
                                control={form.control}
                                fieldType={FormFieldType.TEXTAREA}
                                name="note"
                                label="Notes"
                                placeholder="Enter notes"
                            />
                        </div>
                    </>
                )}
                { type === 'cancel' && (
                    <>
                        <CustomFromField 
                            control={form.control}
                            fieldType={FormFieldType.TEXTAREA}
                            name="cancellationReason"
                            label="Reason for cancellation"
                            placeholder="Enter reason for cancellation"
                        />
                    </>
                )
                }
                <SubmitButton className={`${type === 'cancel'?'shad-danger-btn':'shad-primary-btn'} w-full`} isLoading={isLoading}>
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    );
};

export default AppointmentFrom;
