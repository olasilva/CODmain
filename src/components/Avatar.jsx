// src/components/Avatar.jsx
export default function Avatar({ src, name = '', size = 40, className = '' }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  const px = `${size}px`;

  if (src) {
    return (
      <div
        className={`rounded-full overflow-hidden bg-blue-50 flex items-center justify-center shrink-0 ${className}`}
        style={{ width: px, height: px }}
      >
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.innerHTML = `<span class="font-bold text-[#1A73E8]">${initial}</span>`;
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold shrink-0 ${className}`}
      style={{ width: px, height: px, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}