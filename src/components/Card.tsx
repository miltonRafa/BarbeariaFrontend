type CardProps = {
 children: React.ReactNode;
};

function Card({children}:CardProps){

 return(
  // Superficies menores no mobile reduzem rolagem sem perder hierarquia visual.
  <div className="
   rounded-lg
   border
   border-white/10
   bg-white
   p-4
   shadow
   sm:p-5
   lg:p-6
  ">
    {children}
  </div>
 );

}

export default Card;
