"use client";

import { Music2, Pause } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type MusicControls = { playing: boolean; failed: boolean; toggle: () => void; openInvitation: (withSound: boolean) => void };
const MusicContext = createContext<MusicControls | null>(null);

export function useWeddingMusic() {
  const controls = useContext(MusicContext);
  if (!controls) throw new Error("Wedding music requires a MusicProvider");
  return controls;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const mutedByGuest = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const track = audio.current;
    if (track) {
      setPlaying(!track.paused);
      setFailed(Boolean(track.error));
    }
  }, []);

  function reportError() {
    setPlaying(false);
    setFailed(true);
  }

  function setPlayback(enabled: boolean) {
    const track = audio.current;
    if (!track) return;

    track.autoplay = false;
    mutedByGuest.current = !enabled;
    if (!enabled) {
      track.pause();
      return;
    }

    setFailed(false);
    if (track.error) track.load();
    void track.play().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) reportError();
    });
  }

  return <MusicContext.Provider value={{
    playing, failed,
    toggle: () => setPlayback(audio.current?.paused ?? true),
    openInvitation: withSound => setPlayback(withSound && !mutedByGuest.current),
  }}>
    <audio
      ref={audio}
      src="/atlasaudio-piano-classical-631938.mp3"
      autoPlay
      hidden
      loop
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onError={reportError}
    />
    {children}
  </MusicContext.Provider>;
}

export function MusicToggle() {
  const { playing, failed, toggle } = useWeddingMusic();
  return <div className="music-control">
    <button
      className="music-button"
      type="button"
      aria-label="আমন্ত্রণের সংগীত"
      aria-pressed={playing}
      onClick={toggle}
    >
      {playing ? <Pause size={18} aria-hidden="true" /> : <Music2 size={18} aria-hidden="true" />}
    </button>
    {!failed && <span className="music-tooltip" aria-hidden="true">
      {playing ? "সংগীত থামান" : "সংগীত চালু করুন"}
    </span>}
    <span className="music-status" role="status">
      {failed ? "সংগীত চালু করা যায়নি। আবার চেষ্টা করুন।" : ""}
    </span>
  </div>;
}
