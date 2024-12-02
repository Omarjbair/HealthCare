"use client";

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import Image from "next/image";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from "libphonenumber-js/core";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Select, SelectContent, SelectValue, SelectTrigger } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";


export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
}

interface CustomProps{
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    placeholder?: string,
    label?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (filed: any) => React.ReactNode,
}

const RenderFiled = ({ field , props}: {field: any, props:CustomProps}) => {
    const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton, children, disabled, label, name } = props;

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && 
                        <Image className="ml-2" src={iconSrc as string} alt={iconAlt || "icon"} width={24} height={24}/>
                    }
                    <FormControl>
                        <Input placeholder={placeholder} {...field} className="shad-input border-0"/>
                    </FormControl>
                </div>
            );
        case FormFieldType.PHONE_INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <FormControl>
                        <PhoneInput placeholder={placeholder} value={field.value as E164Number | undefined} defaultCountry="US" international withCountryCallingCode onChange={field.onChange} className="input-phone " />
                    </FormControl>
                </div>
            );
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image className="ml-2" src={"/assets/icons/calendar.svg"} alt={"calender"} width={24} height={24} />
                    <FormControl>
                        <DatePicker placeholderText={placeholder?placeholder:"mm/dd/yyyy"} onChange={(date) => field.onChange(date)} selected={field.value} showTimeSelect={showTimeSelect ?? false} dateFormat={dateFormat ?? "MM/dd/yyyy"} timeInputLabel="Time:" wrapperClassName="date-picker"/>
                    </FormControl>
                </div>
            );
        case FormFieldType.SKELETON:
            return (
                renderSkeleton?renderSkeleton(field):null
            );
        case FormFieldType.SELECT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl className="shad-select-trigger">
                                <SelectTrigger>
                                    <SelectValue placeholder={placeholder}/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="shad-select-content">
                                {children}
                            </SelectContent>
                        </Select>
                    </FormControl>
                </div>
            );
        case FormFieldType.TEXTAREA:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <FormControl>
                        <Textarea className="shad-textArea" disabled={disabled} {...field} placeholder={placeholder}/>
                    </FormControl>
                </div>
            );
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex gap-4 items-center">
                        <Checkbox id={name} checked={field.value} onCheckedChange={field.onChange}/>
                        <label className="checkbox-label" htmlFor={name}>{label}</label>
                    </div>
                </FormControl>
            );
        default:
            return null
    }
}

const CustomFromField = (props: CustomProps) => {
    const { control, fieldType, name, label } = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full flex-1">
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel className="shad-input-label">{label}</FormLabel>
                    )}
                    <RenderFiled field={field} props={props} />
                    <FormMessage className="shad-error"/>
                </FormItem>
            )}/>
    );
}

export default CustomFromField;
