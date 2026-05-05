type ListItemProps = {
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

function ListItem({ title, subtitle, meta, children, actions }: ListItemProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/25 p-4">
      <div className="grid gap-3 sm:flex sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-sm leading-5 text-[#9ca3af]">{subtitle}</p>}
        </div>
        {meta && <div className="shrink-0 text-sm font-bold text-[#c59d5f]">{meta}</div>}
      </div>
      {children && <div className="mt-3 text-sm text-[#d1d5db]">{children}</div>}
      {actions && <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">{actions}</div>}
    </article>
  );
}

export default ListItem;
