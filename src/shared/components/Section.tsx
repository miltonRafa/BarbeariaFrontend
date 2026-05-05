type SectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

function Section({ title, description, children, className = "" }: SectionProps) {
  return (
    <section className={`rounded-lg border border-[#1f1f23] bg-[#121214]/95 p-4 text-white sm:p-5 lg:p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-4 grid gap-1">
          {title && <h2 className="text-lg font-bold text-[#c59d5f] sm:text-xl">{title}</h2>}
          {description && <p className="text-sm leading-6 text-[#9ca3af]">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export default Section;
