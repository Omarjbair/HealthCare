"use server";

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export async function createAppointment(appointment: CreateAppointmentParams){
    try{
        console.log(appointment);
        const newAppointment = await databases.createDocument(DATABASE_ID!,APPOINTMENT_COLLECTION_ID!,ID.unique(),appointment); 
        
        return parseStringify(newAppointment);
    }catch(error){
        console.log(error);
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        );
        
        return parseStringify(appointment);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the existing patient:",
            error
        );
    }
};

export const getRecentAppointmentList = async () => {
    try{
        const appointment = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };

        const counts = (appointment.documents as Appointment[]).reduce((acc,appointment) => {
            switch (appointment.status) {
                case "scheduled":
                    acc.scheduledCount++;
                    break;
                case "pending":
                    acc.pendingCount++;
                    break;
                case "cancelled":
                    acc.cancelledCount++;
                    break;
            }
            return acc;
        },initialCounts);

        const data = {
            total: appointment.total,
            ...counts,
            documents: appointment.documents
        }

        return data;
    } catch(error){
        console.log(error)
    }
}

export const sendSMSNotification = async (userId: string, content:string) => {
    try{
        const message = await messaging.createSms(ID.unique(),content,[],[userId]);

        return parseStringify(message);
    }catch(error){
        console.log(error);
    }
}


export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try{
        const updatedAppointment = await databases.updateDocument(DATABASE_ID!,APPOINTMENT_COLLECTION_ID!,appointmentId,appointment);

        if(!updatedAppointment){
            throw new Error('Appointment not found');
        }

        const smsMessage = `\nGreetings from CarePulse.\n${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`
        const message = await sendSMSNotification(userId,smsMessage);

        revalidatePath('/admin');
        return parseStringify(updatedAppointment);
    }catch(error){
        console.log(error);
    }
};