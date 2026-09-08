"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Clock3,
  LockKeyhole,
  Network,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { api } from "@/lib/api";
import { DashboardMetrics, FraudAlert } from "@/lib/types";
import NetworkGlobe from "../../components/shared/NetworkGlobe";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [metricsData, alertsData] = await Promise.all([
          api.getDashboardMetrics(),
          api.getFraudAlerts(),
        ]);

        setMetrics(metricsData);
        setAlerts(alertsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const risk = useMemo(() => {
    return {
      high: alerts.filter((a) => a.riskLevel === "HIGH").length,
      medium: alerts.filter((a) => a.riskLevel === "MEDIUM").length,
      low: alerts.filter((a) => a.riskLevel === "LOW").length,
    };
  }, [alerts]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020305]">
        

        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border border-white/10 border-t-[#A855F7]" />
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
            Initializing SecureBank
          </p>
        </div>
      </div>
    );
  }

  const totalRisk = risk.high + risk.medium + risk.low;

return (
  <main className="relative min-h-screen overflow-hidden bg-[#020305] text-white">

    {/* ===================================================== */}
    {/* FIXED BACKGROUND */}
    {/* ===================================================== */}

    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      {/* HUGE PRIMARY ORB — UPPER RIGHT */}
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
      <div className="absolute right-[10%] top-[15%] h-[600px] w-[600px] rounded-full bg-[#7c3aed]/[0.08] blur-[160px]" />

      {/* LOWER ORB ATMOSPHERE */}
      <div className="absolute bottom-[-5%] left-[5%] h-[400px] w-[400px] rounded-full bg-[#d946ef]/[0.07] blur-[140px]" />

      {/* TECHNICAL GRID */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,#020305_90%)]" />

    </div>

    {/* TOP BAR */}
      <header className="relative z-30 flex items-center justify-between border-b border-white/[0.06] px-6 py-5 lg:px-10">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-[#A855F7]">
            SecureBank / Intelligence
          </p>

          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Security Command Center
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[#A855F7]/15 bg-[#A855F7]/[0.035] px-4 py-2 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A855F7]" />
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#A855F7]">
              Systems Online
            </span>
          </div>

          <Link
            href="/transactions/analyze"
            className="flex items-center gap-2 rounded-full bg-[#A855F7] px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-black transition hover:shadow-[0_0_30px_rgba(0,255,225,.18)]"
          >
            <Zap className="h-3 w-3" />
            
            Analyze
          </Link>
        </div>
      </header>

<div className="relative z-10 mx-auto max-w-[1700px] px-5 py-6 lg:px-10">
        {/* HERO MAP */}
        <section className="relative h-[570px] overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#05080c]/45 backdrop-blur-[2px]">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,225,.055),transparent_50%)]" />

          <div className="absolute left-6 top-6 z-20">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
              Global monitoring
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Worldwide Threat Network
            </h2>

            <p className="mt-1 max-w-sm text-xs text-white/25">
              Real-time visualization of protected transaction intelligence.
            </p>
          </div>

          <div className="absolute right-6 top-6 z-20 flex items-center gap-2 rounded-full border border-[#A855F7]/10 bg-black/30 px-3 py-2 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A855F7]" />
            <span className="font-mono text-[8px] text-[#A855F7]">
              NETWORK LIVE
            </span>
          </div>

          <NetworkGlobe />

          {/* stats over map */}
          <div className="absolute bottom-5 left-5 right-5 z-20 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MapMetric
              label="Transactions"
              value={(metrics?.totalTransactions ?? 0).toLocaleString()}
            />

            <MapMetric
              label="Encrypted Runs"
              value={(metrics?.transactionsAnalyzed ?? 0).toLocaleString()}
            />

            <MapMetric
              label="Threats"
              value={(metrics?.fraudDetected ?? 0).toLocaleString()}
            />

            <MapMetric
              label="High Risk"
              value={(metrics?.highRiskTransactions ?? 0).toLocaleString()}
              danger
            />
          </div>
        </section>

        {/* METRICS */}
        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            title="Transactions"
            value={metrics?.totalTransactions ?? 0}
            icon={<Activity />}
          />

          <Metric
            title="HE Analysis"
            value={metrics?.transactionsAnalyzed ?? 0}
            icon={<LockKeyhole />}
          />

          <Metric
            title="Fraud Detected"
            value={metrics?.fraudDetected ?? 0}
            icon={<ShieldAlert />}
            violet
          />

          <Metric
            title="Critical Risk"
            value={metrics?.highRiskTransactions ?? 0}
            icon={<AlertTriangle />}
            amber
          />
        </section>

        {/* LOWER GRID */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">

          {/* AI PIPELINE */}
<div className="rounded-2xl border border-white/[0.07] bg-[#070a0f]/40 p-6 backdrop-blur-[2px]">            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#A855F7]">
                  Intelligence Engine
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  Privacy-Preserving AI
                </h2>
              </div>

              <BrainCircuit className="h-5 w-5 text-[#9b5cff]" />
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-4">
              <Pipeline
                number="01"
                title="FEATURES"
                icon={<Activity />}
              />

              <PipelineLine />

              <Pipeline
                number="02"
                title="CKKS"
                icon={<LockKeyhole />}
              />

              <PipelineLine />

              <Pipeline
                number="03"
                title="POLY²"
                icon={<BrainCircuit />}
              />

              <PipelineLine />

              <Pipeline
                number="04"
                title="DECISION"
                icon={<ShieldCheck />}
                active
              />
            </div>

            <div className="mt-7 rounded-xl border border-[#A855F7]/10 bg-[#A855F7]/[0.025] p-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#A855F7]" />

                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#A855F7]">
                  Encrypted inference operational
                </span>
              </div>
            </div>
          </div>

          {/* RISK */}
<div className="rounded-2xl border border-white/[0.07] bg-[#070a0f]/40 p-6 backdrop-blur-[2px]">            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#9b5cff]">
                  Threat analysis
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  Risk Distribution
                </h2>
              </div>

              <Network className="h-5 w-5 text-[#A855F7]" />
            </div>

            <div className="mt-7 flex items-center gap-8">
              <div
                className="relative h-36 w-36 shrink-0 rounded-full"
                style={{
                  background:
                    totalRisk === 0
                      ? "rgba(255,255,255,.04)"
                      : `conic-gradient(
                          #ff5f7a 0 ${(risk.high / totalRisk) * 100}%,
                          #ffc857 ${(risk.high / totalRisk) * 100}% ${((risk.high + risk.medium) / totalRisk) * 100}%,
                          #A855F7 ${((risk.high + risk.medium) / totalRisk) * 100}% 100%
                        )`,
                }}
              >
                <div className="absolute inset-[7px] flex items-center justify-center rounded-full bg-[#070a0f]">
                  <div className="text-center">
                    <p className="font-mono text-2xl font-bold">
                      {totalRisk}
                    </p>
                    <p className="font-mono text-[7px] uppercase tracking-widest text-white/20">
                      alerts
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Risk label="HIGH" value={risk.high} color="text-[#ff5f7a]" />
                <Risk label="MEDIUM" value={risk.medium} color="text-[#ffc857]" />
                <Risk label="LOW" value={risk.low} color="text-[#A855F7]" />
              </div>
            </div>
          </div>
        </section>

        {/* ALERT STREAM */}
<section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#070a0f]/40 backdrop-blur-[2px]">          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#A855F7]">
                Live telemetry
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Recent Threat Activity
              </h2>
            </div>

            <Link
              href="/alerts"
              className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#A855F7]"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {alerts.length === 0 ? (
            <div className="p-12 text-center">
              <ShieldCheck className="mx-auto h-8 w-8 text-[#A855F7]/40" />
              <p className="mt-3 text-xs text-white/25">
                No threats detected.
              </p>
            </div>
          ) : (
            alerts.slice(0, 6).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-4 border-b border-white/[0.04] px-6 py-4 transition hover:bg-white/[0.015]"
              >
                <div
                  className={`h-8 w-1 rounded-full ${
                    alert.riskLevel === "HIGH"
                      ? "bg-[#ff5f7a]"
                      : alert.riskLevel === "MEDIUM"
                        ? "bg-[#ffc857]"
                        : "bg-[#A855F7]"
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-white/70">
                    {alert.transactionId}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-[9px] text-white/20">
                    <Clock3 className="h-3 w-3" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="font-mono text-xs text-white/50">
                    ₹{alert.amount.toLocaleString()}
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-widest text-white/20">
                    {alert.status}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-white">
                    {(alert.fraudScore * 100).toFixed(0)}%
                  </p>

                  <p
                    className={`mt-1 text-[8px] font-bold tracking-widest ${
                      alert.riskLevel === "HIGH"
                        ? "text-[#ff5f7a]"
                        : alert.riskLevel === "MEDIUM"
                          ? "text-[#ffc857]"
                          : "text-[#A855F7]"
                    }`}
                  >
                    {alert.riskLevel}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
  icon,
  violet = false,
  amber = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  violet?: boolean;
  amber?: boolean;
}) {
  const color = amber
    ? "text-[#ffc857]"
    : violet
      ? "text-[#9b5cff]"
      : "text-[#A855F7]";

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[#070a0f]/40 p-5 backdrop-blur-[2px] transition hover:-translate-y-0.5 hover:border-white/[0.12]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.2em] text-white/20">
          {title}
        </span>

        <div className={color}>{icon}</div>
      </div>

      <p className="mt-5 font-mono text-3xl font-bold tracking-tight">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function MapMetric({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/50 px-4 py-3 backdrop-blur-xl">
      <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/20">
        {label}
      </p>

      <p
        className={`mt-1 font-mono text-sm font-bold ${
          danger ? "text-[#ff5f7a]" : "text-white/70"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Pipeline({
  number,
  title,
  icon,
  active = false,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? "border-[#A855F7]/20 bg-[#A855F7]/[0.035]"
          : "border-white/[0.06] bg-black/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] text-white/15">
          {number}
        </span>

        <span className={active ? "text-[#A855F7]" : "text-white/30"}>
          {icon}
        </span>
      </div>

      <p className="mt-6 font-mono text-[9px] font-bold tracking-[0.2em] text-white/60">
        {title}
      </p>
    </div>
  );
}

function PipelineLine() {
  return (
    <div className="hidden items-center md:flex">
      <div className="h-px w-full bg-gradient-to-r from-[#A855F7]/5 via-[#A855F7]/30 to-[#9b5cff]/10" />
    </div>
  );
}

function Risk({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className={`font-mono text-xs font-bold ${color}`}>
        {value}
      </span>

      <span className="font-mono text-[8px] tracking-[0.2em] text-white/20">
        {label}
      </span>
    </div>
  );
}