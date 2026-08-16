import logo from "../assets/logo.png";

/**
 * Drop your real crest/logo file at: src/assets/logo.png
 * (any image format works — just keep the filename "logo.png",
 * or update the import path above if you rename it)
 */
export default function Logo({ className = "h-16 w-16" }) {
  return (
    <img
      src={logo}
      alt="Clan of David Art and Music Academy crest"
      className={`${className} object-contain rounded-xl bg-white shadow-md`}
    />
  );
}
