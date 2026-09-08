"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  Fingerprint,
  LockKeyhole,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import NetworkGlobe from "@/components/shared/NetworkGlobe";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#020106] text-white">

      {/* =========================================================
          FIXED BACKGROUND ORBS
          These NEVER move with the page content.
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* HUGE PRIMARY ORB */}
        <div className="absolute right-[-100px] top-[20px] h-[900px] w-[900px]">
          <img
            src="/ai-orb.png"
            alt=""
            className="h-full w-full object-contain opacity-[0.80] mix-blend-screen"
          />
        </div>

        {/* SECONDARY ORB — LOWER LEFT */}
        <div className="absolute bottom-[-280px] left-[-250px] h-[650px] w-[650px]">
          <img
            src="/ai-orb.png"
            alt=""
            className="h-full w-full object-contain opacity-[1] mix-blend-screen"
          />
        </div>


        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,85,247,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,.04) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* DARK VIGNETTE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_42%,transparent_5%,rgba(2,1,6,.45)_55%,#020106_100%)]" />

      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================== */}

      <nav className="relative z-50 mx-auto flex max-w-[1550px] items-center justify-between px-6 py-6 lg:px-10">

        <Link href="/" className="flex items-center gap-3">

          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#a855f7]/30 bg-black/30 backdrop-blur-xl">

            <ShieldCheck className="h-5 w-5 text-[#c084fc]" />

            <div className="absolute inset-[-5px] rounded-full border border-[#a855f7]/10" />

          </div>

          <div>
            <p className="text-[15px] font-bold tracking-tight">
              Secure<span className="text-[#a855f7]">Bank</span>
            </p>

            <p className="font-mono text-[7px] uppercase tracking-[0.35em] text-white/20">
              Privacy Intelligence
            </p>
          </div>

        </Link>

        <div className="hidden items-center gap-10 md:flex">

          <a
            href="#technology"
            className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/30 transition hover:text-[#fbbf24]"
          >
            Technology
          </a>

          <a
            href="#network"
            className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/30 transition hover:text-[#fbbf24]"
          >
            Network
          </a>

          <a
            href="#security"
            className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/30 transition hover:text-[#fbbf24]"
          >
            Security
          </a>

        </div>

        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-5 py-2.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur-xl transition hover:border-[#fbbf24]/40 hover:text-[#fbbf24]"
        >
          Command Center
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </Link>

      </nav>

      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative z-20 mx-auto min-h-[calc(100vh-90px)] max-w-[1550px] px-6 lg:px-10">

        <div className="grid min-h-[calc(100vh-90px)] items-center lg:grid-cols-[0.82fr_1.18fr]">

          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <div className="relative z-50 pb-20 pt-10 lg:pb-28">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#a855f7]/25 bg-black/40 px-4 py-2 backdrop-blur-xl">

              <Sparkles className="h-3 w-3 text-[#c084fc]" />

              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-[#c084fc]">
                AI-powered privacy infrastructure
              </span>

            </div>

            <h1 className="max-w-3xl text-[clamp(4rem,7vw,7.5rem)] font-semibold leading-[0.84] tracking-[-0.075em]">

              Fraud
              <br />

              intelligence
              <br />

              <span className="bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#fbbf24] bg-clip-text text-transparent">
                without exposure.
              </span>

            </h1>

            <p className="mt-9 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
              Detect fraudulent transactions using encrypted machine
              learning while keeping sensitive financial intelligence
              protected throughout inference.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/transactions/analyze"
                className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#9333ea] px-7 py-4 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white shadow-[0_0_45px_rgba(168,85,247,.2)] transition hover:scale-[1.02]"
              >
                Analyze Transaction

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />

              </Link>

              <a
                href="#technology"
                className="group flex items-center justify-center gap-3 rounded-full border border-white/10 bg-black/30 px-7 py-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/45 backdrop-blur-xl transition hover:border-white/20 hover:text-white"
              >
                <Play className="h-3 w-3 fill-current" />

                Explore System
              </a>

            </div>

            {/* TECH STATS */}

            <div className="mt-14 grid max-w-xl grid-cols-2 gap-y-6 border-t border-white/[0.07] pt-7 sm:grid-cols-4">

              <Tech
                icon={<Network />}
                value="08"
                label="GLOBAL NODES"
              />

              <Tech
                icon={<LockKeyhole />}
                value="CKKS"
                label="ENCRYPTION"
              />

              <Tech
                icon={<BrainCircuit />}
                value="POLY²"
                label="AI INFERENCE"
              />

              <Tech
                icon={<Fingerprint />}
                value="30D"
                label="FEATURE VECTOR"
              />

            </div>

          </div>

          {/* =====================================================
              RIGHT VISUAL
          ====================================================== */}

          <div
            id="network"
            className="relative h-[820px] lg:h-[900px]"
          >

            {/* =================================================
                GLOBE — NOW CONTRASTING GOLD/WHITE
            ================================================= */}

            <div className="absolute left-[50%] top-1/2 z-30 h-[570px] w-[570px] -translate-x-1/2 -translate-y-1/2">

              <NetworkGlobe />

            </div>

            {/* GOLD ATMOSPHERE BEHIND GLOBE */}

            <div className="pointer-events-none absolute left-[50%] top-1/2 z-20 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/[0.035] blur-[100px]" />

            {/* =================================================
                ORBIT RINGS
            ================================================== */}

            <div className="pointer-events-none absolute left-[50%] top-1/2 z-25 h-[720px] w-[280px] -translate-x-1/2 -translate-y-1/2 rotate-[30deg] rounded-[50%] border border-[#fbbf24]/20" />

            <div className="pointer-events-none absolute left-[50%] top-1/2 z-25 h-[290px] w-[740px] -translate-x-1/2 -translate-y-1/2 -rotate-[20deg] rounded-[50%] border border-[#fbbf24]/15" />

            {/* =================================================
                STATUS CARDS
            ================================================== */}

            <StatusCard
              className="left-[0%] top-[15%]"
              color="purple"
              title="ENCRYPTION"
              value="CKKS ACTIVE"
            />

            <StatusCard
              className="right-[0%] top-[19%]"
              color="gold"
              title="NETWORK"
              value="GLOBAL / LIVE"
            />

            <StatusCard
              className="bottom-[23%] left-[3%]"
              color="pink"
              title="AI ENGINE"
              value="POLY² ONLINE"
            />

            <StatusCard
              className="bottom-[12%] right-[3%]"
              color="white"
              title="THREAT MONITOR"
              value="REAL-TIME"
            />

            {/* =================================================
                CENTRAL SECURITY CORE
            ================================================== */}

            <div className="absolute left-[50%] top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">

              <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#fbbf24]/50 bg-[#050207]/90 shadow-[0_0_65px_rgba(251,191,36,.16)] backdrop-blur-xl">

                <div className="absolute inset-2 animate-spin rounded-full border border-dashed border-[#fbbf24]/35 [animation-duration:14s]" />

                <div className="absolute inset-[15px] rounded-full border border-[#fbbf24]/15" />

                <ShieldCheck className="h-7 w-7 text-[#fbbf24]" />

              </div>

            </div>

            {/* GLOBE LABEL */}

            <div className="absolute bottom-[6%] left-[50%] z-50 -translate-x-1/2 whitespace-nowrap text-center">

              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.35em] text-[#fbbf24]">
                GLOBAL THREAT NETWORK
              </p>

              <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.3em] text-white/25">
                PROTECTED TRANSACTION INTELLIGENCE
              </p>

            </div>

          </div>

        </div>

        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">

          <span className="font-mono text-[6px] uppercase tracking-[0.35em] text-white/15">
            Scroll to explore
          </span>

          <ArrowDown className="h-3 w-3 animate-bounce text-[#fbbf24]/50" />

        </div>

      </section>

      {/* =========================================================
          TECHNOLOGY
      ========================================================== */}

      <section
        id="technology"
        className="relative z-20 border-t border-white/[0.05]"
      >

        <div className="mx-auto max-w-[1550px] px-6 py-28 lg:px-10">

          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.35em] text-[#a855f7]">
            Privacy architecture
          </p>

          <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Intelligence moves.
            <br />

            <span className="text-white/25">
              Sensitive data doesn't.
            </span>
          </h2>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.05] md:grid-cols-4">

            <Architecture
              number="01"
              title="FEATURE EXTRACTION"
              icon={<Fingerprint />}
              description="Transaction information becomes a protected 30-dimensional representation."
            />

            <Architecture
              number="02"
              title="CKKS ENCRYPTION"
              icon={<LockKeyhole />}
              description="Features are encrypted before entering the inference pipeline."
            />

            <Architecture
              number="03"
              title="POLYNOMIAL AI"
              icon={<BrainCircuit />}
              description="The HE-compatible student model performs polynomial inference."
            />

            <Architecture
              number="04"
              title="RISK DECISION"
              icon={<ShieldCheck />}
              description="The resulting prediction becomes an actionable fraud decision."
            />

          </div>

        </div>

      </section>

      {/* =========================================================
          SECURITY
      ========================================================== */}

      <section
        id="security"
        className="relative z-20 border-t border-white/[0.05]"
      >

        <div className="mx-auto max-w-[1550px] px-6 py-28 lg:px-10">

          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.35em] text-[#fbbf24]">
                Secure computation
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">

                Compute on
                <br />

                <span className="bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#fbbf24] bg-clip-text text-transparent">
                  protected intelligence.
                </span>

              </h2>

              <p className="mt-7 max-w-xl text-sm leading-7 text-white/30">
                SecureBank combines homomorphic encryption with an
                HE-compatible polynomial student model to detect fraud
                while minimizing exposure of sensitive transaction data.
              </p>

              <Link
                href="/dashboard"
                className="group mt-9 inline-flex items-center gap-3 rounded-full border border-[#fbbf24]/20 bg-[#fbbf24]/[0.025] px-6 py-3.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#fbbf24] transition hover:bg-[#fbbf24]/[0.06]"
              >
                Enter Command Center

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />

              </Link>

            </div>

            {/* PIPELINE VISUAL */}

            <div className="relative h-[400px] overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#05030a]/80 backdrop-blur-xl">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,.08),transparent_55%)]" />

              <div className="absolute left-[15%] top-1/2 h-px w-[70%] bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent" />

              <div className="absolute left-1/2 top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-[#fbbf24]/25 to-transparent" />

              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#fbbf24]/30 bg-[#0b0512]">

                <BrainCircuit className="h-8 w-8 text-[#fbbf24]" />

              </div>

              <SystemNode
                className="left-[13%] top-1/2"
                title="RAW DATA"
                icon={<Fingerprint />}
              />

              <SystemNode
                className="right-[13%] top-1/2"
                title="RISK SCORE"
                icon={<ShieldCheck />}
              />

              <SystemNode
                className="left-1/2 top-[13%]"
                title="CKKS"
                icon={<LockKeyhole />}
              />

              <SystemNode
                className="bottom-[13%] left-1/2"
                title="POLY²"
                icon={<BrainCircuit />}
              />

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}

      <footer className="relative z-20 border-t border-white/[0.05]">

        <div className="mx-auto flex max-w-[1550px] justify-between px-6 py-8 font-mono text-[7px] uppercase tracking-[0.25em] text-white/15 lg:px-10">

          <span>
            SecureBank · Privacy Intelligence
          </span>

          <span>
            CKKS · POLY² · HOMOMORPHIC INFERENCE
          </span>

        </div>

      </footer>

    </main>
  );
}

/* =========================================================
   TECH ITEM
========================================================= */

function Tech({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5">

      <span className="text-[#fbbf24]">
        {icon}
      </span>

      <div>

        <p className="font-mono text-[9px] font-bold text-white/65">
          {value}
        </p>

        <p className="font-mono text-[6px] tracking-[0.18em] text-white/15">
          {label}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  className,
  color,
  title,
  value,
}: {
  className: string;
  color: "purple" | "cyan" | "pink" | "gold" | "white";
  title: string;
  value: string;
}) {
  const styles = {
    purple: "border-[#a855f7]/30 text-[#c084fc]",
    cyan: "border-[#22d3ee]/30 text-[#22d3ee]",
    pink: "border-[#ec4899]/30 text-[#ec4899]",
    gold: "border-[#fbbf24]/35 text-[#fbbf24]",
    white: "border-white/10 text-white/60",
  };

  return (
    <div
      className={`absolute z-50 rounded-2xl border bg-[#050308]/85 px-4 py-3 backdrop-blur-2xl ${styles[color]} ${className}`}
    >

      <div className="flex items-center gap-2">

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />

        <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-white/25">
          {title}
        </span>

      </div>

      <p className="mt-1 font-mono text-[8px] font-bold">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   ARCHITECTURE CARD
========================================================= */

function Architecture({
  number,
  title,
  icon,
  description,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="group bg-[#05030a] p-8 transition hover:bg-[#0b0612]">

      <div className="flex items-center justify-between">

        <span className="font-mono text-[8px] text-white/10">
          {number}
        </span>

        <span className="text-[#fbbf24]/50 transition group-hover:text-[#fbbf24]">
          {icon}
        </span>

      </div>

      <h3 className="mt-14 font-mono text-[9px] font-bold tracking-[0.2em] text-white/60">
        {title}
      </h3>

      <p className="mt-4 text-xs leading-6 text-white/20">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   SYSTEM NODE
========================================================= */

function SystemNode({
  className,
  title,
  icon,
}: {
  className: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 ${className}`}
    >

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#fbbf24]/20 bg-[#08030e] text-[#fbbf24]">
        {icon}
      </div>

      <span className="font-mono text-[6px] tracking-[0.25em] text-white/20">
        {title}
      </span>

    </div>
  );
}