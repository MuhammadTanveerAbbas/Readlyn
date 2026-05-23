export default function EditorLoading() {
  return (
    <div className="h-screen w-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-white/50 font-ibm-mono text-[11px] tracking-[0.5px]">
          Loading editor...
        </p>
      </div>
    </div>
  );
}
