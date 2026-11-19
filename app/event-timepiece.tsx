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

function nextHandAngle(current: number, target: number, forward: boolean) {
  const clockwise = ((target - current) % 360 + 360) % 360;
  return current + (forward || clockwise === 0 ? clockwise : clockwise - 360);
}

export function EventTimepiece({ readings }: { readings: readonly TimepieceReading[] }) {
  const opened = useContext(EntranceOpened);
  const element = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [selection, setSelection] = useState(() => ({ index: 0, ...angles(readings[0]) }));
  const reading = readings[selection.index];

  function select(index: number) {
    const target = angles(readings[index]);
    setEntered(true);
    setSelection(last => ({
      index,
      hour: nextHandAngle(last.hour, target.hour, index > last.index),
      minute: nextHandAngle(last.minute, target.minute, index > last.index),
    }));
  }

  useEffect(() => {
    const node = element.current;
    if (!opened || !node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.26) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.26, rootMargin: "0px 0px -12px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [opened]);

  return <div className="event-timepiece" data-ambient="" data-ready={opened} data-animate={entered} ref={element}>
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
          <g>
            <path
              className="watch-hand watch-hour" d="M50 54V29"
              style={{ "--hand-angle": `${selection.hour}deg` } as CSSProperties}
            />
            <path
              className="watch-hand watch-minute" d="M50 55V22"
              style={{ "--hand-angle": `${selection.minute}deg` } as CSSProperties}
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
          onClick={() => select(index)}
        >{label}</button>)}
      </div>
      <span className="sr-only" role="status">{reading.label}, {reading.day} {reading.monthLabel}, {reading.time}</span>
    </>}
  </div>;
}
