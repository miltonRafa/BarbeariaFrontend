type CardProps = {
 children: React.ReactNode;
};

function Card({children}:CardProps){

 return(
  <div className="
   bg-white
   rounded-2xl
   shadow
   p-6
  ">
    {children}
  </div>
 );

}

export default Card;