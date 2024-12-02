import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const RegisterPage = async ({params:{id}}: SearchParamProps) => {
    const user = await getUser(id);

    if (!user) {
        return notFound();
    }
    
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
                    <Image className="mb-12 h-10 w-fit object-center" src={"/assets/icons/logo-full.svg"} alt={"patient"} width={1000} height={40}/>
                    <RegisterForm user={user}/>
                    <p className="copyright py-12">
                        © {new Date().getFullYear()} CarePulse 
                    </p>
                </div>
            </section>
            <Image className="side-img object-center max-w-[390px] rounded-l-3xl" src={"/assets/images/register-img.png"} alt={"register"} width={1000} height={1000}/>
        </div>
    );
};

export default RegisterPage;
