import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

function App() {
  const root = useRef(null);
  const stageRef = useRef(null);
  const pctRef = useRef(null);
  const countRef = useRef(null);
  const wipeLabel = useRef(null);
  const busy = useRef(false);
  const dlg = useRef(null);
  const bar = useRef(null);
  const [time, setTime] = useState("");
  const [flowOpen, setFlowOpen] = useState(false);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      /* ---------- Intro ---------- */
      if (reduce) {
        gsap.set(".loader", { display: "none" });
      } else {
        const n = { v: 0 };
        gsap
          .timeline()
          .to(n, {
            v: 100, duration: 1.3, ease: "power2.inOut",
            onUpdate: () => (countRef.current.textContent = String(Math.round(n.v)).padStart(3, "0")),
          })
          .to(".loader", { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
          .from(".hero .ch", { yPercent: 115, duration: 0.9, stagger: 0.03, ease: "power4.out" }, "-=0.3")
          .from(".hero-fade", { opacity: 0, y: 18, duration: 0.7, stagger: 0.1 }, "-=0.5");
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

      // Background parallax: the chip drifts as you scroll
      gsap.fromTo(".die", { scale: 1.15, y: 0 }, {
        y: -60, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });
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
      gsap.fromTo("#projects", { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", ease: "none",
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
      gsap.fromTo("#skills", { clipPath: "inset(0 0 0 100%)" }, {
        clipPath: "inset(0 0 0 0%)", ease: "none",
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
      gsap.fromTo("#contact", { clipPath: "circle(0% at 50% 100%)" }, {
        clipPath: "circle(150% at 50% 100%)", ease: "none",
        scrollTrigger: { trigger: "#contact", start: "top 95%", end: "top 35%", scrub: true },
      });
      words("#contact", { yPercent: 120 }, "top 55%", { duration: 1.2, stagger: 0.12 });
      fade("#contact .lede", "#contact .lede", "top 92%");
      gsap.from("#contact .big-btn", {
        scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(2)", scrollTrigger: at("#contact .big-btn", "top 95%"),
      });
      fade("#contact .links a", "#contact .links", "top 98%", { stagger: 0.12 });
    }, root);

    return () => ctx.revert();
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
        el.scrollIntoView({ behavior: "instant" });
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

      <Die />

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
              A second-year engineering student in Pune, interested in RTL design, VLSI,
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
                I'm a second-year electronics and telecommunication engineering student in Pune.
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