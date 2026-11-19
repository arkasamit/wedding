"use client";

import { useEffect, useState } from "react";

const digits = new Intl.NumberFormat("bn-BD", { minimumIntegerDigits: 2, useGrouping: false });
const units = [
  ["দিন", 86400, null], ["ঘণ্টা", 3600, 24], ["মিনিট", 60, 60], ["সেকেন্ড", 1, 60],
] as const;

export function Countdown({ start, end, label }: { start: number; end: number; label: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = setInterval(() => {
      update();
      if (Date.now() >= end) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [end]);

  const seconds = now === null ? null : Math.max(0, Math.ceil((start - now) / 1000));
  return <>
    <p className="countdown-date"><time dateTime={new Date(start).toISOString()}>{label}</time></p>
    {seconds === 0 ? <p className="countdown-finished">
      {now !== null && now < end ? "শুভলগ্ন শুরু হয়েছে।" : "শুভলগ্নের সময় পেরিয়েছে।"}
    </p> : <dl className="countdown-time" aria-label="শুভলগ্ন শুরু হতে বাকি">
      {units.map(([unit, divisor, modulo]) => {
        const value = seconds === null ? null : Math.floor(seconds / divisor);
        return <div key={unit}>
          <dt>{unit}</dt>
          <dd>{value === null ? "—" : digits.format(modulo === null ? value : value % modulo)}</dd>
        </div>;
      })}
    </dl>}
  </>;
}
