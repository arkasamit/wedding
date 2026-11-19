export function Lotus({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M60 49C38 34 46 19 60 8c14 11 22 26 0 41Zm0 0C37 51 25 38 21 20c20 1 35 12 39 29Zm0 0c23 2 35-11 39-29-20 1-35 12-39 29Z"/>
    <path d="M60 49C33 59 13 52 4 35c22-5 43 3 56 14Zm0 0c27 10 47 3 56-14-22-5-43 3-56 14ZM60 20v20M30 11l-3-5m63 5 3-5"/>
  </svg>;
}

export function Toran() {
  return <svg className="toran" viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true" data-ambient="">
    <path d="M0 8Q112 96 225 8Q337 96 450 8Q562 96 675 8Q787 96 900 8" fill="none" stroke="#926234" strokeWidth="2"/>
    {[0, 225, 450, 675, 900].map((x, i) => <g className="garland" key={x} transform={`translate(${x} 12)`}>
      <path d="M0 0v85" stroke="#9f6a2e"/>
      {Array.from({ length: i % 2 ? 5 : 7 }, (_, j) => <g key={j} transform={`translate(0 ${j * 11 + 8})`}>
        <circle r="7" fill={j % 2 ? "#d78a21" : "#edb041"}/>
        <path d="M-5 0H5M0-5V5m-3-8 6 6m0-6-6 6" stroke="#ac5922" strokeWidth=".9"/>
      </g>)}
      <path d="M0 80q10 10 0 26-10-16 0-26Z" fill="#aa6540"/>
    </g>)}
    {Array.from({ length: 24 }, (_, i) => {
      const x = 17 + i * 37.6;
      const t = (x % 225) / 225;
      return <g className="toran-leaf" key={x} transform={`translate(${x} ${8 + 176 * t * (1 - t)}) rotate(${(0.5 - t) * 70})`}>
        <g className="toran-blade">
          <path d="M0 0Q-15 10 0 35Q13 13 0 0Z" fill={i % 2 ? "#566443" : "#737a4a"} stroke="#444e35" strokeWidth=".75"/>
          <path d="M0 3v26m0-10 4-5m-4 9-4-6" fill="none" stroke="#d8ad66" strokeWidth=".7"/>
        </g>
      </g>;
    })}
  </svg>;
}

export function BananaPlant({ side }: { side: "left" | "right" }) {
  const leaves = [
    "M82 249C70 173 35 142 7 140c14 55 45 69 75 109Z",
    "M82 203C75 117 47 64 21 54c1 59 30 117 61 149Z",
    "M83 168C69 93 83 32 110 10c12 56-7 103-27 158Z",
    "M83 212c22-72 55-110 98-111-20 51-57 76-98 111Z",
    "M85 262c26-57 62-77 110-71-29 37-66 50-110 71Z",
  ];
  const veins = [
    "M82 249Q43 173 10 143", "M82 203Q44 129 23 58", "M83 168Q90 89 109 16",
    "M83 212q45-80 94-108", "M85 262q50-56 106-69",
  ];
  const bases = ["82px 249px", "82px 203px", "83px 168px", "83px 212px", "85px 262px"];
  const branchVeins = [
    "M43 186l13 2", "M40 118l15 6-2-27m7 49-16-7",
    "M90 132l10-10m-9-13-8-13m16-7 12-15m-9-2-7-14",
    "M131 152l16-4m-9-3 3-16", "M134 226l26-5m-21-2 8-15",
  ];
  return <div className={`plant plant-${side}`} aria-hidden="true" data-ambient="">
    <svg viewBox="0 0 200 345">
      <path d="M77 318c11-55-1-105 5-159" fill="none" stroke="#aa8244" strokeWidth="13"/>
      <path d="M80 317c9-65 1-106 4-153" fill="none" stroke="#5b6337" strokeWidth="3"/>
      <g className="plant-crown">
        {leaves.map((leaf, i) => <g className="plant-blade" key={leaf} style={{ transformOrigin: bases[i] }}>
          <path d={leaf} fill={i % 2 ? "#687a45" : "#435a3c"} stroke="#36472f" strokeWidth="1.2"/>
          <path d={veins[i]} fill="none" stroke="#d3b477" strokeWidth="1.3"/>
          <path d={branchVeins[i]} fill="none" stroke="#b3a66f" strokeWidth="1"/>
        </g>)}
      </g>
      <path d="M53 316h55l-9 20H62Zm-5-5h66v6H48Z" fill="#a35639" stroke="#79352c" strokeWidth="1.5"/>
      <path d="M60 324h41m-44-10h45" fill="none" stroke="#e0a266" strokeWidth="1.6"/>
    </svg>
  </div>;
}

export function Alpana({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 240 240" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
    <circle cx="120" cy="120" r="114"/><circle cx="120" cy="120" r="106" strokeDasharray="1 5"/>
    {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30} 120 120)`}>
      <path data-ink="" pathLength="1" d="M120 105C101 76 103 54 120 28c17 26 19 48 0 77Zm0-17c-8-16-8-28 0-41 8 13 8 25 0 41Z"/>
      <circle cx="120" cy="20" r="2" fill="currentColor"/>
    </g>)}
    <circle cx="120" cy="120" r="12"/><circle cx="120" cy="120" r="5" fill="currentColor"/>
  </svg>;
}

export function WeddingGate() {
  return <svg className="wedding-gate" viewBox="0 0 1080 680" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <g stroke="currentColor">
      <path className="gate-draw" pathLength="1" strokeWidth="2" d="M18 666V205Q18 138 87 131q23-33 70-33h105q47-44 116-48 87-1 162-38 75 37 162 38 69 4 116 48h105q47 0 70 33 69 7 69 74v461"/>
      <path className="gate-draw" pathLength="1" d="M29 666V205q0-59 65-64 23-32 63-32h109q49-45 113-48 84-1 161-36 77 35 161 36 64 3 113 48h109q40 0 63 32 65 5 65 64v461M40 666V210m1000 456V210M7 651h1066M7 665h1066"/>
      <path strokeDasharray="1 5" strokeWidth="2" d="M35 648V207q0-56 61-61 23-31 62-31h110q48-43 111-47 88-3 161-36 73 33 161 36 63 4 111 47h110q39 0 62 31 61 5 61 61v441"/>
      {[54, 1026].map((x) => <g key={x}>
        <path d={`M${x} 250v379`} strokeDasharray="1 7" strokeWidth="2"/>
        {[280, 440, 600].map((y) => <path key={y} d={`M${x} ${y - 9}q-14 9 0 18 14-9 0-18Z`} />)}
      </g>)}
    </g>
  </svg>;
}

export function FloralSprig({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 210 180" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <path d="M4 173C46 150 67 107 104 79q24-18 56-24M23 164q57-9 98-3m-77-18q13-39 9-73m13 49q27-10 64-2m-41-24q6-32 4-57m30 33q26 4 46 21" />
    <path d="M17 168q23-30 54-20-24 27-54 20Zm22-21q-13-23-3-47 17 24 3 47Zm15-27q9-31 37-34-8 28-37 34Zm26-15q-5-21 11-39 7 23-11 39Zm26-27q2-24 26-38-2 26-26 38Zm13-3q23-6 43 10-26 7-43-10Zm-50 52q28-12 52 0-27 12-52 0Zm24 33q15-16 40-12-11 18-40 12Z" fill="currentColor" fillOpacity=".15"/>
    {[[163, 53, 21], [55, 65, 12], [94, 33, 13], [125, 118, 9], [172, 94, 10]].map(([x, y, radius]) => <g key={x} transform={`translate(${x} ${y})`}>
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="0" cy={-radius * .56} rx={radius * .27} ry={radius * .52} transform={`rotate(${i * 45})`} fill="currentColor" fillOpacity=".09"/>)}
      <circle r={radius * .3} fill="currentColor" fillOpacity=".25"/><circle r={radius * .13}/>
    </g>)}
  </svg>;
}

export function EventArt({ kind }: { kind: "haldi" | "bibaho" | "lamp" }) {
  return <svg viewBox="0 0 160 136" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "haldi" && <>
      <path d="M46 62Q24 47 25 27q23 6 32 27m33-3q9-25 34-30-3 25-22 36" fill="#5b6638"/>
      <path d="M59 58Q55 23 80 8c23 15 25 38 20 50Z" fill="#b47532"/>
      <path d="M49 61h62l-7 13c28 13 28 44 0 55H56c-28-11-28-42 0-55Z" fill="#b96330"/>
      <path d="M49 67h62M55 119h50M48 96q32-20 64 0-32 20-64 0Z" stroke="#ffe6a9"/>
      <circle cx="80" cy="96" r="5" fill="#ffe6a9" stroke="none"/>
    </>}
    {kind === "bibaho" && <>
      <path d="M41 122h78v-12H41Zm7-12V91h64v19m-54-19V74h44v17m-36-17V58h28v16m-22-16V43h16v15m-8-15C64 31 67 21 80 10c13 11 16 21 0 33Z"/>
      <path d="M48 100h64m-52-18h40m-31-16h22M36 122l-12-10v-13m100 23 12-10v-13M17 85q7-17 14 0-7 13-14 0Zm112 0q7-17 14 0-7 13-14 0Z"/>
      <circle cx="80" cy="31" r="3" fill="currentColor"/>
    </>}
    {kind === "lamp" && <>
      <g className="diya-flame">
        <path d="M80 82C58 67 69 48 85 25c-1 17 16 27 7 43-3 6-7 10-12 14Z" fill="#e2a251"/>
        <path d="M80 79c-8-8-5-18 3-30 0 10 7 17 3 24-2 3-4 5-6 6Z" fill="#F4E8D2" stroke="none"/>
      </g>
      <path d="M33 87h94c-6 23-24 34-47 34S39 110 33 87Zm12 12h70m-52 29h34M53 61l-12-10m66 10 12-10M80 13V7"/>
    </>}
  </svg>;
}
