type InputProps = {
 id?: string;
 name?: string;
 placeholder?: string;
 value?: string;
 onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
 type?: string;
};

function Input({
 id,
 name,
 placeholder,
 value,
 onChange,
 type="text"
}:InputProps){

 return(
   <input
    id={id}
    name={name ?? id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="
      border
      rounded-lg
      px-4
      py-3
      min-h-11
      w-full
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "
   />
 );
}

export default Input;
