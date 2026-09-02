import Logo from "./Logo";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-cod-panel px-6">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[32px] border-white/10" />
      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[40px] border-white/10" />

      <div className="relative flex max-w-sm flex-col items-center text-center animate-fadeIn">
        <div className="mb-7 rounded-[28px] bg-white/15 p-3 shadow-2xl backdrop-blur-sm animate-scaleIn">
          <Logo className="h-28 w-28 sm:h-32 sm:w-32" />
        </div>
        <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl">
          Clan of David
          <span className="block text-base font-medium text-blue-100 sm:text-lg">Art and Music Academy</span>
        </h1>
        <div className="mt-8 flex items-center gap-2" aria-label="Loading">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-white/70 animate-pulse [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-white/40 animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
