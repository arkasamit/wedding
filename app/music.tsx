"use client";

import { Music2, Pause } from "lucide-react";
import { useRef, useState } from "react";

export function MusicToggle() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  function reportError() {
    setPlaying(false);
    setFailed(true);
  }

  async function toggle() {
    const track = audio.current;
    if (!track) return;

    if (!track.paused) {
      track.pause();
      return;
    }

    setFailed(false);
    if (track.error) track.load();
    try {
      await track.play();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) reportError();
    }
  }

  return <div className="music-control">
    <audio
      ref={audio}
      src="/invitation-melody.mp3"
      preload="none"
      loop
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onError={reportError}
    />
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
