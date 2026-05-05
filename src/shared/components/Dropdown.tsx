import { useState } from "react";

type Option = {
  label: string;
  value: number | string;
};

type Props = {
  label?: string;
  options: Option[];
  value: number | string | null;
  onChange: (value: Option["value"]) => void;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
};

function Dropdown({
  label,
  options,
  value,
  onChange,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Pesquisar",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = options.find((o) => o.value === value);
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : options;

  return (
    <div className="w-full min-w-0">
      {label && (
        <p className="text-[#9ca3af] text-sm mb-2">{label}</p>
      )}

      <div className="relative">
        {/* Botao com area de toque confortavel para mobile. */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setOpen(!open);
            setSearch("");
          }}
          className="
            w-full
            min-w-0
            bg-[#1a1a1d]
            border border-white/10
            text-white
            min-h-11
            px-4 py-3
            rounded-lg
            flex
            justify-between
            items-center
            sm:hover:border-[#c6a15b]
            focus:border-[#c6a15b]
            disabled:cursor-not-allowed
            disabled:opacity-50
            transition
          "
        >
          <span className="min-w-0 truncate text-left">
            {selected?.label ?? "Selecione"}
          </span>

          <span className="ml-3 shrink-0 text-[#c6a15b]">▼</span>
        </button>

        {/* Lista posicionada acima do conteudo para nao empurrar cards vizinhos. */}
        {open && (
          <div
            className="
                absolute
                mt-2
                w-full
                min-w-0
                bg-[#121214]
                border border-white/10
                rounded-lg
                shadow-xl
                overflow-hidden
                z-[9999]
            "
            >
            {searchable && (
              <div className="border-b border-white/10 p-2">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#c6a15b]"
                  autoFocus
                />
              </div>
            )}

            <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#9ca3af]">
                Nenhum item encontrado
              </div>
            ) : filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
                className="
                  px-4 py-3
                  cursor-pointer
                  truncate
                  sm:hover:bg-[#c6a15b]
                  sm:hover:text-black
                  transition
                "
              >
                {opt.label}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
