import AppointmentFrom from "@/components/forms/AppointmentFrom";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";


const NewAppointment = async ({ params: { id }}: { params:{ id:string }}) => {
    const patient = await getPatient(id);

    return (
        <div className="flex h-screen max-h-screen">
            
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 justify-between">
                    <Image className="mb-12 h-10 w-fit object-center" src={"/assets/icons/logo-full.svg"} alt={"patient"} width={1000} height={40}/>
                    <AppointmentFrom userId={id} type="create" patientId={patient.$id}/>
                    <p className="copyright mt-10 py-12">
                        © {new Date().getFullYear()} CarePulse 
                    </p>
                </div>
            </section>
            <Image className="side-img object-center max-w-[390px] bg-bottom rounded-l-3xl" src={"/assets/images/appointment-img.png"} alt={"patient"} width={1000} height={1000}/>
        </div>
    );
};

export default NewAppointment;
