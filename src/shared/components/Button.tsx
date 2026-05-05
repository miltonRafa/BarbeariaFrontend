type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success";
  disabled?: boolean;
  className?: string;
};

function Button({
 children,
 onClick,
 type="button",
 variant = "primary",
 disabled = false,
 className = "",
}: ButtonProps){
 const variants = {
   primary: "bg-[#c59d5f] text-black border-[#c59d5f]",
   secondary: "bg-transparent text-[#c59d5f] border-[#c59d5f]/50",
   danger: "bg-red-600 text-white border-red-600",
   success: "bg-emerald-500 text-black border-emerald-500",
 };

 return(
   <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`min-h-11 w-full rounded-lg border px-4 py-3 text-center font-bold transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${variants[variant]} ${className}`}
   >
    {children}
   </button>
 );
}

export default Button;
