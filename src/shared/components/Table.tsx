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
<div>
<div className="grid gap-3 md:hidden">
{dados.map(item=>(
<article key={item.id} className="rounded-lg border border-white/10 bg-black/25 p-4 text-white">
<p className="font-bold">{item.nome}</p>
<p className="mt-1 text-sm text-[#9ca3af]">{item.email}</p>
</article>
))}
</div>

<div className="hidden overflow-x-auto md:block">
<table className="min-w-[560px] w-full overflow-hidden rounded-lg bg-[#121214] text-white shadow">

<thead>
<tr className="border-b border-white/10">
<th className="p-4 text-left">Nome</th>
<th className="p-4 text-left">Email</th>
</tr>
</thead>

<tbody>

{dados.map(item=>(
<tr key={item.id} className="border-b border-white/10">
<td className="p-4">{item.nome}</td>
<td className="p-4">{item.email}</td>
</tr>
))}

</tbody>

</table>
</div>
</div>
 )

}

export default Table;
