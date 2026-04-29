type Cliente = {
 id:number;
 nome:string;
 email:string;
};

type Props = {
 dados: Cliente[];
};

function Table({dados}:Props){

 return(
<table className="w-full bg-white rounded-xl shadow">

<thead>
<tr className="border-b">
<th className="p-4 text-left">Nome</th>
<th className="p-4 text-left">Email</th>
</tr>
</thead>

<tbody>

{dados.map(item=>(
<tr key={item.id} className="border-b">
<td className="p-4">{item.nome}</td>
<td className="p-4">{item.email}</td>
</tr>
))}

</tbody>

</table>
 )

}

export default Table;