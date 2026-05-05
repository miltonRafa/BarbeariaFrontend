import { useEffect, useState } from "react";
import {
  atualizarProduto,
  criarProduto,
  excluirProduto,
  listarEstoque,
} from "../services/estoqueService";
import Button from "../../../shared/components/Button";
import EmptyState from "../../../shared/components/EmptyState";
import Input from "../../../shared/components/Input";
import ListItem from "../../../shared/components/ListItem";
import Loading from "../../../shared/components/Loading";
import Section from "../../../shared/components/Section";
import useDebounce from "../../../shared/hooks/useDebounce";

type Produto = {
  id: number;
  nome: string;
  descricao?: string;
  precoVenda: number;
  precoCusto: number;
  quantidade: number;
  quantidadeMinima: number;
  alertaEstoque: boolean;
  ativo: boolean;
};

const vazio = {
  nome: "",
  descricao: "",
  precoVenda: "",
  precoCusto: "",
  quantidade: "",
  quantidadeMinima: "",
};

function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const buscaDebounced = useDebounce(busca, 350);
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function carregar(termo = buscaDebounced) {
    setCarregando(true);
    try {
      const data = await listarEstoque(termo);
      setProdutos(Array.isArray(data) ? data : []);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar(buscaDebounced);
  }, [buscaDebounced]);

  async function salvar(event: React.FormEvent) {
    event.preventDefault();

    if (!form.nome || !form.precoVenda || !form.precoCusto || !form.quantidade || !form.quantidadeMinima) {
      alert("Preencha nome, preço de venda, preço de custo, quantidade e estoque mínimo.");
      return;
    }

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      precoVenda: Number(form.precoVenda),
      precoCusto: Number(form.precoCusto),
      quantidade: Number(form.quantidade),
      quantidadeMinima: Number(form.quantidadeMinima),
      ativo: editando?.ativo ?? true,
    };

    if (editando) {
      await atualizarProduto(editando.id, payload);
    } else {
      await criarProduto(payload);
    }

    setForm(vazio);
    setEditando(null);
    await carregar();
  }

  function editar(produto: Produto) {
    setEditando(produto);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao ?? "",
      precoVenda: String(produto.precoVenda),
      precoCusto: String(produto.precoCusto ?? 0),
      quantidade: String(produto.quantidade),
      quantidadeMinima: String(produto.quantidadeMinima ?? 0),
    });
  }

  async function excluir(id: number) {
    if (!confirm("Excluir este produto do estoque?")) return;
    await excluirProduto(id);
    await carregar();
  }

  return (
    <div>
      <div className="mb-6 grid gap-2">
        <h1 className="text-2xl font-bold text-[#c59d5f] sm:text-3xl">Estoque</h1>
        <p className="text-sm leading-6 text-[#9ca3af]">
          Busque, cadastre e atualize produtos com uma lista otimizada para toque.
        </p>
      </div>

      <Section title={editando ? "Editar produto" : "Cadastrar produto"} className="mb-6">
        <form onSubmit={salvar} className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input label="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Shampoo" />
            <Input label="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Uso profissional" />
            <Input label="Preço venda" value={form.precoVenda} onChange={(e) => setForm({ ...form, precoVenda: e.target.value })} type="number" step="0.01" placeholder="25,00" />
            <Input label="Preço custo" value={form.precoCusto} onChange={(e) => setForm({ ...form, precoCusto: e.target.value })} type="number" step="0.01" placeholder="12,00" />
            <Input label="Quantidade" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} type="number" min="0" placeholder="10" />
            <Input label="Estoque mínimo" value={form.quantidadeMinima} onChange={(e) => setForm({ ...form, quantidadeMinima: e.target.value })} type="number" min="0" placeholder="3" />
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <Button type="submit">{editando ? "Salvar edição" : "Cadastrar"}</Button>
            {editando && (
              <Button type="button" variant="secondary" onClick={() => { setEditando(null); setForm(vazio); }}>
                Cancelar edição
              </Button>
            )}
          </div>
        </form>
      </Section>

      <Section className="mb-6">
        <Input
          label="Buscar produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite nome, descrição ou produto"
          className="text-center sm:text-left"
        />
      </Section>

      {carregando ? (
        <Loading label="Buscando produtos..." />
      ) : produtos.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Cadastre um produto ou ajuste o termo da busca."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {produtos.map((produto) => (
            <ListItem
              key={produto.id}
              title={produto.nome}
              subtitle={produto.descricao || "Sem descrição"}
              meta={
                <span className={produto.alertaEstoque ? "text-amber-200" : "text-[#c59d5f]"}>
                  {produto.quantidade} un.
                </span>
              }
              actions={
                <>
                  <Button variant="secondary" onClick={() => editar(produto)}>Editar</Button>
                  <Button variant="danger" onClick={() => excluir(produto.id)}>Excluir</Button>
                </>
              }
            >
              <div className="grid gap-2">
                <p><strong>Preço:</strong> {formatarMoeda(produto.precoVenda)}</p>
                <p><strong>Custo:</strong> {formatarMoeda(produto.precoCusto ?? 0)}</p>
                <p><strong>Estoque mínimo:</strong> {produto.quantidadeMinima ?? 0} un.</p>
                {produto.alertaEstoque && <p className="font-semibold text-amber-200">Estoque baixo</p>}
              </div>
            </ListItem>
          ))}
        </div>
      )}
    </div>
  );
}

function formatarMoeda(valor: number) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default Estoque;
