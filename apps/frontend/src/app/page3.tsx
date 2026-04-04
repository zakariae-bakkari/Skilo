export default function LandingPage3() {
  return (
        <div className="relative z-10 flex-1 max-w-[580px] animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-[rgba(212,240,0,0.1)] border border-[rgba(212,240,0,0.25)] rounded-full px-[14px] py-[5px] mb-7">
            <span className="text-[#D4F000] text-[0.7rem]">✦</span>
            <span className="text-[#D4F000] text-[0.8rem] font-semibold tracking-[0.06em] uppercase">
              Plateforme de compétences
            </span>
          </div>


          <h1 className="font-display text-[clamp(2.8rem,5.5vw,4.2rem)] font-extrabold leading-[1.08] tracking-tight text-[#F5F3FF] mb-6">
            Échangez ce que<br />
            vous <span className="text-[#D4F000]">savez faire</span>
          </h1>

          <p className="text-white/55 text-[1.05rem] leading-[1.7] max-w-[460px] mb-10 font-light">
            Trouvez quelqu'un qui a ce que vous cherchez, offrez ce que vous savez —
            sans argent, juste du temps et du talent.
          </p>
          </div>
  )
}