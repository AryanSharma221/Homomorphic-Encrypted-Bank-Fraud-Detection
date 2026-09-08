"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Fingerprint,
  LockKeyhole,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

import { api } from "@/lib/api";
import { FraudAnalysisResult } from "@/lib/types";

export default function AnalyzeTransaction() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Online");
  const [merchantCategory, setMerchantCategory] =
    useState("Electronics");
  const [location, setLocation] = useState("Chennai");
  const [time, setTime] = useState("14:30");

  const [result, setResult] =
    useState<FraudAnalysisResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

   try {
  const response = await api.analyzeTransaction({
    amount: Number(amount),
    merchantCategory,
    location,
    type,
    time,
    previousTransactions: 0,
  });

  setResult(response);
    

      setResult(response);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to analyze this transaction. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020106] text-white">

 
      {/* ===================================================== */}
      {/* BACKGROUND */}
      {/* ===================================================== */}

<div className="pointer-events-none fixed inset-0">

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

  {/* PRIMARY ORB ATMOSPHERE */}
  <div className="absolute left-[55%] top-[5%] h-[600px] w-[600px] rounded-full bg-[#7c3aed]/[0.07] blur-[150px]" />

  {/* SECONDARY MAGENTA ATMOSPHERE */}
  <div className="absolute right-[-150px] top-[45%] h-[500px] w-[500px] rounded-full bg-[#ec4899]/[0.035] blur-[150px]" />

  {/* LOWER ORB ATMOSPHERE */}
  <div className="absolute bottom-[-150px] left-[15%] h-[450px] w-[450px] rounded-full bg-[#22d3ee]/[0.025] blur-[140px]" />

  {/* GRID */}
  <div
    className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(168,85,247,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,.035)_1px,transparent_1px)] [background-size:70px_70px]"
  />

  {/* VIGNETTE */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#020106_90%)]" />

</div>

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <header className="relative z-20 flex items-center justify-between border-b border-white/[0.06] px-6 py-5 lg:px-10">

        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#a855f7]/25 bg-[#a855f7]/[0.05]">
            <ShieldCheck className="h-4 w-4 text-[#a855f7]" />
          </div>

          <div>
            <p className="text-sm font-bold">
              Secure<span className="text-[#a855f7]">Bank</span>
            </p>

            <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-white/20">
              Privacy Intelligence
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 transition hover:text-[#a855f7]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Command Center
        </Link>
      </header>

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div className="relative z-10 mx-auto max-w-[1450px] px-5 py-10 lg:px-10">

        <div className="mb-10 max-w-2xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#a855f7]/20 bg-[#a855f7]/[0.04] px-4 py-2">
            <Sparkles className="h-3 w-3 text-[#a855f7]" />

            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-[#c084fc]">
              Encrypted transaction intelligence
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Analyze
            <br />

            <span className="bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#22d3ee] bg-clip-text text-transparent">
              without exposure.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/30">
            Submit transaction metadata and let the privacy-preserving
            AI pipeline calculate a fraud risk score.
          </p>
        </div>

        {/* =================================================== */}
        {/* MAIN GRID */}
        {/* =================================================== */}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">

          {/* ================================================= */}
          {/* INPUT PANEL */}
          {/* ================================================= */}

          <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#08060d]/90 p-6 backdrop-blur-xl sm:p-8">

            <div className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-[#a855f7]/[0.06] blur-[100px]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
                    Transaction input
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Transaction Details
                  </h2>
                </div>

                <Wallet className="h-5 w-5 text-[#a855f7]" />
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* AMOUNT */}

                <Field label="Transaction Amount">
                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-white/25">
                      ₹
                    </span>

                    <input
                      required
                      min="1"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="50000"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/30 py-4 pl-9 pr-4 font-mono text-sm text-white outline-none transition placeholder:text-white/10 focus:border-[#a855f7]/40 focus:ring-1 focus:ring-[#a855f7]/10"
                    />
                  </div>
                </Field>

                {/* TYPE + MERCHANT */}

                <div className="grid gap-4 sm:grid-cols-2">

                  <Field label="Transaction Type">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#08060d] px-4 py-4 text-sm text-white outline-none focus:border-[#a855f7]/40"
                    >
                      <option>Online</option>
                      <option>POS</option>
                      <option>ATM</option>
                      <option>Transfer</option>
                      <option>Other</option>
                    </select>
                  </Field>

                  <Field label="Merchant Category">
                    <select
                      value={merchantCategory}
                      onChange={(e) =>
                        setMerchantCategory(e.target.value)
                      }
                      className="w-full rounded-xl border border-white/[0.08] bg-[#08060d] px-4 py-4 text-sm text-white outline-none focus:border-[#a855f7]/40"
                    >
                      <option>Electronics</option>
                      <option>Jewelry</option>
                      <option>Travel</option>
                      <option>Entertainment</option>
                      <option>Fashion</option>
                      <option>Fuel</option>
                      <option>Grocery</option>
                      <option>Restaurant</option>
                      <option>Healthcare</option>
                      <option>Utilities</option>
                      <option>Education</option>
                      <option>Other</option>
                    </select>
                  </Field>

                </div>

                {/* LOCATION + TIME */}

                <div className="grid gap-4 sm:grid-cols-2">

                  <Field label="Transaction Location">

                    <div className="relative">

                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />

                      <select
                        value={location}
                        onChange={(e) =>
                          setLocation(e.target.value)
                        }
                        className="w-full rounded-xl border border-white/[0.08] bg-[#08060d] py-4 pl-11 pr-4 text-sm text-white outline-none focus:border-[#a855f7]/40"
                      >
                        <option>Chennai</option>
                        <option>Mumbai</option>
                        <option>Delhi</option>
                        <option>Bangalore</option>
                        <option>Hyderabad</option>
                        <option>Kolkata</option>
                        <option>Pune</option>
                        <option>Ahmedabad</option>
                        <option>Jaipur</option>
                        <option>Other</option>
                      </select>

                    </div>

                  </Field>

                  <Field label="Transaction Time">

                    <input
                      required
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#08060d] px-4 py-4 font-mono text-sm text-white outline-none focus:border-[#a855f7]/40"
                    />

                  </Field>

                </div>

                {/* SECURITY NOTE */}

                <div className="rounded-xl border border-[#22d3ee]/10 bg-[#22d3ee]/[0.025] p-4">

                  <div className="flex gap-3">

                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#22d3ee]" />

                    <div>
                      <p className="text-[10px] font-semibold text-[#22d3ee]">
                        Privacy-preserving analysis
                      </p>

                      <p className="mt-1 text-[9px] leading-5 text-white/20">
                        Features are encrypted before the inference
                        stage of the pipeline.
                      </p>
                    </div>

                  </div>

                </div>

                {error && (
                  <div className="rounded-xl border border-[#ff5f7a]/20 bg-[#ff5f7a]/[0.04] px-4 py-3 text-xs text-[#ff7b91]">
                    {error}
                  </div>
                )}

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:shadow-[0_0_45px_rgba(168,85,247,.2)] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      Running encrypted inference...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Analyze securely
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </>
                  )}

                </button>

              </form>
            </div>
          </section>

          {/* ================================================= */}
          {/* AI PIPELINE */}
          {/* ================================================= */}

          <section className="space-y-6">

            <div className="rounded-[28px] border border-white/[0.07] bg-[#08060d]/90 p-6 backdrop-blur-xl sm:p-8">

              <div className="flex items-center justify-between">

                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#22d3ee]">
                    Secure computation
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    AI Inference Pipeline
                  </h2>
                </div>

                <BrainCircuit className="h-6 w-6 text-[#a855f7]" />

              </div>

              <div className="mt-8 space-y-3">

                <PipelineStep
                  number="01"
                  title="Feature Extraction"
                  description="Raw transaction → 30-dimensional vector"
                  icon={<Activity />}
                  active={loading}
                />

                <PipelineConnector />

                <PipelineStep
                  number="02"
                  title="CKKS Encryption"
                  description="Feature vector becomes encrypted"
                  icon={<LockKeyhole />}
                  active={loading}
                />

                <PipelineConnector />

                <PipelineStep
                  number="03"
                  title="Polynomial Neural Network"
                  description="Dense → Poly² → Dense → Poly² → Dense"
                  icon={<BrainCircuit />}
                  active={loading}
                />

                <PipelineConnector />

                <PipelineStep
                  number="04"
                  title="Fraud Prediction"
                  description="Encrypted output → risk score"
                  icon={<ShieldCheck />}
                  active={!!result}
                />

              </div>

              <div className="mt-7 grid grid-cols-3 gap-2">

                <TechBadge
                  icon={<Fingerprint />}
                  label="30D FEATURES"
                />

                <TechBadge
                  icon={<LockKeyhole />}
                  label="CKKS"
                />

                <TechBadge
                  icon={<BrainCircuit />}
                  label="POLY²"
                />

              </div>

            </div>

            {/* ================================================= */}
            {/* RESULT */}
            {/* ================================================= */}

            {result ? (
              <Result result={result} />
            ) : (
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/[0.08] bg-[#05040a]">

                <div className="absolute h-48 w-48 rounded-full bg-[#a855f7]/[0.05] blur-[80px]" />

                <div className="relative text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#a855f7]/15 bg-[#a855f7]/[0.035]">
                    <ShieldAlert className="h-7 w-7 text-[#a855f7]/40" />
                  </div>

                  <p className="mt-5 text-sm text-white/30">
                    Awaiting analysis
                  </p>

                  <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.3em] text-white/10">
                    Prediction output will appear here
                  </p>

                </div>

              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}

/* ========================================================= */
/* FIELD */
/* ========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </span>

      {children}
    </label>
  );
}

/* ========================================================= */
/* PIPELINE STEP */
/* ========================================================= */

function PipelineStep({
  number,
  title,
  description,
  icon,
  active,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition ${
        active
          ? "border-[#a855f7]/25 bg-[#a855f7]/[0.045] shadow-[0_0_30px_rgba(168,85,247,.04)]"
          : "border-white/[0.06] bg-black/20"
      }`}
    >
      <span className="font-mono text-[8px] text-white/15">
        {number}
      </span>

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-[#a855f7]/10 text-[#c084fc]"
            : "bg-white/[0.03] text-white/20"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-xs font-semibold text-white/70">
          {title}
        </p>

        <p className="mt-1 text-[9px] leading-4 text-white/20">
          {description}
        </p>

      </div>

      {active && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22d3ee]" />
      )}
    </div>
  );
}

function PipelineConnector() {
  return (
    <div className="ml-8 h-3 border-l border-dashed border-[#a855f7]/15" />
  );
}

/* ========================================================= */
/* TECH BADGE */
/* ========================================================= */

function TechBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.05] bg-black/20 py-3 text-white/25">
      {icon}

      <span className="font-mono text-[7px] tracking-wider">
        {label}
      </span>
    </div>
  );
}

/* ========================================================= */
/* RESULT */
/* ========================================================= */

function Result({
  result,
}: {
  result: FraudAnalysisResult;
}) {
  const accent =
    result.riskLevel === "HIGH"
      ? "#ff5f7a"
      : result.riskLevel === "MEDIUM"
        ? "#ffc857"
        : "#00ffe1";

  return (
    <div
      className="relative overflow-hidden rounded-[28px] border p-6 sm:p-8"
      style={{
        borderColor: `${accent}30`,
        background: `${accent}06`,
      }}
    >

      <div
        className="absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full blur-[100px]"
        style={{ background: `${accent}15` }}
      />

      <div className="relative">

        <div className="flex items-center justify-between">

          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
              Analysis complete
            </p>

            <p className="mt-2 font-mono text-xs text-white/45">
              {result.transactionId}
            </p>
          </div>

          <CheckCircle2
            className="h-6 w-6"
            style={{ color: accent }}
          />

        </div>

        <div className="mt-8 flex flex-col items-center gap-7 sm:flex-row">

          <div
            className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-[5px]"
            style={{
              borderColor: accent,
              boxShadow: `0 0 60px ${accent}18`,
            }}
          >
            <div className="text-center">

              <p className="font-mono text-4xl font-bold">
                {(result.fraudScore * 100).toFixed(0)}%
              </p>

              <p
                className="mt-1 font-mono text-[7px] uppercase tracking-[0.25em]"
                style={{ color: accent }}
              >
                fraud score
              </p>

            </div>
          </div>

          <div>

            <p
              className="font-mono text-2xl font-bold"
              style={{ color: accent }}
            >
              {result.riskLevel}
            </p>

            <p className="mt-3 font-mono text-[7px] uppercase tracking-[0.25em] text-white/20">
              Decision
            </p>

            <p className="mt-1 text-sm font-semibold text-white/65">
              {result.decision}
            </p>

          </div>

        </div>

        <div className="mt-8">

          <p className="mb-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
            Model indicators
          </p>

          <div className="space-y-2">

            {result.riskIndicators.map((indicator, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3"
              >
                <ShieldAlert
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: accent }}
                />

                <span className="text-[10px] text-white/40">
                  {indicator}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}