'use client';
import Link from "next/link";
import Image from "next/image";
import Grainient from '@/components/ui/Grainient/Grainient';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col justify-center items-center px-6 ember-bg -mt-10">
        {/* Grainient Background */}
        <div className="absolute inset-0 z-0">
          <Grainient
            color1="#1565C0"
            color2="#FF4500"
            // color3="#05060D"
            timeSpeed={0.18}
            grainAmount={0.08}
            grainAnimated={true}
            warpStrength={1.2}
            warpFrequency={4.0}
            contrast={1.4}
            saturation={1.2}
            zoom={0.85}
          />
          <div className="absolute inset-0 bg-background-dark/40"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/50 to-background-dark pointer-events-none z-1"></div>
        <div className="relative z-10 text-center max-w-5xl mb-10">
          <h1 className="text-5xl md:text-8xl font-bold leading-[1.1] tracking-tighter mb-8 mt glow-text ">
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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 pt-10 z-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white">Scroll to awaken</p>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent "></div>
        </div>
      </main>



      {/* Visual Divider */}
      <div className="w-full h-[400px] overflow-hidden relative">
        <Image
          alt="Phoenix 3.0 visual"
          className="w-full h-full object-cover opacity-40 hover:grayscale-0 transition-all duration-1000"
          src="/bird.jpeg"
          fill
          sizes="100vw"
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
