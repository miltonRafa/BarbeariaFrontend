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
<div className="responsive-scroll">
{/* Tabelas preservam colunas e rolam apenas dentro do proprio bloco em telas estreitas. */}
<table className="min-w-[560px] w-full overflow-hidden rounded-lg bg-white shadow">

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
</div>
 )

}

export default Table;
