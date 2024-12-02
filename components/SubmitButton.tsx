import Image from "next/image";
import { Button } from "./ui/button";

interface ButtonProps{
    isLoading: boolean,
    className?: string,
    children : React.ReactNode
}
const SubmitButton = ({ isLoading, className, children}: ButtonProps) => {
    return (
        <Button disabled={isLoading} type="submit" className={className ?? "shad-primary-btn w-full"}>
            {isLoading?(
                <div className="flex items-center gap-4">
                    <Image className="object-contain animate-spin" src={"/assets/icons/loader.svg"} alt={"loader"} width={24} height={24}/>
                    Loading ...
                </div>
            ):
                children
            }
        </Button>
    );
};

export default SubmitButton;
