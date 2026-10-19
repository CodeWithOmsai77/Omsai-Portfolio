import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const GITHUB = "https://github.com/CodeWithOmsai77";
const LINKEDIN = "https://www.linkedin.com/in/omsai-dasari-b18b55381";
const EMAIL = "omsaidasari29@gmail.com";

const NAV = [
  ["Home", "home"],
  ["About", "about"],
  ["Projects", "projects"],
  ["Lab", "lab"],
  ["Skills", "skills"],
  ["Contact", "contact"],
];

// Shown in the bottom-left readout as you scroll, following the chip design flow.
const STAGES = ["Specification", "Architecture", "RTL", "Verification", "Synthesis", "Tape-out"];

const PROJECTS = [
  {
    t: "RTL-to-GDSII-Projects",
    art: "layers",
    problem: "See how a Verilog design becomes a physical chip layout, one stage at a time.",
    tools: "Verilog, RTL-to-layout flow",
    learned: "What each stage of the flow adds, and what it checks.",
    url: `${GITHUB}/RTL-to-GDSII-Projects`,
  },
  {
    t: "Verilog-Fundamentals",
    art: "wave",
    problem: "Build the digital logic blocks every chip is made of: gates, FSMs and RTL modules.",
    tools: "Verilog, Icarus Verilog, GTKWave",
    learned: "Writing testbenches and reading waveforms to find bugs.",
    url: `${GITHUB}/Verilog-Fundamentals`,
  },
  {
    t: "Python-Programming",
    art: "code",
    problem: "Practise scripting and automation for everyday engineering tasks.",
    tools: "Python",
    learned: "Core Python, automation and data handling.",
    url: `${GITHUB}/Python-Programming`,
  },
  {
    t: "C-Programming-and-DSA",
    art: "nodes",
    problem: "Understand low-level programming and how data structures sit in memory.",
    tools: "C",
    learned: "Pointers, memory and the core data structures.",
    url: `${GITHUB}/C-Programming-and-DSA`,
  },
];

// [title, description, optional illustration]
const FLOW = [
  ["Specification", "Define what the chip must do.", "spec"],
  ["Architecture design", "Divide the system into functional blocks."],
  ["RTL design", "Write Verilog or SystemVerilog code.", "rtl"],
  ["Functional verification", "Check the RTL with testbenches and simulation."],
  ["Logic synthesis", "Convert RTL into a gate-level netlist.", "synth"],
  ["DFT insertion", "Add structures for manufacturing tests."],
  ["Floorplanning", "Plan where the major blocks sit.", "floor"],
  ["Power planning", "Design the power and ground network."],
  ["Placement", "Position standard cells on the chip.", "place"],
  ["Clock tree synthesis", "Distribute the clock across the design.", "cts"],
  ["Routing", "Connect cells using metal interconnects.", "route"],
  ["Physical verification", "Check DRC, LVS and design constraints."],
  ["Static timing analysis", "Verify the timing requirements.", "sta"],
  ["Sign-off", "Finalize power, timing and physical checks."],
  ["Tape-out", "Send the final layout data for manufacturing."],
  ["Fabrication", "Manufacture the chip on silicon wafers.", "wafer"],
  ["Packaging and testing", "Package the chip and test its functionality.", "package"],
  ["Post-silicon validation", "Verify the manufactured chip in real hardware."],
];

const PHASES = { 0: "Phase 1 · Design", 4: "Phase 2 · Implementation", 14: "Phase 3 · Manufacturing" };

const PILLARS = [
  ["Understand", "I start from the specification: what must this block do, and how will I know it works?"],
  ["Design", "I split the problem into blocks, then describe each one in Verilog."],
  ["Verify", "I write a testbench, simulate, read the waveform, fix the bug and run it again."],
];

// Status is my honest read of where each skill stands; edit freely.
const SKILLS = [
  ["RTL and digital design", [["Verilog", "now"], ["Combinational and sequential logic", "now"], ["FSM design", "now"], ["SystemVerilog", "learning"], ["Clock domain crossing", "next"]]],
  ["Verification", [["Testbenches", "now"], ["Icarus Verilog and GTKWave", "now"], ["Assertions and UVM", "learning"], ["Coverage", "next"]]],
  ["Synthesis and physical design", [["Static timing analysis", "learning"], ["Logic synthesis", "next"], ["Floorplan, place and route", "next"], ["DRC and LVS checks", "next"]]],
  ["Computer architecture", [["CPU datapath and ALU", "learning"], ["RISC-V", "learning"], ["Memory and registers", "learning"]]],
  ["Programming and scripting", [["C and C++", "now"], ["Python", "now"], ["Java", "now"], ["Bash", "now"], ["Tcl", "next"]]],
  ["Tools and AI", [["Linux on WSL", "now"], ["Git and GitHub", "now"], ["Machine learning basics", "learning"], ["AI hardware and edge AI", "next"]]],
];
const STATUS = { now: "Using", learning: "Learning", next: "Up next" };

function Split({ text }) {
  return (
    <span className="ln" aria-label={text}>
      {[...text].map((c, i) => (
        <span className="ch" aria-hidden="true" key={i}>{c === " " ? "\u00A0" : c}</span>
      ))}
    </span>
  );
}

// Word-by-word split used for section headings (wraps properly, unlike Split).
function Words({ text }) {
  return (
    <span aria-label={text}>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="wd" aria-hidden="true"><span className="wi">{w}</span></span>
        </Fragment>
      ))}
    </span>
  );
}

function Art({ kind }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 3 };
  return (
    <svg viewBox="0 0 400 200" className="art" aria-hidden="true">
      {kind === "wave" &&
        [0, 1, 2].map((i) => (
          <polyline key={i} {...s} points={Array.from({ length: 12 }, (_, k) => {
            const y = 50 + i * 50 - ((k * 5 + i * 7) % 4 < 2 ? 22 : 0);
            return `${k * 32 + 8},${y} ${k * 32 + 40},${y}`;
          }).join(" ")} />
        ))}
      {kind === "layers" &&
        [0, 1, 2, 3].map((i) => (
          <rect key={i} {...s} x={40 + i * 24} y={24 + i * 18} width={200 + i * 30} height="90" opacity={1 - i * 0.2} />
        ))}
      {kind === "nodes" && (
        <>
          <polyline {...s} points="30,120 110,50 200,130 290,60 370,120" />
          {[[30, 120], [110, 50], [200, 130], [290, 60], [370, 120]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="12" fill="currentColor" />
          ))}
        </>
      )}
      {kind === "code" &&
        [220, 150, 270, 110, 200, 160].map((w, i) => (
          <rect key={i} x={(i % 3) * 22 + 30} y={20 + i * 28} width={w} height="12" fill="currentColor" />
        ))}
    </svg>
  );
}

/* ---------- Animated illustrations for the chip design flow ---------- */
// D = line that draws itself, Pop = shape that pops in, Grow = bar that grows from the left.
function D({ k = 0, alt, as: T = "path", ...p }) {
  return <T className={`d${alt ? " alt" : ""}`} pathLength="1" style={{ "--k": k }} {...p} />;
}
function Pop({ k = 0, alt, hot, as: T = "rect", ...p }) {
  return <T className={`p${alt ? " alt" : ""}${hot ? " hot" : ""}`} style={{ "--k": k }} {...p} />;
}
function Grow({ k = 0, ...p }) {
  return <rect className="grow" style={{ "--k": k }} rx="3" fill="currentColor" stroke="none" {...p} />;
}

const GATE = "M0 0H30A30 30 0 0 1 30 60H0Z";

function FlowArt({ kind }) {
  let body = null;

  if (kind === "spec") {
    body = (
      <>
        <D as="rect" x="130" y="20" width="140" height="160" rx="6" />
        {[0, 1, 2, 3].map((i) => (
          <Fragment key={i}>
            <D d={`M160 ${62 + i * 32}l8 8 14-16`} k={i + 1} />
            <D alt d={`M196 ${64 + i * 32}H245`} k={i + 1} />
          </Fragment>
        ))}
      </>
    );
  } else if (kind === "rtl") {
    body = [220, 150, 250, 120, 190, 90].map((w, i) => (
      <Grow key={i} x={(i % 2) * 24 + 60} y={22 + i * 28} width={w} height="12" k={i} opacity={i % 3 === 1 ? 0.55 : 1} />
    ));
  } else if (kind === "synth") {
    body = (
      <>
        <g transform="translate(100 30)"><D d={GATE} k={0} /></g>
        <g transform="translate(100 110)"><D d={GATE} k={1} /></g>
        <g transform="translate(240 70)"><D d={GATE} k={3} /></g>
        <D alt d="M40 45H100M40 75H100M40 125H100M40 155H100" k={0} />
        <D d="M160 60H200V85H240" k={2} />
        <D d="M160 140H200V115H240" k={2} />
        <D alt d="M300 100H360" k={4} />
      </>
    );
  } else if (kind === "floor") {
    const blocks = [[76, 36, 100, 64], [190, 36, 134, 40], [190, 86, 134, 78], [76, 114, 100, 50]];
    body = (
      <>
        <D as="rect" x="60" y="20" width="280" height="160" rx="8" />
        {blocks.map(([x, y, w, h], i) => (
          <Pop key={i} k={i + 3} x={x} y={y} width={w} height={h} rx="4" fill="currentColor" fillOpacity="0.2" />
        ))}
      </>
    );
  } else if (kind === "place") {
    const cells = [];
    for (let c = 0; c < 6; c++)
      for (let r = 0; r < 3; r++)
        if ((c * 3 + r) % 7 !== 4)
          cells.push(
            <Pop key={`${c}${r}`} k={(c * 7 + r * 3) % 14} alt={(c + r) % 4 === 0}
              x={70 + c * 48} y={36 + r * 52} width="40" height="36" rx="4" fill="currentColor" fillOpacity="0.22" />
          );
    body = cells;
  } else if (kind === "cts") {
    const leaves = [[110, 30], [110, 70], [290, 30], [290, 70], [110, 130], [110, 170], [290, 130], [290, 170]];
    body = (
      <>
        <D d="M40 100H200" k={0} />
        <D d="M200 50V150" k={1} />
        <D d="M200 50H110M200 50H290M200 150H110M200 150H290" k={2} />
        <D d="M110 30V70M290 30V70M110 130V170M290 130V170" k={3} />
        {leaves.map(([x, y], i) => (
          <Pop key={i} k={i + 10} alt x={x - 7} y={y - 7} width="14" height="14" rx="2" fill="currentColor" />
        ))}
        <Pop as="circle" k={0} hot cx="40" cy="100" r="9" />
      </>
    );
  } else if (kind === "route") {
    body = (
      <>
        <D d="M40 40H140V100H260V60H360" k={0} />
        <D alt d="M40 100H100V160H220V130H360" k={2} />
        <D d="M40 160H70V30H200V170H320V100H360" k={4} />
        {[[140, 40], [140, 100], [260, 100], [100, 100], [100, 160], [220, 160], [70, 160], [70, 30], [200, 30], [200, 170], [320, 170]].map(([x, y], i) => (
          <Pop as="circle" key={i} k={i + 8} cx={x} cy={y} r="5" fill="currentColor" />
        ))}
      </>
    );
  } else if (kind === "sta") {
    body = (
      <>
        <D d="M30 70H70V40H130V70H190V40H250V70H310V40H370" k={0} />
        <D alt d="M30 150H100V120H160V150H240V120H300V150H370" k={1} />
        <D d="M250 20V180" k={3} strokeDasharray="1" />
        <Pop as="circle" k={14} hot cx="250" cy="55" r="7" />
      </>
    );
  } else if (kind === "wafer") {
    const dies = [];
    let k = 0;
    for (let gx = -4; gx <= 4; gx++)
      for (let gy = -4; gy <= 4; gy++) {
        const dx = gx * 20, dy = gy * 16;
        if (dx * dx + dy * dy <= 74 * 74)
          dies.push(
            <Pop key={`${gx}${gy}`} k={k++ % 20} hot={(gx * 3 + gy * 5) % 9 === 0}
              x={200 + dx - 8} y={100 + dy - 6} width="16" height="12" rx="2" fill="currentColor" fillOpacity="0.4" stroke="none" />
          );
      }
    body = (
      <>
        <D as="circle" cx="200" cy="100" r="88" />
        {dies}
      </>
    );
  } else if (kind === "package") {
    body = (
      <>
        <D as="rect" x="110" y="50" width="180" height="100" rx="8" />
        <Pop k={4} x="150" y="78" width="100" height="44" rx="4" fill="currentColor" fillOpacity="0.25" />
        {Array.from({ length: 6 }, (_, i) => (
          <Fragment key={i}>
            <D alt d={`M110 ${62 + i * 15}H88`} k={i + 2} />
            <D alt d={`M290 ${62 + i * 15}H312`} k={i + 2} />
          </Fragment>
        ))}
      </>
    );
  }

  return (
    <svg viewBox="0 0 400 200" className="fart" aria-hidden="true">
      {body}
    </svg>
  );
}

// Static chip-themed background: metal buses with moving signal pulses, a die, a gate and RTL.
const BUS = [
  "M0 180H260V320H520V240H900",
  "M0 520H180V660H620V560H1000V700H1600",
  "M300 1000V820H700V900H1200V760H1600",
  "M1600 120H1300V260H1100",
  "M600 0V120H980V60H1300",
  "M0 860H340V780H460",
];
const PINS = Array.from({ length: 12 }, (_, i) => 36 + i * 24);

function Die() {
  return (
    <svg className="die" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {BUS.map((d, i) => <path key={i} d={d} className="wire" />)}
      {BUS.map((d, i) => (
        <path key={`p${i}`} d={d} className="pulse" pathLength="1000" style={{ animationDuration: `${7 + i * 1.5}s`, animationDelay: `${-i * 2}s` }} />
      ))}
      <g transform="translate(1040 330)" className="chip">
        <rect width="360" height="360" rx="16" />
        <rect x="48" y="48" width="264" height="264" rx="6" />
        {PINS.map((p) => <path key={p} d={`M${p} 0V-22M${p} 360V382M0 ${p}H-22M360 ${p}H382`} />)}
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={72 + (i % 4) * 62} y={72 + Math.floor(i / 4) * 62} width="48" height="48" />
        ))}
      </g>
      <g transform="translate(690 330)" className="chip">
        <path d="M0 0H28A28 28 0 0 1 28 56H0Z M-22 14H0M-22 42H0M84 28H56" />
      </g>
      <g className="rtl">
        <text x="90" y="420">always @(posedge clk) begin</text>
        <text x="90" y="446">{"if (!rst_n) q <= 1'b0;"}</text>
        <text x="90" y="472">{"else q <= d;"}</text>
        <text x="90" y="498">end</text>
      </g>
    </svg>
  );
}

/* =====================================================================
   3D BACKGROUND
   A physically-lit IC package on a PCB. Scroll to: lift the lid, reveal the
   silicon die, explode its metal layers, then put everything back together.
   ===================================================================== */
// Bloom (glow post-processing) looks great but is heavy. Set to true only on a strong GPU.
const ENABLE_BLOOM = false;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const snap = (v) => Math.round(v * 2) / 2;
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const mkCanvas = (w, h) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")];
};
const toTex = (c, aniso, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
};
const makeRoute = (pts) => {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, cum, total: cum[cum.length - 1] };
};
function placeOn(r, d, out) {
  let i = 1;
  while (i < r.cum.length - 1 && r.cum[i] < d) i++;
  const d0 = r.cum[i - 1], d1 = r.cum[i];
  const f = d1 > d0 ? (d - d0) / (d1 - d0) : 0;
  out.x = r.pts[i - 1][0] + (r.pts[i][0] - r.pts[i - 1][0]) * f;
  out.z = r.pts[i - 1][1] + (r.pts[i][1] - r.pts[i - 1][1]) * f;
}

/* ---------- PCB routing (world units, chip centred at 0,0) ---------- */
function buildPCBRoutes(rand) {
  const breakout = [];
  const extra = [];
  const outs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (let side = 0; side < 4; side++) {
    const [ox, oz] = outs[side];
    const tx = oz !== 0 ? 1 : 0, tz = ox !== 0 ? 1 : 0;
    for (let k = 0; k < 22; k++) {
      const o = -4.8 + k * 0.457;
      let x = ox !== 0 ? ox * 6.3 : o;
      let z = oz !== 0 ? oz * 6.3 : o;
      const pts = [[x, z]];
      const L1 = 0.5 + rand() * 1.4;
      x += ox * L1; z += oz * L1; pts.push([x, z]);
      const sg = o >= 0 ? 1 : -1;
      const J = 0.6 + Math.abs(o) * 0.35 + rand() * 1.2;
      x += ox * J + tx * sg * J; z += oz * J + tz * sg * J; pts.push([x, z]);
      const L2 = 2 + rand() * 11;
      x += ox * L2; z += oz * L2; pts.push([x, z]);
      if (rand() < 0.3) {
        const J2 = 0.8 + rand() * 1.5, s2 = rand() < 0.5 ? 1 : -1;
        x += ox * J2 + tx * s2 * J2; z += oz * J2 + tz * s2 * J2; pts.push([x, z]);
        const L3 = 1 + rand() * 4;
        x += ox * L3; z += oz * L3; pts.push([x, z]);
      }
      pts.forEach((p) => { p[0] = clamp(p[0], -23, 23); p[1] = clamp(p[1], -23, 23); });
      breakout.push(makeRoute(pts));
    }
  }
  for (let r = 0; r < 70; r++) {
    let x = (rand() - 0.5) * 44, z = (rand() - 0.5) * 44;
    if (Math.abs(x) < 8 && Math.abs(z) < 8) continue;
    const pts = [[x, z]];
    let h = rand() < 0.5;
    const n = 2 + Math.floor(rand() * 4);
    for (let k = 0; k < n; k++) {
      const d = snap((rand() - 0.5) * 10) || 1;
      if (h) x = clamp(x + d, -23, 23);
      else z = clamp(z + d, -23, 23);
      pts.push([x, z]);
      h = !h;
    }
    const rt = makeRoute(pts);
    if (rt.total > 1) extra.push(rt);
  }
  return { breakout, extra };
}

function pcbTexture(routes, size, W, aniso) {
  const [c, g] = mkCanvas(size, size);
  const mx = (v) => (v / W + 0.5) * size;
  g.fillStyle = "#0c2228";
  g.fillRect(0, 0, size, size);
  // faint copper-pour hatch
  g.strokeStyle = "rgba(102,199,184,0.045)";
  g.lineWidth = 1;
  for (let i = 0; i < size; i += 10) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, size); g.stroke();
  }
  g.lineCap = "round";
  g.lineJoin = "round";
  const px = size / W;
  routes.forEach((r) => {
    g.beginPath();
    r.pts.forEach(([x, z], i) => (i ? g.lineTo(mx(x), mx(z)) : g.moveTo(mx(x), mx(z))));
    g.strokeStyle = "rgba(102,199,184,0.20)";
    g.lineWidth = px * 0.22;
    g.stroke();
    g.strokeStyle = "rgba(190,240,230,0.95)";
    g.lineWidth = px * 0.085;
    g.stroke();
    const e = r.pts[r.pts.length - 1];
    g.fillStyle = "rgba(229,184,104,0.95)";
    g.beginPath(); g.arc(mx(e[0]), mx(e[1]), px * 0.16, 0, Math.PI * 2); g.fill();
  });
  // silkscreen footprint
  g.strokeStyle = "rgba(221,229,234,0.45)";
  g.lineWidth = px * 0.05;
  g.strokeRect(mx(-7.4), mx(-7.4), px * 14.8, px * 14.8);
  g.beginPath(); g.moveTo(mx(-7.4), mx(-6.4)); g.lineTo(mx(-6.4), mx(-7.4)); g.stroke();
  g.fillStyle = "rgba(221,229,234,0.55)";
  g.font = `${Math.round(px * 0.7)}px monospace`;
  g.fillText("U1", mx(-7.4), mx(-7.8));
  return toTex(c, aniso);
}

function radialAlpha() {
  const [c, g] = mkCanvas(256, 256);
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "#fff");
  gr.addColorStop(0.5, "#fff");
  gr.addColorStop(1, "#000");
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  return toTex(c, 1, false);
}

function dieTexture(aniso) {
  const S = 1024;
  const [c, g] = mkCanvas(S, S);
  g.fillStyle = "#04070a";
  g.fillRect(0, 0, S, S);
  g.strokeStyle = "rgba(102,199,184,0.10)";
  g.lineWidth = 1;
  for (let i = 0; i <= 64; i++) {
    const p = (i * S) / 64;
    g.beginPath(); g.moveTo(p, 0); g.lineTo(p, S); g.moveTo(0, p); g.lineTo(S, p); g.stroke();
  }
  const blocks = [[70, 70, 420, 300], [520, 70, 430, 200], [520, 300, 430, 330], [70, 400, 420, 230], [70, 660, 880, 290]];
  blocks.forEach(([x, y, w, h], bi) => {
    g.fillStyle = "rgba(102,199,184,0.08)";
    g.fillRect(x, y, w, h);
    g.strokeStyle = "rgba(102,199,184,0.7)";
    g.lineWidth = 3;
    g.strokeRect(x, y, w, h);
    g.fillStyle = bi % 2 ? "rgba(229,184,104,0.5)" : "rgba(102,199,184,0.45)";
    for (let i = 0; i < 28; i++) {
      const rx = x + 14 + ((i * 53 + bi * 31) % Math.max(10, w - 60));
      const ry = y + 14 + ((i * 37 + bi * 17) % Math.max(10, h - 40));
      g.fillRect(rx, ry, 22 + (i % 4) * 8, 10);
    }
  });
  g.fillStyle = "rgba(229,184,104,0.95)";
  for (let i = 0; i < 32; i++) {
    const p = 24 + i * 30;
    g.fillRect(p, 14, 14, 14); g.fillRect(p, S - 28, 14, 14);
    g.fillRect(14, p, 14, 14); g.fillRect(S - 28, p, 14, 14);
  }
  return toTex(c, aniso);
}

function lidTexture(aniso) {
  const S = 1024;
  const [c, g] = mkCanvas(S, S);
  g.clearRect(0, 0, S, S);
  g.fillStyle = "#dfe8ee";
  g.textAlign = "center";
  g.font = "700 150px 'Helvetica Neue', Arial, sans-serif";
  g.fillText("RTL-GDSII", S / 2, 450);
  g.font = "500 52px monospace";
  g.fillText("VLSI  ·  DIGITAL DESIGN", S / 2, 540);
  g.font = "400 34px monospace";
  g.globalAlpha = 0.75;
  g.fillText("BGA-484   REV 1.0   2026", S / 2, 625);
  g.globalAlpha = 0.5;
  g.strokeStyle = "#dfe8ee";
  g.lineWidth = 4;
  g.strokeRect(60, 60, S - 120, S - 120);
  g.globalAlpha = 0.8;
  g.fillStyle = "#dfe8ee";
  g.beginPath(); g.arc(120, 120, 18, 0, Math.PI * 2); g.fill();
  return toTex(c, aniso);
}

function waferTexture(rand, aniso) {
  const S = 1024;
  const [c, g] = mkCanvas(S, S);
  g.fillStyle = "#0a0f16";
  g.fillRect(0, 0, S, S);
  const cw = 46, ch = 38;
  for (let y = 0; y < S; y += ch)
    for (let x = 0; x < S; x += cw) {
      g.fillStyle = `hsl(${205 + rand() * 70}, 55%, ${12 + rand() * 12}%)`;
      g.fillRect(x + 2, y + 2, cw - 4, ch - 4);
      g.fillStyle = "rgba(180,220,255,0.10)";
      g.fillRect(x + 6, y + 6, cw - 12, 3);
    }
  return toTex(c, aniso);
}

function layerTexture(routes, size, aniso) {
  const [c, g] = mkCanvas(size, size);
  const m = (v) => (v / 9 + 0.5) * size;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.strokeStyle = "rgba(255,255,255,0.05)";
  g.lineWidth = 1;
  for (let i = 0; i <= 36; i++) {
    const p = (i * size) / 36;
    g.beginPath(); g.moveTo(p, 0); g.lineTo(p, size); g.moveTo(0, p); g.lineTo(size, p); g.stroke();
  }
  routes.forEach((r) => {
    g.beginPath();
    r.pts.forEach(([x, z], i) => (i ? g.lineTo(m(x), m(z)) : g.moveTo(m(x), m(z))));
    g.strokeStyle = "rgba(255,255,255,0.18)";
    g.lineWidth = size * 0.016;
    g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.95)";
    g.lineWidth = size * 0.005;
    g.stroke();
    const e = r.pts[r.pts.length - 1];
    g.fillStyle = "#fff";
    g.beginPath(); g.arc(m(e[0]), m(e[1]), size * 0.008, 0, Math.PI * 2); g.fill();
  });
  return toTex(c, aniso);
}

function initScene(container) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = window.innerWidth < 700;
  const rand = rng(11);
  const N = 5; // metal layers
  const LAYER_Y0 = 1.6;
  const C_ACC = new THREE.Color(0x66c7b8);
  const C_GOLD = new THREE.Color(0xe5b868);
  const BG = 0x111c25;

  /* ---- renderer + post-processing ---- */
  const renderer = new THREE.WebGLRenderer({ antialias: !ENABLE_BLOOM, powerPreference: "high-performance" });
  let pr = Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5);
  renderer.setPixelRatio(pr);
  renderer.setClearColor(BG, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !narrow;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false; // re-rendered only when the lid moves
  renderer.shadowMap.needsUpdate = true;
  container.appendChild(renderer.domElement);
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.FogExp2(BG, 0.013);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 260);

  let composer = null, rt = null, bloom = null;
  if (ENABLE_BLOOM) {
    rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: narrow ? 0 : 4 });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), narrow ? 0.42 : 0.6, 0.7, 0.88);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  /* ---- image-based lighting (soft studio reflections) ---- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;

  /* ---- lights ---- */
  scene.add(new THREE.HemisphereLight(0x9fd8ff, 0x0b1218, 0.35));
  const key = new THREE.DirectionalLight(0xd5ecff, 2.6);
  key.position.set(9, 17, 8);
  key.castShadow = !narrow;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -17; key.shadow.camera.right = 17;
  key.shadow.camera.top = 17; key.shadow.camera.bottom = -17;
  key.shadow.camera.near = 1; key.shadow.camera.far = 50;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.04;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe5b868, 1.3);
  rim.position.set(-12, 7, -10);
  scene.add(rim);
  const core = new THREE.PointLight(0x66c7b8, 40, 40, 2);
  core.position.set(0, 3, 0);
  scene.add(core);

  /* ---- PCB ---- */
  const W = 52;
  const { breakout, extra } = buildPCBRoutes(rand);
  const pcbRoutes = breakout.concat(extra);
  const pcbMat = new THREE.MeshStandardMaterial({
    map: pcbTexture(pcbRoutes, narrow ? 1024 : 1536, W, aniso),
    color: 0xffffff,
    roughness: 0.55,
    metalness: 0.15,
    transparent: true,
    alphaMap: radialAlpha(),
  });
  pcbMat.emissiveMap = pcbMat.map;
  pcbMat.emissive = new THREE.Color(0x66c7b8);
  pcbMat.emissiveIntensity = 1.25;
  const pcb = new THREE.Mesh(new THREE.PlaneGeometry(W, W), pcbMat);
  pcb.rotation.x = -Math.PI / 2;
  pcb.receiveShadow = true;
  pcb.renderOrder = -1;
  scene.add(pcb);

  /* ---- SMD components fed by the traces ---- */
  {
    const comps = [];
    breakout.forEach((r, i) => {
      if (i % 2) return;
      const a = r.pts[r.pts.length - 2], b = r.pts[r.pts.length - 1];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L > 0.2 && comps.length < 80) comps.push({ x: b[0], z: b[1], dx: (b[0] - a[0]) / L, dz: (b[1] - a[1]) / L });
    });
    const bodies = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.62, 0.2, 0.34),
      new THREE.MeshStandardMaterial({ color: 0x15191d, roughness: 0.6, metalness: 0.1 }),
      comps.length
    );
    const ends = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.12, 0.21, 0.36),
      new THREE.MeshStandardMaterial({ color: 0xd9dee2, roughness: 0.3, metalness: 1 }),
      comps.length * 2
    );
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    const up = new THREE.Vector3(0, 1, 0);
    const off = new THREE.Matrix4();
    comps.forEach((c, i) => {
      q.setFromAxisAngle(up, Math.atan2(-c.dz, c.dx));
      p.set(c.x + c.dx * 0.35, 0.1, c.z + c.dz * 0.35);
      m.compose(p, q, one);
      bodies.setMatrixAt(i, m);
      off.makeTranslation(-0.25, 0, 0);
      ends.setMatrixAt(i * 2, m.clone().multiply(off));
      off.makeTranslation(0.25, 0, 0);
      ends.setMatrixAt(i * 2 + 1, m.clone().multiply(off));
    });
    bodies.castShadow = bodies.receiveShadow = ends.castShadow = true;
    scene.add(bodies, ends);

    const icMat = new THREE.MeshStandardMaterial({ color: 0x0b0f13, roughness: 0.5, metalness: 0.25 });
    [[-13, 10], [14, -9], [-11, -14], [16, 12], [2, -17], [-17, 1]].forEach(([x, z], i) => {
      const ic = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.32, 2.4), icMat);
      ic.position.set(x, 0.16, z);
      ic.rotation.y = i * 0.5;
      ic.castShadow = ic.receiveShadow = true;
      scene.add(ic);
    });
    const capSide = new THREE.MeshStandardMaterial({ color: 0x14323a, roughness: 0.45, metalness: 0.3 });
    const capTop = new THREE.MeshStandardMaterial({ color: 0xb8c4cc, roughness: 0.3, metalness: 1 });
    [[9, 13], [-8, 15], [12, -15], [-15, -8], [17, 3], [-6, -18]].forEach(([x, z]) => {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 28), [capSide, capTop, capSide]);
      cap.position.set(x, 0.45, z);
      cap.castShadow = cap.receiveShadow = true;
      scene.add(cap);
    });
  }

  /* ---- IC package: body, gull-wing pins, silicon die, metal lid ---- */
  const chip = new THREE.Group();
  scene.add(chip);
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(11, 0.7, 11, 4, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x0b1116, roughness: 0.38, metalness: 0.05 })
  );
  body.position.y = 0.55;
  body.castShadow = body.receiveShadow = true;
  chip.add(body);
  {
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xe5b868, metalness: 1, roughness: 0.25 });
    const stubs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.17, 0.07, 0.56), pinMat, 88);
    const feet = new THREE.InstancedMesh(new THREE.BoxGeometry(0.17, 0.36, 0.07), pinMat, 88);
    const m = new THREE.Matrix4(), pv = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    const q0 = new THREE.Quaternion();
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    let idx = 0;
    for (let side = 0; side < 4; side++)
      for (let k = 0; k < 22; k++) {
        const o = -4.8 + k * 0.457;
        const sg = side % 2 ? -1 : 1;
        const q = side < 2 ? q0 : qy;
        if (side < 2) pv.set(o, 0.38, sg * 5.78); else pv.set(sg * 5.78, 0.38, o);
        m.compose(pv, q, one);
        stubs.setMatrixAt(idx, m);
        if (side < 2) pv.set(o, 0.19, sg * 6.02); else pv.set(sg * 6.02, 0.19, o);
        m.compose(pv, q, one);
        feet.setMatrixAt(idx, m);
        idx++;
      }
    stubs.castShadow = feet.castShadow = true;
    chip.add(stubs, feet);
  }
  const dieTex = dieTexture(aniso);
  const die = new THREE.Mesh(
    new THREE.BoxGeometry(5.4, 0.22, 5.4),
    new THREE.MeshPhysicalMaterial({
      color: 0x0a1118, map: dieTex, emissiveMap: dieTex, emissive: new THREE.Color(0x66c7b8), emissiveIntensity: 0.9,
      metalness: 0.85, roughness: 0.2, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 500],
    })
  );
  die.position.y = 1.01;
  die.castShadow = die.receiveShadow = true;
  chip.add(die);

  const lid = new THREE.Group();
  const lidMesh = new THREE.Mesh(
    new RoundedBoxGeometry(8.2, 0.35, 8.2, 3, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x2d3a45, metalness: 1, roughness: 0.32 })
  );
  lidMesh.castShadow = lidMesh.receiveShadow = true;
  const decal = new THREE.Mesh(
    new THREE.PlaneGeometry(7.4, 7.4),
    new THREE.MeshStandardMaterial({ map: lidTexture(aniso), transparent: true, metalness: 0.4, roughness: 0.45 })
  );
  decal.rotation.x = -Math.PI / 2;
  decal.position.y = 0.178;
  lid.add(lidMesh, decal);
  lid.position.y = 1.3;
  chip.add(lid);

  /* ---- exploded die layers (metal stack) ---- */
  const stack = new THREE.Group();
  scene.add(stack);
  const layers = [];
  const layerRoutes = [];
  const fades = []; // [material, baseOpacity]
  const boxGeo = new THREE.BoxGeometry(9, 0.05, 9);
  const boxEdges = new THREE.EdgesGeometry(boxGeo);
  const planeGeo = new THREE.PlaneGeometry(9, 9);
  planeGeo.rotateX(-Math.PI / 2);
  for (let i = 0; i < N; i++) {
    const col = C_ACC.clone().lerp(C_GOLD, (i / (N - 1)) * 0.6);
    const g = new THREE.Group();
    stack.add(g);
    layers.push(g);

    const routes = [];
    const horizFirst = i % 2 === 0;
    for (let r = 0; r < 16; r++) {
      let x = snap((rand() - 0.5) * 8), z = snap((rand() - 0.5) * 8);
      const pts = [[x, z]];
      let h = horizFirst ? rand() < 0.7 : rand() < 0.3;
      const n = 3 + Math.floor(rand() * 3);
      for (let k = 0; k < n; k++) {
        const d = snap((rand() - 0.5) * 5) || 1;
        if (h) x = clamp(x + d, -4.2, 4.2);
        else z = clamp(z + d, -4.2, 4.2);
        pts.push([x, z]);
        h = !h;
      }
      const rt2 = makeRoute(pts);
      if (rt2.total > 1) { rt2.layer = i; routes.push(rt2); layerRoutes.push(rt2); }
    }

    const slab = new THREE.Mesh(
      boxGeo,
      new THREE.MeshPhysicalMaterial({ color: col, transparent: true, opacity: 0, roughness: 0.1, metalness: 0.2, depthWrite: false })
    );
    const frame = new THREE.LineSegments(
      boxEdges,
      new THREE.LineBasicMaterial({ color: col.clone().multiplyScalar(1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    const traces = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({
        map: layerTexture(routes, narrow ? 768 : 1024, aniso), color: col.clone().multiplyScalar(2.4),
        transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      })
    );
    traces.position.y = 0.03;
    g.add(slab, frame, traces);
    fades.push([slab.material, 0.14], [frame.material, 0.9], [traces.material, 1]);
  }
  // standard cells on the bottom layer
  {
    const cellsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.35, metalness: 0.7, emissive: 0x66c7b8, emissiveIntensity: 0.18, transparent: true, opacity: 0,
    });
    const cells = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), cellsMat, 169);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), pv = new THREE.Vector3(), sv = new THREE.Vector3();
    let idx = 0;
    for (let gx = 0; gx < 13; gx++)
      for (let gz = 0; gz < 13; gz++) {
        const h = 0.05 + rand() * 0.28;
        pv.set((gx - 6) * 0.62, h / 2 + 0.03, (gz - 6) * 0.62);
        sv.set(0.4, h, 0.4);
        m.compose(pv, q, sv);
        cells.setMatrixAt(idx, m);
        cells.setColorAt(idx, rand() < 0.1 ? C_GOLD : C_ACC);
        idx++;
      }
    cells.instanceColor.needsUpdate = true;
    layers[0].add(cells);
    fades.push([cellsMat, 0.9]);
  }
  // vias
  const vias = [];
  for (let a = 0; a < N - 1; a++) {
    const rs = layerRoutes.filter((r) => r.layer === a);
    for (let k = 0; k < 8; k++) {
      const p = rs[Math.floor(rand() * rs.length)].pts.slice(-1)[0];
      vias.push({ x: p[0], z: p[1], a });
    }
  }
  const viaPos = new Float32Array(vias.length * 6);
  const viaGeo = new THREE.BufferGeometry();
  viaGeo.setAttribute("position", new THREE.BufferAttribute(viaPos, 3));
  const viaMat = new THREE.LineBasicMaterial({ color: C_GOLD.clone().multiplyScalar(1.8), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const viaLines = new THREE.LineSegments(viaGeo, viaMat);
  viaLines.frustumCulled = false;
  stack.add(viaLines);
  fades.push([viaMat, 0.8]);

  /* ---- glowing signal pulses ---- */
  const sc = mkCanvas(64, 64);
  {
    const g = sc[1];
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.3, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
  }
  const sprite = new THREE.CanvasTexture(sc[0]);
  const out = { x: 0, z: 0 };
  let lastGap = -1;
  let lastE1 = -1;
  const makePulses = (routes, n, size, color, yOf, bidir) => {
    const pos = new Float32Array(n * 3);
    const pr2 = new Array(n);
    const d = new Float32Array(n), v = new Float32Array(n), rev = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      pr2[i] = routes[Math.floor(rand() * routes.length)];
      d[i] = rand() * pr2[i].total;
      v[i] = 0.9 + rand() * 2.2;
      rev[i] = bidir && rand() < 0.5 ? 1 : 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const material = new THREE.PointsMaterial({
      color, size, map: sprite, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, material);
    points.frustumCulled = false;
    const update = (dt) => {
      for (let i = 0; i < n; i++) {
        d[i] += v[i] * dt;
        if (d[i] > pr2[i].total) {
          pr2[i] = routes[Math.floor(Math.random() * routes.length)];
          d[i] = 0;
          rev[i] = bidir && Math.random() < 0.5 ? 1 : 0;
        }
        placeOn(pr2[i], rev[i] ? pr2[i].total - d[i] : d[i], out);
        pos[i * 3] = out.x;
        pos[i * 3 + 1] = yOf(pr2[i]);
        pos[i * 3 + 2] = out.z;
      }
      geo.attributes.position.needsUpdate = true;
    };
    update(0);
    return { points, update, material };
  };
  const pcbPulses = makePulses(pcbRoutes, narrow ? 90 : 160, 0.34, new THREE.Color(0xa8fff0).multiplyScalar(2), () => 0.06, true);
  scene.add(pcbPulses.points);
  const layerPulses = makePulses(layerRoutes, narrow ? 90 : 160, 0.4, C_GOLD.clone().multiplyScalar(2.4), (r) => LAYER_Y0 + r.layer * Math.max(lastGap, 0.02) + 0.07, false);
  layerPulses.material.opacity = 0;
  stack.add(layerPulses.points);
  fades.push([layerPulses.material, 1]);

  /* ---- drifting logic gates ---- */
  const gates = [];
  {
    const pts = [new THREE.Vector3(-0.7, -0.55, 0), new THREE.Vector3(0, -0.55, 0)];
    for (let a = -90; a <= 90; a += 10) {
      const r = (a * Math.PI) / 180;
      pts.push(new THREE.Vector3(Math.cos(r) * 0.55, Math.sin(r) * 0.55, 0));
    }
    pts.push(new THREE.Vector3(0, 0.55, 0), new THREE.Vector3(-0.7, 0.55, 0));
    const bodyG = new THREE.BufferGeometry().setFromPoints(pts);
    const stubsG = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.1, -0.28, 0), new THREE.Vector3(-0.7, -0.28, 0),
      new THREE.Vector3(-1.1, 0.28, 0), new THREE.Vector3(-0.7, 0.28, 0),
      new THREE.Vector3(0.55, 0, 0), new THREE.Vector3(1.0, 0, 0),
    ]);
    const lm = (c) => new THREE.LineBasicMaterial({ color: c.clone().multiplyScalar(1.5), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
    for (let i = 0; i < 8; i++) {
      const g = new THREE.Group();
      const c = i % 3 === 0 ? C_GOLD : C_ACC;
      g.add(new THREE.LineLoop(bodyG, lm(c)), new THREE.LineSegments(stubsG, lm(c)));
      const ang = rand() * Math.PI * 2, rad = 18 + rand() * 12;
      g.position.set(Math.cos(ang) * rad, 4 + rand() * 14, Math.sin(ang) * rad);
      g.scale.setScalar(1.4 + rand() * 1.6);
      g.rotation.set(rand() * 3, rand() * 3, rand() * 3);
      g.userData.spin = 0.15 + rand() * 0.3;
      scene.add(g);
      gates.push(g);
    }
  }

  /* ---- silicon wafer in the distance ---- */
  const waferYaw = new THREE.Group(), waferTilt = new THREE.Group();
  const wafer = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 9, 0.14, 96),
    [
      new THREE.MeshStandardMaterial({ color: 0x8a97a3, metalness: 1, roughness: 0.25 }),
      new THREE.MeshPhysicalMaterial({
        map: waferTexture(rand, aniso), color: 0xffffff, metalness: 0.9, roughness: 0.22,
        iridescence: 1, iridescenceIOR: 1.7, iridescenceThicknessRange: [250, 700],
      }),
      new THREE.MeshStandardMaterial({ color: 0x20262c, metalness: 0.8, roughness: 0.4 }),
    ]
  );
  waferTilt.rotation.x = Math.PI / 2 - 0.4;
  waferYaw.rotation.y = 0.7;
  waferTilt.add(wafer);
  waferYaw.add(waferTilt);
  waferYaw.position.set(-25, 6, -29);
  scene.add(waferYaw);

  /* ---- dust ---- */
  const dust = (() => {
    const n = 500, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (rand() - 0.5) * 70;
      p[i * 3 + 1] = rand() * 30;
      p[i * 3 + 2] = (rand() - 0.5) * 70;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({
      color: 0x9fb4c0, size: 0.13, map: sprite, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    scene.add(pts);
    return pts;
  })();

  /* ---- camera path: one keyframe per section ---- */
  const kk = narrow ? 1.3 : 1;
  const V = (a) => new THREE.Vector3(a[0] * kk, a[1] * kk, a[2] * kk);
  const camCurve = new THREE.CatmullRomCurve3([[12, 9, 16], [-10, 6, 12], [8, 4, 9], [0.6, 17, 3.5], [-7, 2.5, 8], [16, 12, 24]].map(V));
  const tgtCurve = new THREE.CatmullRomCurve3([[0, 0.8, 0], [0, 1.5, 0], [0, 2, 0], [0, 0, 0], [0, 2, 0], [0, 0, 0]].map((a) => new THREE.Vector3(...a)));

  const S = { cur: 0 };
  const ptr = { x: 0, y: 0, cx: 0, cy: 0 };
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3();

  const applyGap = (gap) => {
    layers.forEach((l, i) => (l.position.y = LAYER_Y0 + i * gap));
    vias.forEach((v, i) => {
      viaPos.set([v.x, LAYER_Y0 + v.a * gap, v.z, v.x, LAYER_Y0 + (v.a + 1) * gap, v.z], i * 6);
    });
    viaGeo.attributes.position.needsUpdate = true;
    lastGap = gap;
  };
  applyGap(0.02);

  const update = (dt, t) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    S.cur += (target - S.cur) * (reduce ? 1 : Math.min(1, dt * 3.5));
    const s = S.cur;

    // lid lifts off, layers explode, then everything re-assembles
    const e1 = smooth(0.08, 0.3, s) - smooth(0.84, 0.97, s);
    const e2 = smooth(0.18, 0.48, s) - smooth(0.8, 0.95, s);
    lid.position.set(e1 * 13, 1.3 + e1 * 5, 0);
    lid.rotation.set(e1 * 0.2, 0, e1 * 0.6);
    if (renderer.shadowMap.enabled && Math.abs(e1 - lastE1) > 0.001) {
      renderer.shadowMap.needsUpdate = true;
      lastE1 = e1;
    }

    const gap = 0.02 + e2 * 2.0;
    if (Math.abs(gap - lastGap) > 1e-4) applyGap(gap);
    layers.forEach((l) => (l.visible = e2 > 0.01));
    layerPulses.points.visible = e2 > 0.01;
    for (let i = 0; i < fades.length; i++) fades[i][0].opacity = fades[i][1] * e2;
    core.position.y = LAYER_Y0 + gap * 2;
    core.intensity = 30 + 170 * e2;
    if (bloom) bloom.strength = (narrow ? 0.42 : 0.6) + e2 * 0.15;

    pcbPulses.update(dt);
    if (e2 > 0.01) layerPulses.update(dt);

    gates.forEach((g) => {
      g.rotation.y += dt * g.userData.spin;
      g.rotation.x += dt * g.userData.spin * 0.5;
    });
    wafer.rotation.y += dt * 0.06;
    dust.rotation.y = t * 0.01;

    ptr.cx += (ptr.x - ptr.cx) * Math.min(1, dt * 3);
    ptr.cy += (ptr.y - ptr.cy) * Math.min(1, dt * 3);
    camCurve.getPoint(s, v1);
    tgtCurve.getPoint(s, v2);
    camera.position.set(
      v1.x + ptr.cx * 1.0 + Math.sin(t * 0.2) * 0.35,
      v1.y + e2 * 3 - ptr.cy * 0.6,
      v1.z + Math.cos(t * 0.17) * 0.3
    );
    camera.lookAt(v2.x, v2.y + e2 * 3.5, v2.z);
  };

  const draw = () => (composer ? composer.render() : renderer.render(scene, camera));

  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    if (composer) composer.setSize(w, h);
    camera.aspect = w / h;
    if (w > 900) camera.setViewOffset(w, h, -w * 0.16, 0, w, h); // chip sits right of the text
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    if (reduce) { update(0, 0); draw(); }
  };
  const onMove = (e) => {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onScroll = () => { if (reduce) { update(0, 0); draw(); } };

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("scroll", onScroll, { passive: true });

  let raf = 0;
  if (reduce) {
    update(0, 0);
    draw();
  } else {
    update(0, 0);
    draw(); // compile shaders now, while the loader is still covering the screen
    // Self-tuning: if frames are slow, lower the resolution, then cap at 30fps.
    let last = performance.now();
    let warm = 60, acc = 0, frames = 0, half = false, flip = false;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (half && (flip = !flip)) return;
      const raw = (now - last) / 1000;
      const dt = Math.min(0.05, raw);
      last = now;
      if (warm > 0) warm--;
      else {
        acc += raw;
        if (++frames === 45) {
          const avg = acc / frames;
          acc = 0;
          frames = 0;
          if (avg > 0.026) {
            if (pr > 0.6) {
              pr = Math.max(0.6, pr - 0.25);
              renderer.setPixelRatio(pr);
              resize();
            } else if (!half) half = true;
          }
        }
      }
      update(dt, now / 1000);
      draw();
    };
    raf = requestAnimationFrame(frame);
  }

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("scroll", onScroll);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((mt) => {
          ["map", "emissiveMap", "alphaMap"].forEach((k) => mt[k] && mt[k].dispose());
          mt.dispose();
        });
      }
    });
    sprite.dispose();
    envTex.dispose();
    pmrem.dispose();
    if (composer) composer.dispose();
    if (rt) rt.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  };
}

function Scene3D({ onFail, onReady }) {
  const ref = useRef(null);
  useEffect(() => {
    let dispose;
    // wait until the intro animation is finished so loading never makes it stutter
    const id = setTimeout(() => {
      try {
        dispose = initScene(ref.current);
        onReady && onReady();
      } catch (e) {
        console.warn("3D background unavailable:", e);
        onFail && onFail();
      }
    }, 120);
    return () => {
      clearTimeout(id);
      dispose && dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="bg3d" ref={ref} aria-hidden="true" />;
}

function App() {
  const root = useRef(null);
  const stageRef = useRef(null);
  const pctRef = useRef(null);
  const countRef = useRef(null);
  const wipeLabel = useRef(null);
  const busy = useRef(false);
  const lenisRef = useRef(null);
  const introGate = useRef({ counter: false, scene: false, go: null, timer: 0 });
  const dlg = useRef(null);
  const bar = useRef(null);
  const [time, setTime] = useState("");
  const [flowOpen, setFlowOpen] = useState(false);
  const [gl, setGl] = useState(true); // false if WebGL is unavailable

  // tells the intro that the 3D background is built, so the loader can lift
  const markScene = () => {
    const g = introGate.current;
    g.scene = true;
    if (g.go) g.go();
  };

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    introGate.current = { counter: false, scene: introGate.current.scene, go: null, timer: 0 };

    // buttery inertia scrolling, synced with GSAP ScrollTrigger
    let lenis = null, tick = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      /* ---------- Intro ---------- */
      if (reduce) {
        gsap.set(".loader", { display: "none" });
      } else {
        // The loader stays up until BOTH the counter has finished and the 3D scene is ready,
        // so the first thing you see is the finished interface.
        const n = { v: 0 };
        const exit = gsap
          .timeline({ paused: true })
          .to(".loader", { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
          .from(".hero .ch", { yPercent: 115, duration: 0.9, stagger: 0.03, ease: "power4.out" }, "-=0.3")
          .from(".hero-fade", { opacity: 0, y: 18, duration: 0.7, stagger: 0.1 }, "-=0.5");
        const gate = introGate.current;
        gate.go = () => {
          if (gate.counter && gate.scene) exit.play();
        };
        gsap.to(n, {
          v: 100, duration: 1.3, ease: "power2.inOut",
          onUpdate: () => (countRef.current.textContent = String(Math.round(n.v)).padStart(3, "0")),
          onComplete: () => {
            gate.counter = true;
            gate.go();
          },
        });
        // safety net: never keep the loader forever
        gate.timer = setTimeout(() => {
          gate.scene = true;
          gate.go();
        }, 7000);
      }

      /* ---------- HUD (stage + progress) ---------- */
      gsap.utils.toArray("[data-stage]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: "top 50%", end: "bottom 50%",
          onToggle: (s) => s.isActive && (stageRef.current.textContent = STAGES[+el.dataset.stage]),
        });
      });
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (s) => (pctRef.current.textContent = Math.round(s.progress * 100) + "%"),
      });

      if (reduce) return;

      /* ---------- Scroll animations ---------- */
      const at = (trigger, start = "top 75%") => ({ trigger, start, toggleActions: "play none none reverse" });
      const words = (sec, from, start = "top 82%", extra = {}) =>
        gsap.from(`${sec} h2 .wi`, {
          ...from, duration: 1, stagger: 0.08, ease: "power4.out", ...extra,
          scrollTrigger: at(`${sec} h2`, start),
        });
      const fade = (targets, trigger, start = "top 85%", extra = {}) =>
        gsap.from(targets, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: at(trigger, start), ...extra });

      gsap.to(".hero h1", {
        yPercent: -14, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // ABOUT: words rise and tilt, goals line draws, list slides in from the right
      words("#about", { yPercent: 115, rotate: 7 });
      fade("#about .prose p", "#about .about-grid", "top 80%", { y: 50, stagger: 0.18 });
      gsap.fromTo("#about .goals", { "--w": 0 }, {
        "--w": 1, duration: 1.2, ease: "power3.inOut", scrollTrigger: at("#about .goals", "top 85%"),
      });
      gsap.from("#about .goals h3, #about .goals li", {
        x: 70, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: at("#about .goals", "top 85%"),
      });

      // PROJECTS: panel wipes in from the left, cards "boot up" bottom to top
      gsap.fromTo("#projects .panel-bg", { scaleX: 0, transformOrigin: "left center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: "#projects", start: "top 92%", end: "top 45%", scrub: true },
      });
      words("#projects", { xPercent: -110 }, "top 55%");
      gsap.utils.toArray("#projects .card").forEach((card) => {
        gsap.from(card, {
          clipPath: "inset(100% 0 0 0)", y: 60, duration: 1, ease: "power4.out",
          scrollTrigger: at(card, "top 88%"),
        });
        gsap.from(card.querySelectorAll(".art > *"), {
          opacity: 0, x: -40, duration: 0.6, stagger: 0.07, delay: 0.35, ease: "power2.out",
          scrollTrigger: at(card, "top 88%"),
        });
        gsap.from(card.querySelectorAll("h3, dl > div, .text-link"), {
          opacity: 0, y: 18, duration: 0.6, stagger: 0.08, delay: 0.5, ease: "power2.out",
          scrollTrigger: at(card, "top 88%"),
        });
      });

      // LAB: headline drops in from above, pillar rule draws, pillars bounce up
      words("#lab", { yPercent: -115, rotate: -6 });
      gsap.fromTo("#lab .pillars", { "--w": 0 }, {
        "--w": 1, duration: 1.4, ease: "power3.inOut", scrollTrigger: at("#lab .pillars", "top 82%"),
      });
      gsap.from("#lab .pillars > div", {
        y: 70, opacity: 0, stagger: 0.2, duration: 0.9, ease: "back.out(1.4)",
        scrollTrigger: at("#lab .pillars", "top 82%"),
      });
      gsap.from("#lab .btn", {
        scale: 0.5, opacity: 0, duration: 0.8, ease: "back.out(2)",
        scrollTrigger: at("#lab .btn", "top 95%"),
      });

      // SKILLS: panel wipes in from the right, headline flips up, rows cascade, tags pop
      gsap.fromTo("#skills .panel-bg", { scaleX: 0, transformOrigin: "right center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: "#skills", start: "top 92%", end: "top 45%", scrub: true },
      });
      words("#skills", { rotationX: -100, yPercent: 50, opacity: 0, transformOrigin: "50% 100%" }, "top 55%");
      fade("#skills .lede", "#skills .lede", "top 90%");
      gsap.utils.toArray("#skills .skillgrid > div").forEach((g) => {
        gsap.from(g, { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: at(g, "top 90%") });
        gsap.from(g.querySelectorAll("li"), {
          x: -24, opacity: 0, duration: 0.5, stagger: 0.06, delay: 0.25, ease: "power2.out",
          scrollTrigger: at(g, "top 90%"),
        });
        gsap.from(g.querySelectorAll(".tag"), {
          scale: 0, duration: 0.5, stagger: 0.06, delay: 0.5, ease: "back.out(3)",
          scrollTrigger: at(g, "top 90%"),
        });
      });

      // CONTACT: teal circle expands up from the bottom edge, big words rise
      gsap.fromTo("#contact .contact-bg", { scaleY: 0, transformOrigin: "center bottom" }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: "#contact", start: "top 95%", end: "top 35%", scrub: true },
      });
      words("#contact", { yPercent: 120 }, "top 55%", { duration: 1.2, stagger: 0.12 });
      fade("#contact .lede", "#contact .lede", "top 92%");
      gsap.from("#contact .big-btn", {
        scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(2)", scrollTrigger: at("#contact .big-btn", "top 95%"),
      });
      fade("#contact .links a", "#contact .links", "top 98%", { stagger: 0.12 });
    }, root);

    return () => {
      ctx.revert();
      clearTimeout(introGate.current.timer);
      if (tick) gsap.ticker.remove(tick);
      if (lenis) lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  /* ---------- Section-to-section wipe transition ---------- */
  const onNav = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (!el || busy.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollIntoView({ behavior: "auto" });
      return;
    }
    busy.current = true;
    wipeLabel.current.textContent = (NAV.find((n) => n[1] === id) || [id])[0];
    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      .fromTo(".wipe", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power3.inOut" })
      .add(() => {
        if (lenisRef.current) lenisRef.current.scrollTo(el, { immediate: true, force: true, offset: id === "home" ? 0 : -60 });
        else el.scrollIntoView({ behavior: "instant" });
        ScrollTrigger.update();
      })
      .to(".wipe", { clipPath: "inset(0 0% 0 100%)", duration: 0.55, ease: "power3.inOut" }, "+=0.15");
  };

  /* ---------- Chip flow popup ---------- */
  const openFlow = () => {
    setFlowOpen(true);
    dlg.current.scrollTop = 0;
    dlg.current.showModal();
  };

  useEffect(() => {
    if (!flowOpen) return;
    const d = dlg.current;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { root: d, threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    d.querySelectorAll(".fstep, .phase").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [flowOpen]);

  const onFlowScroll = () => {
    const d = dlg.current;
    const p = d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight);
    bar.current.style.transform = `scaleX(${p})`;
  };

  return (
    <div className="shell" ref={root} onClick={onNav}>
      <div className="loader" aria-hidden="true">
        <span className="loader-name">Omsai Dasari</span>
        <span className="loader-count" ref={countRef}>000</span>
      </div>

      <div className="wipe" aria-hidden="true">
        <span ref={wipeLabel}>Home</span>
      </div>

      {!gl && <Die />}
      {gl && (
        <Scene3D
          onFail={() => {
            setGl(false);
            markScene();
          }}
          onReady={markScene}
        />
      )}

      <header className="bar-top">
        <a className="brand" href="#home">Omsai<span>.</span></a>
        <nav aria-label="Primary">
          {NAV.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <span className="clock">Pune {time} IST</span>
      </header>

      <div className="hud" aria-hidden="true">
        <span>Stage: <b ref={stageRef}>Specification</b></span>
        <span ref={pctRef}>0%</span>
      </div>

      <main>
        {/* 1. Home */}
        <section className="hero" id="home" data-stage="0">
          <p className="hero-fade tagline">I build what's next.</p>
          <h1>
            <Split text="Hi, I'm" />
            <Split text="Omsai." />
          </h1>
          <div className="hero-foot hero-fade">
            <p>
              An ENTC engineering student in Pune, interested in RTL design, VLSI,
              digital hardware and the software that runs on it.
            </p>
            <div className="btns">
              <a className="btn solid" href="#projects">Explore my work</a>
              <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
              <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k}>RTL ✳ Verilog ✳ Verification ✳ Synthesis ✳ Floorplanning ✳ Routing ✳ Timing ✳ Tape-out ✳ </span>
            ))}
          </div>
        </div>

        {/* 2. About */}
        <section className="sec about wrap" id="about" data-stage="1">
          <h2><Words text="Curious by nature. Engineer by choice." /></h2>
          <div className="about-grid">
            <div className="prose">
              <p>
                I'm an ENTC engineering student in Pune.
                I'm learning how a computer is built from the bottom up: the code that runs on it,
                the Verilog that describes it, and the silicon it ends up on.
              </p>
              <p>
                I learn by building and publishing. Every repository on my GitHub is one step on a
                path from software, to hardware, to chip design.
              </p>
            </div>
            <div className="goals rule">
              <h3>Where I'm headed</h3>
              <ul>
                <li>VLSI RTL design engineer</li>
                <li>Chip design and verification engineer</li>
                <li>AI hardware engineer</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Projects */}
        <section className="sec panel wrap" id="projects" data-stage="2">
          <span className="panel-bg" aria-hidden="true" />
          <h2><Words text="Ideas into reality." /></h2>
          <div className="cards">
            {PROJECTS.map((p) => (
              <article className="card" key={p.t}>
                <Art kind={p.art} />
                <h3>{p.t}</h3>
                <dl>
                  <div><dt>The problem</dt><dd>{p.problem}</dd></div>
                  <div><dt>Tools</dt><dd>{p.tools}</dd></div>
                  <div><dt>What I learned</dt><dd>{p.learned}</dd></div>
                </dl>
                <a className="text-link" href={p.url} target="_blank" rel="noreferrer">View on GitHub ↗</a>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Engineering Lab */}
        <section className="sec lab wrap" id="lab" data-stage="3">
          <h2><Words text="Understand. Design. Verify." /></h2>
          <div className="pillars rule">
            {PILLARS.map(([t, d]) => (
              <div key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <button className="btn solid" onClick={openFlow}>
            See the full chip design flow
          </button>
        </section>

        {/* 5. Skills & Journey */}
        <section className="sec panel wrap" id="skills" data-stage="4">
          <span className="panel-bg" aria-hidden="true" />
          <h2><Words text="Always in the making." /></h2>
          <p className="lede">
            Right now I'm finishing the foundation (Verilog, C/C++, Linux, Git) and starting
            SystemVerilog and RISC-V. Each skill below is marked with where it honestly stands.
          </p>
          <div className="skillgrid">
            {SKILLS.map(([group, items]) => (
              <div key={group}>
                <h3>{group}</h3>
                <ul>
                  {items.map(([name, st]) => (
                    <li key={name}>
                      <span>{name}</span>
                      <em className={`tag ${st}`}>{STATUS[st]}</em>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Contact */}
        <section className="contact" id="contact" data-stage="5">
          <span className="contact-bg" aria-hidden="true" />
          <div className="wrap">
            <h2 className="big">
              <span className="row"><Words text="Let's make" /></span>
              <span className="row"><Words text="it happen." /></span>
            </h2>
            <p className="lede">
              I'd like to hear about internships, engineering projects, collaborations and anything
              I can learn from.
            </p>
            <a className="btn big-btn" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <div className="links">
              <a href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span>© 2026 Omsai Ganesh Dasari</span>
        <a href="#home">Back to top ↑</a>
      </footer>

      <dialog
        className="flow"
        data-lenis-prevent
        ref={dlg}
        aria-labelledby="flow-title"
        onScroll={onFlowScroll}
        onClose={() => {
          setFlowOpen(false);
          if (bar.current) bar.current.style.transform = "scaleX(0)";
        }}
        onClick={(e) => e.target === dlg.current && dlg.current.close()}
      >
        <div className="flow-head">
          <h3 id="flow-title">From idea to working chip</h3>
          <button className="btn" onClick={() => dlg.current.close()}>Close</button>
          <span className="flow-prog" ref={bar} />
        </div>
        {flowOpen && (
          <ol>
            {FLOW.map(([t, d, art], i) => (
              <Fragment key={t}>
                {PHASES[i] && <li className="phase"><span>{PHASES[i]}</span></li>}
                <li className="fstep">
                  <span className="n">{i + 1}</span>
                  <div className={`fbody${art ? " has-art" : ""}`}>
                    <div><b>{t}</b><p>{d}</p></div>
                    {art && <FlowArt kind={art} />}
                  </div>
                </li>
              </Fragment>
            ))}
          </ol>
        )}
      </dialog>
    </div>
  );
}

export default App;