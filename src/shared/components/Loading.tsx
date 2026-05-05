function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex min-h-24 items-center justify-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-[#9ca3af]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#c59d5f] border-t-transparent" />
      {label}
    </div>
  );
}

export default Loading;
