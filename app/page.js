'use client';
import Link from "next/link";
import Image from "next/image";
import Grainient from '@/components/ui/Grainient/Grainient';
import CountdownTimer from '@/components/CountdownTimer';
import CountUp from '@/components/CountUp';
import ScrollVelocity from '@/components/ScrollVelocity';
import { TextAnimate } from '@/components/ui/text-animate';
export default function HomePage() {
  let targetDate = new Date("2026-03-15T23:59:00+05:30");
  const now = new Date();
  const diffMs = targetDate - now;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return (
    <>
      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col justify-center items-center px-6 ember-bg -mt-10 pb-10 md:pb-30">
        {/* Grainient Background */}
        <div className="absolute inset-0 z-0">
          <Grainient
            color1="#4A7F9C"
            color2="#CC6528"
            timeSpeed={0.18}
            grainAmount={0.08}
            grainAnimated={false}
            warpStrength={0}
            warpFrequency={0}
            contrast={1.2}
            saturation={1.2}
            zoom={1}
          />
          <div className="absolute inset-0 bg-background-dark/40"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/50 to-background-dark pointer-events-none z-1"></div>

        {/* ScrollVelocity Decorative Top */}
        <div className="text-sl font-bold absolute top-10 md:top-30 w-full z-0 opacity-20 pointer-events-none overflow-hidden">

          <ScrollVelocity
            texts={[`👉🏻${diffDays.toFixed(0)} Days Until Registration Closes👈🏼`]}
            velocity={50}
            className="text-white"
          />
        </div>

        <div className="relative z-10 text-center max-w-5xl mt-10 md:mt-32">
          <h1 className="text-5xl md:text-9xl font-bold leading-[1.1] tracking-tighter mt-0 md:mt-20 glow-text ">
            <span className="gradient-title">PHOENIX 3.0</span> <br />
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tighter mt-2  glow-text ">
            <span className="text-white opacity-80 bg-clip-text bg-gradient-to-r from-primary to-[#ff9d5c]">
              <TextAnimate animation="blurIn">
                Rise. Rebuild. Reinvent.
              </TextAnimate>
            </span>
          </h1>
          <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto mb-6  mt-2 font-light leading-relaxed">
            Annual Celebration of Knowledge, Creativity, and Innovation.{" "}
            Witness the transformation on <span className="text-white font-medium underline decoration-primary underline-offset-4">March 17–18</span>.
          </p>
          <div className="mb-15 text-1xl md:text-2xl ">
            <CountdownTimer targetDate="2026-03-17T09:00:00+05:30" />
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/events" className="w-auto min-w-[200px] sm:min-w-[220px] bg-primary text-white font-bold py-5 px-8 rounded-lg text-sm tracking-widest uppercase btn-glow text-center">
              Explore the Flame
            </Link>
          </div>
        </div>
        {/* Hard black strip at the very bottom of hero — covers any canvas rendering seam from overflow:hidden */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-background-dark z-20 pointer-events-none" />
      </main>
      {/* Gap bridge — fills the mt-10 gap with exact body bg so no contrast line is visible on mobile */}
      <div className="h-10 bg-background-dark md:hidden" />



      {/* Stats Ribbon */}
      <div className="stats-ribbon py-8 md:py-14 mb-16 md:mb-24 mt-0 md:mt-0">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Mobile Grid Layout - Desktop Flex Layout */}
          <div className="grid grid-cols-2 gap-y-8 md:flex md:flex-row md:items-center md:justify-center md:gap-8 lg:gap-12">

            <div className="stat-item flex flex-col items-center justify-center">
              <div className="stat-value text-3xl md:text-[2.5rem] lg:text-[3.5rem]">
                <CountUp to={8} />
              </div>
              <div className="stat-label text-[0.6rem] md:text-[0.7rem]">Events</div>
            </div>

            <div className="hidden md:block stat-divider"></div>

            <div className="stat-item flex flex-col items-center justify-center">
              <div className="stat-value text-3xl md:text-[2.5rem] lg:text-[3.5rem]">
                <CountUp to={2} />
              </div>
              <div className="stat-label text-[0.6rem] md:text-[0.7rem]">Days</div>
            </div>

            {/* Horizontal divider for mobile */}
            <div className="col-span-2 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent md:hidden"></div>


            {/* <div className="stat-item flex flex-col items-center justify-center">
              <div className="stat-value text-3xl md:text-[2.5rem] lg:text-[3.5rem]">
                <CountUp to={500} />
              </div>
              <div className="stat-label text-[0.6rem] md:text-[0.7rem]">Participants</div>
            </div> */}

            <div className="hidden md:block stat-divider"></div>

            <div className="col-span-2 md:col-span-1 stat-item flex flex-col items-center justify-center">
              <div className="stat-value text-3xl md:text-[2.5rem] lg:text-[3.5rem] ">
                Exciting
              </div>
              <div className="stat-label text-[0.6rem] md:text-[0.7rem]">Cash Prizes</div>
            </div>

          </div>
        </div>
      </div>

      {/* Visual Divider */}
      <div className="w-full h-[400px] overflow-hidden relative mt-16 md:mt-32">
        <Image
          alt="Phoenix 3.0 visual"
          className="w-full h-full object-cover opacity-40 hover:grayscale-0 transition-all duration-1000"
          src="/bird2.png"
          fill
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark"></div>
      </div>

      {/* Final CTA Section */}
      <section className="py-24 md:py-40 px-6 bg-background-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8"><span className="gradient-title">Join the Flame</span></h2>
          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Be part of the transformation. Secure your spot for March 17–18 and witness the rebirth of innovation.
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
