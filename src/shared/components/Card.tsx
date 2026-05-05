type CardProps = {
 children: React.ReactNode;
 className?: string;
};

function Card({children, className = ""}:CardProps){

 return(
  <div className={`rounded-lg border border-[#1f1f23] bg-[#121214]/95 p-4 text-white shadow sm:p-5 lg:p-6 ${className}`}>
    {children}
  </div>
 );

}

export default Card;
