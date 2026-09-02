import logo from "../assets/logo.jpg";

/**
 * Shared academy crest used across the admission and dashboard layouts.
 */
export default function Logo({ className = "h-16 w-16" }) {
  return (
    <img
      src={logo}
      alt="Clan of David Art and Music Academy crest"
      className={`${className} object-contain rounded-xl bg-white p-1 shadow-md`}
    />
  );
}
