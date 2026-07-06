export default function PixelDivider() {
  return (
    <div className="flex w-full h-[3px] overflow-hidden">
      <div className="flex-1 bg-[var(--accent)]" />
      <div className="flex-1 bg-[var(--accent)]/40" />
      <div className="flex-1 bg-[var(--accent)]/10" />
      <div className="flex-1 bg-transparent" />
      <div className="flex-1 bg-[var(--accent)]/10" />
      <div className="flex-1 bg-[var(--accent)]/40" />
      <div className="flex-1 bg-[var(--accent)]" />
    </div>
  );
}
