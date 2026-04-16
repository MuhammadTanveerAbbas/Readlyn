import Link from "next/link";

export default function BrandLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-[10px] group">
      <img
        src="/favicon.svg"
        alt="Readlyn"
        width={22}
        height={22}
        className="group-hover:scale-110 transition-transform"
        style={{ imageRendering: "pixelated" }}
      />
      <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
        READLYN
      </span>
    </Link>
  );
}
