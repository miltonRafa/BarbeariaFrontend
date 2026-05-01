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
};

function Dropdown({ label, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="w-full md:w-80">
      {label && (
        <p className="text-[#9ca3af] text-sm mb-2">{label}</p>
      )}

      <div className="relative">
        {/* Botao com area de toque confortavel para mobile. */}
        <button
          onClick={() => setOpen(!open)}
          className="
            w-full
            bg-[#1a1a1d]
            border border-white/10
            text-white
            px-4 py-3
            rounded-lg
            flex
            justify-between
            items-center
            hover:border-[#c6a15b]
            focus:border-[#c6a15b]
            transition
          "
        >
          <span>
            {selected?.label ?? "Selecione"}
          </span>

          <span className="text-[#c6a15b]">▼</span>
        </button>

        {/* Lista posicionada acima do conteudo para nao empurrar cards vizinhos. */}
        {open && (
          <div
            className="
                absolute
                mt-2
                w-full
                bg-[#121214]
                border border-white/10
                rounded-lg
                shadow-xl
                overflow-hidden
                z-[9999]
            "
            >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="
                  px-4 py-3
                  cursor-pointer
                  hover:bg-[#c6a15b]
                  hover:text-black
                  transition
                "
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
