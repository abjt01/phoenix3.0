import Link from "next/link";
export const metadata = {
  title: "PHOENIX 3.0 — Rise. Rebuild. Reinvent.",
  description: "DSCE's Annual Celebration of Knowledge, Creativity, and Innovation. Witness the transformation on March 5–6.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col justify-center items-center px-6 ember-bg -mt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 mt-0">
          {/* <img
            src="/bird.jpeg"
            alt=""
            className="w-full h-full object-cover opacity-100 mix-blend-overlay"
          /> */}
          <div className="absolute inset-0 bg-background-dark/30"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/50 to-background-dark pointer-events-none z-1"></div>
        <div className="relative z-10 text-center max-w-5xl">
          <h1 className="text-5xl md:text-8xl font-bold leading-[1.1] tracking-tighter mb-8 mt-30 glow-text ">
            PHOENIX 3.0 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff9d5c]">Rise. Rebuild. Reinvent.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Annual Celebration of Knowledge, Creativity, and Innovation.{" "}
            Witness the transformation on <span className="text-white font-medium underline decoration-primary underline-offset-4">March 5–6</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/events" className="w-full sm:w-auto min-w-[220px] bg-primary text-white font-bold py-5 px-8 rounded-lg text-sm tracking-widest uppercase btn-glow text-center">
              Explore the Flame
            </Link>
            <a href="/brochure.pdf" download className="w-full sm:w-auto min-w-[220px] bg-transparent border border-white/20 hover:border-primary/50 text-white font-bold py-5 px-8 rounded-lg text-sm tracking-widest uppercase transition-all hover:bg-white/5 text-center">
              Download Brochure
            </a>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <p className="text-[10px] tracking-[0.3em] uppercase">Scroll to awaken</p>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </main>

      {/* The Awakening Section */}
      <section className="py-24 md:py-32 px-6 bg-background-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/2">
              <h2 className="text-primary text-sm font-bold tracking-[0.4em] uppercase mb-4">The Awakening</h2>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
                Ignite Your <br /> Potential
              </h3>
              <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
                Phoenix 3.0 is more than a festival—it&apos;s a catalyst for the next generation of thinkers. Experience the evolution of creativity and tech at DSCE&apos;s premier flagship celebration.
              </p>
              <div className="h-1 w-24 bg-primary rounded-full"></div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Card 1 */}
              <div className="bg-accent-dark/30 border border-primary/10 p-8 rounded-xl hover:bg-accent-dark/50 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">flare</span>
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-tight">Rise</h4>
                <p className="text-white/50 text-sm leading-relaxed">Overcome boundaries and elevate your professional skills through high-octane workshops.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-accent-dark/30 border border-primary/10 p-8 rounded-xl hover:bg-accent-dark/50 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">architecture</span>
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-tight">Rebuild</h4>
                <p className="text-white/50 text-sm leading-relaxed">Construct new foundations for the future with hands-on technical architecture sessions.</p>
              </div>
              {/* Card 3 */}
              <div className="bg-accent-dark/30 border border-primary/10 p-8 rounded-xl hover:bg-accent-dark/50 transition-all group md:col-span-2">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-3 tracking-tight">Reinvent</h4>
                    <p className="text-white/50 text-sm leading-relaxed max-w-md">Transform raw ideas into groundbreaking reality. Collaborate with industry leaders and visionary creators to change the status quo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Divider */}
      <div className="w-full h-[400px] overflow-hidden relative">
        <img
          alt=""
          className="w-full h-full object-cover opacity-40  hover:grayscale-0 transition-all duration-1000"
          data-alt=""
          src="/bird.jpeg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark"></div>
      </div>

      {/* Final CTA Section */}
      <section className="py-24 md:py-40 px-6 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">Join the Flame</h2>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Be part of the transformation. Secure your spot for March 5–6 and witness the rebirth of innovation.
          </p>
          <div className="flex justify-center">
            <a href="/brochure.pdf" download className="min-w-[280px] bg-primary text-white font-bold py-6 px-10 rounded-lg text-sm tracking-[0.2em] uppercase btn-glow inline-block text-center">
              Download Brochure
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
