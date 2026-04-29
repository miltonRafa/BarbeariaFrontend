type InputProps = {
 placeholder?: string;
 value?: string;
 onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
 type?: string;
};

function Input({
 placeholder,
 value,
 onChange,
 type="text"
}:InputProps){

 return(
   <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="
      border
      rounded-xl
      px-4
      py-2
      w-full
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "
   />
 );
}

export default Input;