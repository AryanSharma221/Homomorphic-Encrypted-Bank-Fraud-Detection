"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FraudAlert } from "@/lib/types";
import {
  Filter,
  Download,
  Search,
  ShieldAlert,
  LockKeyhole,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export default function Alerts() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const alertsData = await api.getFraudAlerts();
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to load alerts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredAlerts = alerts.filter((alert) =>
    alert.transactionId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-full overflow-hidden bg-[#05030b] text-white">

      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Main Orb */}
        <div className="absolute right-[-120px] top-[-80px] h-[820px] w-[820px]">
          <img
            src="/ai-orb.png"
            alt=""
            className="h-full w-full object-contain opacity-[0.48] mix-blend-screen"
          />
        </div>

        {/* Lower Orb */}
        <div className="absolute bottom-[-280px] left-[-220px] h-[680px] w-[680px]">
          <img
            src="/ai-orb.png"
            alt=""
            className="h-full w-full object-contain opacity-[0.65] mix-blend-screen"
          />
        </div>

        {/* Purple Atmosphere */}
        <div className="absolute right-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#7c3aed]/[0.10] blur-[170px]" />

        {/* Magenta Atmosphere */}
        <div className="absolute bottom-[5%] left-[5%] h-[420px] w-[420px] rounded-full bg-[#d946ef]/[0.07] blur-[150px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.11]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,85,247,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,.055) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,transparent_0%,rgba(5,3,11,0.45)_48%,rgba(5,3,11,0.94)_100%)]" />

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#05030b] to-transparent" />

      </div>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

      <div className="relative z-10 mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            {/* System Label */}
            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-7 items-center gap-2 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/[0.07] px-3">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38f2c0]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#a78bfa]">
                  Threat Intelligence
                </span>
              </div>

              <span className="text-[9px] uppercase tracking-[0.2em] text-slate-700">
                / Monitoring
              </span>

            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-white">
              Fraud Alerts
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Review transactions identified by the privacy-preserving
              detection engine.
            </p>

          </div>

          {/* Header Controls */}
          <div className="flex gap-3">

            <button
              type="button"
              className="group flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-2.5 text-xs font-medium text-slate-400 backdrop-blur-xl transition hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/[0.08] hover:text-white"
            >
              <Filter className="h-4 w-4 transition group-hover:text-[#a78bfa]" />
              Filter
            </button>

            <button
              type="button"
              className="group flex items-center gap-2 rounded-xl border border-[#ffc857]/20 bg-[#ffc857]/[0.035] px-4 py-2.5 text-xs font-medium text-[#ffc857] backdrop-blur-xl transition hover:bg-[#ffc857]/[0.08]"
            >
              <Download className="h-4 w-4" />
              Export
            </button>

          </div>

        </div>

        {/* ========================================================= */}
        {/* SYSTEM STATUS */}
        {/* ========================================================= */}

        <div className="relative overflow-hidden rounded-2xl border border-[#8b5cf6]/15 bg-[#0b0714]/80 backdrop-blur-xl">

          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#8b5cf6] via-[#d946ef] to-[#ffc857]" />

          <div className="flex items-center gap-4 px-5 py-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38f2c0]/20 bg-[#38f2c0]/[0.06]">
              <Activity className="h-4 w-4 text-[#38f2c0]" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-300">
                Encrypted prediction stream
              </p>

              <p className="mt-0.5 text-[10px] text-slate-600">
                Homomorphic inference pipeline operational
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38f2c0] shadow-[0_0_10px_#38f2c0]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#38f2c0]">
                Live
              </span>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* TABLE */}
        {/* ========================================================= */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090711]/80 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">

          {/* Table Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center">

            <div className="relative w-full max-w-sm">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

              <input
                type="text"
                className="block w-full rounded-xl border border-white/[0.08] bg-black/30 py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-[#8b5cf6]/40 focus:ring-1 focus:ring-[#8b5cf6]/20"
                placeholder="Search transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-600">

              <span>
                Showing{" "}
                <span className="font-mono text-[#a78bfa]">
                  {filteredAlerts.length}
                </span>{" "}
                alerts
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-700" />

              <span className="text-[#38f2c0]">
                Secure channel
              </span>

            </div>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="flex h-56 flex-col items-center justify-center gap-4">

              <div className="relative">

                <div className="h-10 w-10 animate-spin rounded-full border border-[#8b5cf6]/20 border-t-[#a855f7]" />

                <div className="absolute inset-2 rounded-full border border-[#d946ef]/20 border-b-[#d946ef]" />

              </div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-slate-600">
                Decrypting threat data
              </p>

            </div>

          ) : filteredAlerts.length === 0 ? (

            <div className="flex h-56 flex-col items-center justify-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8b5cf6]/15 bg-[#8b5cf6]/[0.04]">
                <LockKeyhole className="h-5 w-5 text-[#8b5cf6]/50" />
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  No matching fraud alerts
                </p>

                <p className="mt-1 text-[10px] text-slate-700">
                  The encrypted threat stream returned no matches.
                </p>
              </div>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b border-white/[0.05] bg-white/[0.015] text-[9px] uppercase tracking-[0.2em] text-slate-600">

                    <th className="px-6 py-4 font-medium">
                      Transaction
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Date & Time
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Amount
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Risk Score
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Risk Level
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Decision
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-white/[0.035]">

                  {filteredAlerts.map((alert) => (

                    <tr
                      key={alert.id}
                      className="group transition hover:bg-[#8b5cf6]/[0.025]"
                    >

                      {/* Transaction */}
                      <td className="whitespace-nowrap px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="h-7 w-7 rounded-lg border border-[#8b5cf6]/15 bg-[#8b5cf6]/[0.05] flex items-center justify-center">
                            <ShieldAlert className="h-3.5 w-3.5 text-[#a78bfa]" />
                          </div>

                          <span className="font-mono text-xs text-slate-300">
                            {alert.transactionId}
                          </span>

                        </div>

                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-5 text-[11px] text-slate-600">
                        {new Date(alert.timestamp).toLocaleString()}
                      </td>

                      {/* Amount */}
                      <td className="whitespace-nowrap px-6 py-5 font-mono text-xs text-slate-400">
                        ₹{alert.amount.toLocaleString()}
                      </td>

                      {/* Score */}
                      <td className="whitespace-nowrap px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.05]">

                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#38f2c0] via-[#ffc857] to-[#ff6b81]"
                              style={{
                                width: `${Math.min(
                                  alert.fraudScore * 100,
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                          <span className="font-mono text-[10px] text-slate-500">
                            {(alert.fraudScore * 100).toFixed(0)}%
                          </span>

                        </div>

                      </td>

                      {/* Risk */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <RiskBadge level={alert.riskLevel} />
                      </td>

                      {/* Decision */}
                      <td className="whitespace-nowrap px-6 py-5">

                        <DecisionLabel status={alert.status} />

                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-6 py-5 text-right">

                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#a78bfa] transition hover:text-[#d946ef]"
                        >
                          Review
                          <ArrowUpRight className="h-3 w-3" />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

/* ============================================================= */
/* RISK BADGE */
/* ============================================================= */

function RiskBadge({
  level,
}: {
  level: "LOW" | "MEDIUM" | "HIGH";
}) {
  const styles = {
    LOW: "border-[#38f2c0]/20 bg-[#38f2c0]/[0.06] text-[#38f2c0]",
    MEDIUM: "border-[#ffc857]/25 bg-[#ffc857]/[0.07] text-[#ffc857]",
    HIGH: "border-[#ff6b81]/25 bg-[#ff6b81]/[0.07] text-[#ff6b81]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] ${styles[level]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
      {level}
    </span>
  );
}

/* ============================================================= */
/* DECISION */
/* ============================================================= */

function DecisionLabel({
  status,
}: {
  status: string;
}) {
  const color =
    status === "FLAGGED"
      ? "text-[#ff6b81]"
      : status === "REVIEW"
      ? "text-[#ffc857]"
      : "text-[#38f2c0]";

  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-[0.16em] ${color}`}
    >
      {status}
    </span>
  );
}