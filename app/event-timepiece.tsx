"use client";

import { useContext, useEffect, useRef, useState, type CSSProperties } from "react";
import { EntranceOpened } from "./entrance-state";
import type { TimepieceReading } from "./wedding";

const dialNumbers = [
  ["১২", 50, 21], ["৩", 79, 51], ["৬", 50, 80], ["৯", 21, 51],
] as const;

function angles(reading: TimepieceReading) {
  return { hour: (reading.hour % 12) * 30 + reading.minute / 2, minute: reading.minute * 6 };
}

function handPosition(angle: number, previous: number | undefined, forward: boolean, fullSweep = false) {
  const from = previous ?? 0;
  let end = angle;
  if (previous === undefined && fullSweep) end += 360;
  if (previous !== undefined) {
    if (forward && end < from) end += 360;
    if (!forward && end > from) end -= 360;
  }
  return {
    "--hand-angle": `${angle}deg`,
    "--hand-from": `${from}deg`,
    "--hand-end": `${end}deg`,
  } as CSSProperties;
}

export function EventTimepiece({ readings }: { readings: readonly TimepieceReading[] }) {
  const opened = useContext(EntranceOpened);
  const element = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [selection, setSelection] = useState({ index: 0, previous: null as number | null });
  const reading = readings[selection.index];
  const current = angles(reading);
  const previous = selection.previous === null ? undefined : angles(readings[selection.previous]);
  const forward = selection.previous === null || selection.index > selection.previous;

  useEffect(() => {
    const node = element.current;
    if (!opened || !node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.26) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.26, rootMargin: "0px 0px -3% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [opened]);

  return <div className="event-timepiece" data-animate={entered} ref={element}>
    <div className="timepiece-display">
      <div className="event-calendar">
        <div className="event-calendar-month">{reading.monthLabel}</div>
        <div className="calendar-leaf" key={selection.index}>
          <time dateTime={reading.iso} className="calendar-date">
            <span className="calendar-day">{reading.day}</span>
            <span className="calendar-weekday">{reading.weekday}</span>
          </time>
          {reading.week.length > 0 && <div className="calendar-week" aria-hidden="true">
            {reading.week.map(({ day, selected }) => <span key={day} data-selected={selected}>{day}</span>)}
          </div>}
        </div>
      </div>
      <div className="event-watch">
        <svg className="watch-face" viewBox="0 0 100 100" focusable="false" aria-hidden="true">
          <circle className="watch-rim" cx="50" cy="50" r="47" />
          <circle className="watch-dial" cx="50" cy="50" r="42" />
          <circle className="watch-lines" cx="50" cy="50" r="38" />
          {Array.from({ length: 12 }, (_, i) => <path
            className="watch-tick" key={i} d={i % 3 === 0 ? "M50 10v4" : "M50 10v2.5"}
            transform={`rotate(${i * 30} 50 50)`}
          />)}
          {dialNumbers.map(([value, x, y]) => <text className="watch-number" key={value} x={x} y={y}>{value}</text>)}
          <g key={selection.index}>
            <path
              className="watch-hand watch-hour" d="M50 54V29"
              style={handPosition(current.hour, previous?.hour, forward)}
            />
            <path
              className="watch-hand watch-minute" d="M50 55V22"
              style={handPosition(current.minute, previous?.minute, forward, true)}
            />
          </g>
          <circle className="watch-pin" cx="50" cy="50" r="3" />
        </svg>
        <time className="watch-caption" dateTime={reading.iso}>{reading.time}</time>
      </div>
    </div>
    {readings.length > 1 && <>
      <div className="moment-controls" role="group" aria-label="বিবাহের লগ্নের সময়">
        {readings.map(({ label }, index) => <button
          key={label}
          type="button"
          aria-pressed={selection.index === index}
          onClick={() => setSelection((last) => last.index === index ? last : { index, previous: last.index })}
        >{label}</button>)}
      </div>
      <span className="sr-only" role="status">{reading.label}, {reading.day} {reading.monthLabel}, {reading.time}</span>
    </>}
  </div>;
}
