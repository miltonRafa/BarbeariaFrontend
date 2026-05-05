import { useEffect, useState } from "react";
import { baixarRelatorioPdf, excluirRelatorio, gerarRelatorioFuncionarios, listarRelatorios } from "../services/relatorioService";
import Button from "../../../shared/components/Button";
import EmptyState from "../../../shared/components/EmptyState";
import Input from "../../../shared/components/Input";
import ListItem from "../../../shared/components/ListItem";
import Loading from "../../../shared/components/Loading";
import Section from "../../../shared/components/Section";

type Relatorio = {
  id: number;
  tipo: string;
  inicio?: string;
  fim?: string;
  resumo: string;
  geradoEm: string;
};

type TipoRelatorio = "rentabilidade" | "ranking" | "folha-pagamento" | "comissoes" | "custos";

const tiposRelatorio: Array<{ label: string; value: TipoRelatorio }> = [
  { label: "Rentabilidade", value: "rentabilidade" },
  { label: "Ranking", value: "ranking" },
  { label: "Folha", value: "folha-pagamento" },
  { label: "Comissões", value: "comissoes" },
  { label: "Custos", value: "custos" },
];

function Relatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const hoje = new Date().toISOString().split("T")[0];
  const [inicio, setInicio] = useState(hoje.slice(0, 8) + "01");
  const [fim, setFim] = useState(hoje);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoRelatorio>("rentabilidade");
  const [carregando, setCarregando] = useState(false);

  async function carregar() {
    setCarregando(true);
    try {
      const data = await listarRelatorios();
      setRelatorios(Array.isArray(data) ? data : []);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function gerar() {
    await gerarRelatorioFuncionarios(tipoSelecionado, inicio, fim);
    await carregar();
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este relatório gerado? Os dados base serão mantidos.")) return;
    await excluirRelatorio(id);
    await carregar();
  }

  return (
    <div>
      <div className="mb-6 grid gap-2">
        <h1 className="text-2xl font-bold text-[#c59d5f] sm:text-3xl">Relatórios</h1>
        <p className="text-sm leading-6 text-[#9ca3af]">
          Gere relatórios por tipo e acompanhe o histórico em cards fáceis de ler no celular.
        </p>
      </div>

      <Section title="Gerar relatórios de funcionários" className="mb-6">
        <div className="-mx-4 mb-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2">
            {tiposRelatorio.map((tipo) => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setTipoSelecionado(tipo.value)}
                className={`min-h-11 rounded-lg border px-4 py-3 text-sm font-bold transition ${
                  tipoSelecionado === tipo.value
                    ? "border-[#c59d5f] bg-[#c59d5f] text-black"
                    : "border-white/10 bg-black/25 text-white"
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <Input label="Data inicial" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          <Input label="Data final" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
        </div>
        <Button onClick={gerar}>Gerar relatório</Button>
      </Section>

      {carregando ? (
        <Loading label="Carregando relatórios..." />
      ) : relatorios.length === 0 ? (
        <EmptyState title="Nenhum relatório gerado ainda" description="Escolha um tipo acima e gere o primeiro relatório." />
      ) : (
        <div className="grid gap-4">
          {relatorios.map((relatorio) => (
            <ListItem
              key={relatorio.id}
              title={relatorio.tipo}
              subtitle={`${relatorio.inicio ?? "início"} até ${relatorio.fim ?? "fim"} • ${new Date(relatorio.geradoEm).toLocaleString("pt-BR")}`}
              actions={
                <>
                  <Button onClick={() => baixarRelatorioPdf(relatorio.id)}>Baixar PDF</Button>
                  <Button variant="danger" onClick={() => excluir(relatorio.id)}>Excluir</Button>
                </>
              }
            >
              <p className="mt-4 leading-7 text-[#d1d5db]">{relatorio.resumo}</p>
            </ListItem>
          ))}
        </div>
      )}
    </div>
  );
}

export default Relatorios;
