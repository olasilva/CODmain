import heroImg from '../assets/IMG-20260709-WA0056.jpg'

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative z-10 order-2 md:order-1">
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-cod-pink/20 blur-2xl hidden md:block" />

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-cod-blue-dark leading-tight relative animate-slideDown">
            Nurturing Musical
            <br />
            Excellence &amp; Academic
            <br />
            Growth
          </h1>

          <p className="mt-6 text-slate-600 text-base md:text-lg max-w-md relative animate-slideUp" style={{ animationDelay: "150ms" }}>
            A christ-centred primary school offering Music, Regular, and
            Mixed programmes for every child's unique potential
          </p>

          <a
            href="#programmes"
            className="mt-8 inline-block bg-cod-pink text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:bg-pink-600 transition-colors relative animate-slideUp"
            style={{ animationDelay: "250ms" }}
          >
            Explore Programmes
          </a>
        </div>

        <div className="relative order-1 md:order-2 animate-slideInRight">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-cod-blue/20 blur-xl hidden md:block" />
          <img
            src={heroImg}
            alt="Young student playing piano at Clan of David Art & Music Academy"
            className="w-full aspect-[4/5] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>

      <a
        href="https://wa.me/2340000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.396.7 4.63 1.912 6.507L4 29l7.671-1.882A11.93 11.93 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3Zm0 21.818a9.77 9.77 0 0 1-4.983-1.363l-.357-.212-4.553 1.117 1.145-4.435-.233-.363A9.77 9.77 0 0 1 5.818 15c0-5.618 4.567-10.182 10.183-10.182 5.616 0 10.182 4.564 10.182 10.182 0 5.618-4.566 10.182-10.182 10.182Zm5.593-7.635c-.306-.153-1.81-.892-2.09-.994-.28-.102-.484-.153-.688.153-.204.306-.79.994-.968 1.198-.178.204-.357.23-.663.077-.306-.153-1.293-.477-2.462-1.52-.91-.812-1.525-1.815-1.703-2.121-.178-.306-.019-.472.134-.624.138-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.051-.383-.026-.536-.077-.153-.688-1.658-.943-2.271-.248-.596-.5-.516-.688-.526-.178-.009-.383-.011-.587-.011-.204 0-.536.077-.816.383-.28.306-1.07 1.045-1.07 2.55 0 1.505 1.096 2.96 1.249 3.164.153.204 2.156 3.293 5.224 4.619.73.315 1.298.503 1.742.644.732.233 1.397.2 1.924.121.587-.088 1.81-.74 2.065-1.454.255-.714.255-1.326.178-1.454-.077-.128-.28-.204-.586-.357Z"/>
        </svg>
      </a>
    </section>
  )
}
