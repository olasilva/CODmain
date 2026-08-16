import Logo from "./Logo";

/**
 * The persistent blue branding panel used on the left side of the
 * Welcome screen and the admission flow (course selection, application
 * form, submission confirmation). On small screens it collapses into a
 * compact top bar instead.
 */
export default function BrandPanel() {
  return (
    <>
      <div className="hidden md:flex md:w-[31%] lg:w-[30%] bg-cod-panel flex-col items-center justify-center text-center px-8 relative shrink-0">
        <div className="animate-fadeUp">
          <div className="mb-6 flex justify-center">
            <Logo className="h-28 w-28" />
          </div>
          <h1 className="text-white text-2xl lg:text-3xl font-semibold leading-snug tracking-wide">
            WELCOME TO
            <br />
            CLAN OF DAVID
            <br />
            ART AND MUSIC
            <br />
            ACADEMY
          </h1>
        </div>
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 bg-cod-panel flex items-center gap-3 px-5 py-4 z-10">
        <Logo className="h-10 w-10" />
        <span className="text-white font-semibold text-sm leading-tight">
          Clan of David Art and Music Academy
        </span>
      </div>
    </>
  );
}
