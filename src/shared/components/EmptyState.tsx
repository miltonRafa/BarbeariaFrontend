type EmptyStateProps = {
  title: string;
  description?: string;
};

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-black/20 p-6 text-center">
      <p className="font-bold text-white">{title}</p>
      {description && <p className="mt-2 text-sm leading-6 text-[#9ca3af]">{description}</p>}
    </div>
  );
}

export default EmptyState;
