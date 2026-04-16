interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AuthInput({ label, error, ...props }: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-ibm-mono text-[11px] text-[#555] tracking-[1px] uppercase">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border text-white text-[13px] font-ibm-mono placeholder:text-[#333]
          focus:outline-none transition-all duration-200
          ${
            error
              ? "border-[#ef4444]/50 focus:border-[#ef4444]/80 focus:ring-1 focus:ring-[#ef4444]/20"
              : "border-white/[0.07] focus:border-[rgba(245,197,24,0.4)] focus:ring-1 focus:ring-[rgba(245,197,24,0.15)]"
          }`}
      />
      {error && (
        <p className="font-ibm-mono text-[11px] text-[#ef4444] tracking-[0.3px]">
          {error}
        </p>
      )}
    </div>
  );
}
