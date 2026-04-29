type Props = {
 titulo:string;
};

function PageTitle({titulo}:Props){
 return(
   <h1 className="
      text-3xl
      font-bold
      mb-6
   ">
      {titulo}
   </h1>
 )
}

export default PageTitle;