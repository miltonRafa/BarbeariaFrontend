type InputProps = {
 id?: string;
 name?: string;
 placeholder?: string;
 value?: string;
 onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
 type?: string;
 label?: string;
 disabled?: boolean;
 className?: string;
 min?: string;
 step?: string;
};

function Input({
 id,
 name,
 placeholder,
 value,
 onChange,
 type="text",
 label,
 disabled = false,
 className = "",
 min,
 step,
}:InputProps){

 return(
   <label className="grid gap-2 text-sm text-[#9ca3af]">
    {label && <span>{label}</span>}
    <input
     id={id}
     name={name ?? id}
     type={type}
     placeholder={placeholder}
     value={value}
     onChange={onChange}
     disabled={disabled}
     min={min}
     step={step}
     className={`min-h-11 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none transition placeholder:text-[#6b7280] focus:border-[#c59d5f] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
   </label>
 );
}

export default Input;
