import { useEffect, useState } from "react";
import {
  atualizarNotificacaoConfig,
  getNotificacaoConfig,
  type NotificacaoConfig,
} from "../../notificacao/services/notificacaoService";

const padrao: NotificacaoConfig = {
  emailContasPagarAtivo: true,
  whatsappAgendamentoAtivo: true,
};

function Configuracoes() {
  const [config, setConfig] = useState<NotificacaoConfig>(padrao);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getNotificacaoConfig().then(setConfig).catch(console.error);
  }, []);

  async function salvar(novoConfig: NotificacaoConfig) {
    setConfig(novoConfig);
    setSalvando(true);
    try {
      setConfig(await atualizarNotificacaoConfig(novoConfig));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-[#c59d5f] sm:text-3xl">
        Configurações
      </h1>
      <p className="mb-6 text-sm text-[#9ca3af]">
        Controle notificações automáticas enviadas pelo sistema.
      </p>

      <section className="grid gap-4 xl:grid-cols-2">
        <ToggleCard
          title="Email de contas a pagar"
          description="Envia email às 08:00 para admins ativos quando houver conta a pagar vencendo no dia."
          checked={config.emailContasPagarAtivo}
          onChange={(checked) => salvar({ ...config, emailContasPagarAtivo: checked })}
        />

        <ToggleCard
          title="WhatsApp de agendamento"
          description="Envia lembrete automático ao telefone do cliente 30 minutos antes do atendimento."
          checked={config.whatsappAgendamentoAtivo}
          onChange={(checked) => salvar({ ...config, whatsappAgendamentoAtivo: checked })}
        />
      </section>

      {salvando && <p className="mt-4 text-sm text-[#9ca3af]">Salvando configurações...</p>}
    </div>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <article className="rounded-lg border border-[#1f1f23] bg-[#121214] p-5 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#c59d5f]">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#9ca3af]">{description}</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            className="peer sr-only"
          />
          <span className="h-7 w-12 rounded-full bg-white/10 transition peer-checked:bg-[#c59d5f]" />
          <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5 peer-checked:bg-black" />
        </label>
      </div>
      <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-bold ${checked ? "bg-emerald-500 text-black" : "bg-red-500/20 text-red-200"}`}>
        {checked ? "Ativo" : "Desativado"}
      </span>
    </article>
  );
}

export default Configuracoes;
