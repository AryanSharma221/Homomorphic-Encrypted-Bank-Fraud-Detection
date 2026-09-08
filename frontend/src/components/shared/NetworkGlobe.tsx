"use client";

import { useEffect, useState } from "react";

const nodes = [
  { x: 24, y: 38, label: "NY" },
  { x: 31, y: 55, label: "LATAM" },
  { x: 47, y: 34, label: "LON" },
  { x: 55, y: 43, label: "DXB" },
  { x: 64, y: 49, label: "IND" },
  { x: 72, y: 40, label: "SIN" },
  { x: 82, y: 53, label: "TOK" },
  { x: 76, y: 67, label: "SYD" },
  { x: 42, y: 66, label: "SA" },
];

const connections = [
  [24, 38, 47, 34],
  [31, 55, 47, 34],
  [47, 34, 55, 43],
  [55, 43, 64, 49],
  [64, 49, 72, 40],
  [72, 40, 82, 53],
  [64, 49, 76, 67],
  [42, 66, 64, 49],
  [24, 38, 64, 49],
  [47, 34, 72, 40],
];

export default function NetworkGlobe() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((value) => (value + 1) % nodes.length);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full">

      {/* =====================================================
          OUTER GLOW
      ====================================================== */}

      <div className="absolute inset-[8%] rounded-full bg-[#7c3aed]/[0.08] blur-[80px]" />

      <div className="absolute inset-[12%] rounded-full border border-[#a855f7]/20 shadow-[0_0_80px_rgba(168,85,247,.12)]" />

      {/* =====================================================
          GLOBE
      ====================================================== */}

      <svg
        viewBox="0 0 600 600"
        className="relative z-10 h-full w-full overflow-visible"
      >

        <defs>

          {/* globe glow */}
          <filter id="glowPurple">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowCyan">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="globeFill">
            <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.16" />
            <stop offset="45%" stopColor="#3b0764" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#020106" stopOpacity="0.02" />
          </radialGradient>

          <linearGradient id="arcGradient">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="45%" stopColor="#22d3ee" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>

          <clipPath id="globeClip">
            <circle cx="300" cy="300" r="225" />
          </clipPath>

        </defs>

        {/* ===================================================
            GLOBE BODY
        ==================================================== */}

        <circle
          cx="300"
          cy="300"
          r="225"
          fill="url(#globeFill)"
          stroke="#a855f7"
          strokeOpacity="0.75"
          strokeWidth="1.5"
        />

        {/* ===================================================
            LATITUDE LINES
        ==================================================== */}

        <g
          clipPath="url(#globeClip)"
          fill="none"
          stroke="#8b5cf6"
          strokeOpacity="0.39"
          strokeWidth="1"
        >

          <ellipse cx="300" cy="300" rx="225" ry="65" />

          <ellipse cx="300" cy="300" rx="225" ry="125" />

          <ellipse cx="300" cy="300" rx="225" ry="175" />

          <ellipse cx="300" cy="300" rx="225" ry="205" />

          <ellipse
            cx="300"
            cy="300"
            rx="225"
            ry="95"
            transform="rotate(45 300 300)"
          />

          <ellipse
            cx="300"
            cy="300"
            rx="225"
            ry="95"
            transform="rotate(-45 300 300)"
          />

        </g>

        {/* ===================================================
            LONGITUDE LINES
        ==================================================== */}

        <g
          clipPath="url(#globeClip)"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.34"
          strokeWidth="1"
        >

          <ellipse cx="300" cy="300" rx="65" ry="225" />

          <ellipse cx="300" cy="300" rx="125" ry="225" />

          <ellipse cx="300" cy="300" rx="175" ry="225" />

          <ellipse
            cx="300"
            cy="300"
            rx="95"
            ry="225"
            transform="rotate(25 300 300)"
          />

          <ellipse
            cx="300"
            cy="300"
            rx="95"
            ry="225"
            transform="rotate(-25 300 300)"
          />

        </g>

        {/* ===================================================
            WORLD MAP — STYLIZED CONTINENTS
        ==================================================== */}

        <g
          clipPath="url(#globeClip)"
          fill="#a855f7"
          fillOpacity="0.38"
          stroke="#c084fc"
          strokeOpacity="0.85"
          strokeWidth="1"
        >

          {/* North America */}

          <path d="
            M105 205
            L125 175
            L150 165
            L170 145
            L205 150
            L225 170
            L215 195
            L230 215
            L212 230
            L195 220
            L180 235
            L155 225
            L135 240
            L115 225
            Z
          " />

          {/* South America */}

          <path d="
            M215 285
            L235 300
            L250 325
            L245 355
            L230 385
            L220 420
            L205 445
            L195 420
            L202 390
            L190 365
            L195 335
            L205 310
            Z
          " />

          {/* Europe */}

          <path d="
            M285 170
            L305 155
            L330 160
            L345 175
            L330 188
            L310 184
            L295 195
            L280 185
            Z
          " />

          {/* Asia */}

          <path d="
            M335 175
            L365 155
            L405 160
            L435 175
            L470 185
            L495 205
            L480 225
            L450 220
            L430 235
            L400 225
            L375 235
            L350 215
            L330 205
            Z
          " />

          {/* India */}

          <path d="
            M405 245
            L425 255
            L435 280
            L420 300
            L405 285
            L395 265
            Z
          " />

          {/* Africa */}

          <path d="
            M300 255
            L330 250
            L350 270
            L345 305
            L330 335
            L315 370
            L295 355
            L285 325
            L275 295
            L280 270
            Z
          " />

          {/* Australia */}

          <path d="
            M440 370
            L470 355
            L505 365
            L520 390
            L505 415
            L470 420
            L445 405
            L430 385
            Z
          " />

        </g>

        {/* ===================================================
            NETWORK CONNECTIONS
        ==================================================== */}

        <g clipPath="url(#globeClip)">

          {connections.map((connection, index) => {
            const [x1, y1, x2, y2] = connection;

            const sx = 75 + (x1 / 100) * 450;
            const sy = 75 + (y1 / 100) * 450;

            const ex = 75 + (x2 / 100) * 450;
            const ey = 75 + (y2 / 100) * 450;

            const controlX = (sx + ex) / 2;
            const controlY = Math.min(sy, ey) - 65;

            return (
              <path
                key={index}
                d={`M ${sx} ${sy} Q ${controlX} ${controlY} ${ex} ${ey}`}
                fill="none"
                stroke="url(#arcGradient)"
                strokeWidth="1.5"
                strokeOpacity="0.90"
                strokeDasharray="7 8"
                className="network-line"
              />
            );
          })}

        </g>

        {/* ===================================================
            NODES
        ==================================================== */}

        {nodes.map((node, index) => {

          const x = 75 + (node.x / 100) * 450;
          const y = 75 + (node.y / 100) * 450;

          const active = index === pulse;

          return (
            <g key={node.label}>

              {active && (
                <circle
                  cx={x}
                  cy={y}
                  r="15"
                  fill="none"
                  stroke="#22d3ee"
                  strokeOpacity="0.6"
                  className="node-pulse"
                />
              )}

              <circle
                cx={x}
                cy={y}
                r="5"
                fill={index % 3 === 0 ? "#ec4899" : "#22d3ee"}
                filter="url(#glowCyan)"
              />

              <circle
                cx={x}
                cy={y}
                r="2"
                fill="white"
              />

              <text
                x={x + 9}
                y={y - 8}
                fill="#c084fc"
                fillOpacity="0.65"
                fontSize="8"
                fontFamily="monospace"
                letterSpacing="2"
              >
                {node.label}
              </text>

            </g>
          );
        })}

        {/* ===================================================
            CENTER CORE
        ==================================================== */}

        <circle
          cx="300"
          cy="300"
          r="52"
          fill="#05020b"
          fillOpacity="0.8"
          stroke="#a855f7"
          strokeOpacity="0.65"
          strokeWidth="1.5"
          filter="url(#glowPurple)"
        />

        <circle
          cx="300"
          cy="300"
          r="40"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.55"
          strokeDasharray="4 7"
        />

        <circle
          cx="300"
          cy="300"
          r="28"
          fill="#08030f"
          stroke="#c084fc"
          strokeOpacity="0.65"
        />

        {/* shield */}

        <path
          d="M300 283 L315 289 V300 C315 311 308 319 300 323 C292 319 285 311 285 300 V289 Z"
          fill="none"
          stroke="#c084fc"
          strokeWidth="2"
        />

        <path
          d="M294 301 L298 305 L307 295"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
        />

      </svg>

      {/* =====================================================
          LABELS
      ====================================================== */}

      <div className="absolute bottom-[8%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-center">

        <p className="font-mono text-[7px] font-bold uppercase tracking-[0.35em] text-[#c084fc]">
          GLOBAL THREAT NETWORK
        </p>

        <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.3em] text-white/20">
          PROTECTED TRANSACTION INTELLIGENCE
        </p>

      </div>

      {/* =====================================================
          LIVE INDICATOR
      ====================================================== */}

      <div className="absolute right-[12%] top-[10%] z-30 flex items-center gap-2 rounded-full border border-[#22d3ee]/20 bg-[#020106]/70 px-3 py-2 backdrop-blur-xl">

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22d3ee]" />

        <span className="font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-[#22d3ee]">
          NETWORK LIVE
        </span>

      </div>

      {/* =====================================================
          CSS ANIMATION
      ====================================================== */}

      <style jsx>{`
        .network-line {
          animation: flow 3s linear infinite;
        }

        .node-pulse {
          animation: pulse 1.8s ease-out infinite;
        }

        @keyframes flow {
          from {
            stroke-dashoffset: 30;
          }

          to {
            stroke-dashoffset: -30;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.8;
            transform: scale(0.8);
            transform-origin: center;
          }

          100% {
            opacity: 0;
            transform: scale(1.8);
            transform-origin: center;
          }
        }
      `}</style>

    </div>
  );
}