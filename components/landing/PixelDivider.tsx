export default function PixelDivider() {
  return (
    <div className="flex w-full h-[3px] overflow-hidden">
      <div className="flex-1 bg-[#F5C518]" />
      <div className="flex-1 bg-[#F5C518]/40" />
      <div className="flex-1 bg-[#F5C518]/10" />
      <div className="flex-1 bg-transparent" />
      <div className="flex-1 bg-[#F5C518]/10" />
      <div className="flex-1 bg-[#F5C518]/40" />
      <div className="flex-1 bg-[#F5C518]" />
    </div>
  );
}
