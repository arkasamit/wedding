"use client";

import { DoorOpen, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Alpana, EventArt, Lotus, Toran } from "./art";
import { EntranceOpened } from "./entrance-state";

export function WeddingEntrance({ title, style, children }: { title: string; style: CSSProperties; children: ReactNode }) {
  const [stage, setStage] = useState<"ready" | "opening" | "open">("ready");
  const sound = useRef<HTMLAudioElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (openTimer.current !== null) clearTimeout(openTimer.current);
    };
  }, []);

  useEffect(() => {
    if (stage === "open") content.current?.querySelector<HTMLElement>("#hero-heading")?.focus({ preventScroll: true });
  }, [stage]);

  function open(withSound: boolean) {
    if (stage !== "ready") return;
    if (withSound) void sound.current?.play().catch(() => undefined);
    if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("open");
      return;
    }
    setStage("opening");
    openTimer.current = setTimeout(() => setStage("open"), 1640);
  }

  return <div className="site entry-shell" style={style} data-stage={stage}>
    {stage !== "open" && <section className="entry-screen" aria-label="বিয়ের আমন্ত্রণের প্রবেশদ্বার">
      <div className="stage-curtains" aria-hidden="true">
        <div className="velvet velvet-left" /><div className="velvet velvet-right" />
      </div>
      <div className="entrance-doors" aria-hidden="true">
        <div className="door-leaf door-left"><Alpana className="door-engraving" /><Lotus /><span /></div>
        <div className="door-leaf door-right"><Alpana className="door-engraving" /><Lotus /><span /></div>
      </div>
      <div className="entry-surround" aria-hidden="true">
        <Toran />
        <Lotus className="entry-crest" />
      </div>
      {stage === "ready" && <div className="entrance-actions">
        <div className="entrance-seal" aria-hidden="true">
          <div className="seal-pot"><EventArt kind="haldi" /></div>
          <Lotus className="seal-lotus" />
        </div>
        <div className="entry-identity">
          <p>শুভ পরিণয়</p>
          <h1>{title}</h1>
        </div>
        <button className="entrance-open" type="button" onClick={() => open(true)}>
          <DoorOpen size={19} aria-hidden="true" /> আমন্ত্রণ খুলুন
          <span className="sr-only">, শঙ্খধ্বনিসহ</span>
        </button>
        <button className="entrance-muted" type="button" onClick={() => open(false)}>
          <VolumeX size={16} aria-hidden="true" /> শব্দ ছাড়া খুলুন
        </button>
      </div>}
    </section>}
    <div className="entry-content" ref={content} inert={stage === "opening"}>
      <EntranceOpened.Provider value={stage === "open"}>{children}</EntranceOpened.Provider>
    </div>
    {/* Shankh Sound by rsn267 (CC0), shortened and leveled for the entrance. */}
    <audio ref={sound} src="/wedding-conch.mp3" preload="none" hidden />
    <noscript><style>{".entry-screen{display:none!important}.entry-shell .entry-content{visibility:visible!important}html:has(.entry-shell){overflow:visible!important}"}</style></noscript>
  </div>;
}
