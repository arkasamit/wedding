import cover from "../image/original_photo_wedding_cover.jpg";
import groom from "../image/Elegant Purple Sherwani Portrait (1).png";
import bride from "../image/95b08789-1a5c-4aff-951d-c477199b00fd.png";
import type { StaticImageData } from "next/image";

export type Photo = { src: StaticImageData; alt: string; focal: string; mobileFocal: string };
type Name = { bn: string; en: string };
export type Person = { role: string; name: Name; father: Name; mother: Name; photo: Photo };
type Moment = { label: string; day: number; hour: number; minute: number };
export type TimepieceReading = {
  label: string;
  day: string;
  weekday: string;
  monthLabel: string;
  week: readonly { day: string; selected: boolean }[];
  time: string;
  iso?: string;
  hour: number;
  minute: number;
};
type Event = {
  title: string;
  day: number;
  weekday: string;
  moments: readonly [Moment, ...Moment[]];
  details: { label?: string; value: string }[];
  note?: string;
  invitation?: string;
};

type Wedding = {
  title: string;
  invitation: string;
  blessing: string;
  hosts: string;
  reception: { greeters: string; phones: readonly { label: string; href: string }[] };
  year: number | null;
  month: number;
  timeZone: "Asia/Dhaka";
  photos: { cover: Photo };
  people: readonly [Person, Person];
  events: readonly [Event, Event];
  venue: { name: string; address: string; map: string };
  theme: Record<string, string>;
  motion: number;
};

export const bnNumber = new Intl.NumberFormat("bn-BD", { useGrouping: false });
const minuteNumber = new Intl.NumberFormat("bn-BD", { minimumIntegerDigits: 2, useGrouping: false });
const haldi = { label: "গায়ে হলুদ", day: 12, hour: 19, minute: 1 };
const lagnaStart = { label: "লগ্ন শুরু", day: 13, hour: 17, minute: 18 };
const lagnaEnd = { label: "লগ্ন শেষ", day: 14, hour: 0, minute: 29 };

function momentTime({ hour, minute }: Moment) {
  const period = hour < 5 || hour >= 20 ? "রাত" : hour >= 18 ? "সন্ধ্যা"
    : hour >= 16 ? "বিকেল" : hour >= 12 ? "দুপুর" : "সকাল";
  return `${period} ${bnNumber.format(hour % 12 || 12)}:${minuteNumber.format(minute)}`;
}

export const wedding: Wedding = {
  title: "অর্ক ও শরণ",
  invitation: "দুই হৃদয়ের মিলনে, দুই পরিবারের আনন্দে—আমাদের শুভ পরিণয়ে আপনাদের সস্নেহ উপস্থিতি ও আশীর্বাদ একান্ত কাম্য।",
  blessing: "আপনাদের উপস্থিতি ও আশীর্বাদে আমাদের এই শুভক্ষণ আরও আনন্দময় হয়ে উঠুক।",
  hosts: "বিষ্ণুপদ মজুমদার ও চিত্রা মজুমদার",
  reception: {
    greeters: "চর্যা, শুদ্ধ ও অর্জন",
    phones: [
      { label: "01916-313022", href: "tel:+8801916313022" },
      { label: "01828049230", href: "tel:+8801828049230" },
    ],
  },
  year: 2026,
  month: 12,
  timeZone: "Asia/Dhaka",
  photos: {
    cover: { src: cover, alt: "বিয়ের অলংকরণে ঘেরা অর্ক ও শরণের তিনটি যুগল ছবি", focal: "50% 50%", mobileFocal: "50% 50%" },
  },
  people: [
    {
      role: "বর",
      name: { bn: "অর্ক সরকার অমিত", en: "Arka Sarker Amit" },
      father: { bn: "দুলাল চন্দ্র সরকার", en: "Dulal Chandra Sarker" },
      mother: { bn: "শেফালি রাণী কর্মকার", en: "Shefali Rani Karmaker" },
      photo: { src: groom, alt: "অর্ক সরকারের প্রতিকৃতি", focal: "50% 25%", mobileFocal: "50% 22%" },
    },
    {
      role: "কনে",
      name: { bn: "শরণ মজুমদার পৃথা", en: "Sharan Majumdar Pritha" },
      father: { bn: "বিষ্ণুপদ মজুমদার", en: "Bishnu Pada Majumdar" },
      mother: { bn: "মিনতি মজুমদার চিত্রা", en: "Minoti Majumdar Chitra" },
      photo: { src: bride, alt: "শরণ মজুমদার পৃথার প্রতিকৃতি", focal: "50% 24%", mobileFocal: "50% 22%" },
    },
  ],
  events: [
    {
      title: "হলুদ সন্ধ্যা", day: haldi.day, weekday: "শনিবার", moments: [haldi],
      details: [{ value: `${momentTime(haldi)} মিনিট` }],
      invitation: "গায়ে হলুদের আনন্দে আপনাদের আমন্ত্রণ।",
    },
    {
      title: "শুভ বিবাহ", day: lagnaStart.day, weekday: "রবিবার", moments: [lagnaStart, lagnaEnd],
      details: [
        { label: "প্রীতিভোজ", value: "দুপুর ১টা ৩০ মিনিট" },
        { label: "বরযাত্রার আগমন", value: "সন্ধ্যা ৭টা" },
        { label: "বিবাহের লগ্ন", value: `${momentTime(lagnaStart)} মিনিট থেকে মধ্যরাত পেরিয়ে ${momentTime(lagnaEnd)} মিনিট পর্যন্ত।` },
      ],
      note: `লগ্ন শুরু ${bnNumber.format(lagnaStart.day)} ডিসেম্বর ${momentTime(lagnaStart)} মিনিটে এবং শেষ ${bnNumber.format(lagnaEnd.day)} ডিসেম্বর ${momentTime(lagnaEnd)} মিনিটে।`,
    },
  ],
  venue: {
    name: "তনয়া",
    address: "তনয়া, ফিশারি পুকুর, হাট নওগাঁ, দক্ষিণ কালীতলা, নওগাঁ সদর, রাজশাহী।",
    map: "https://maps.app.goo.gl/kM41G7792Kx1oc348",
  },
  theme: { wine: "#450D17", crimson: "#790F22", gold: "#C5A059", paper: "#F4E8D2", ink: "#15110F" },
  motion: 1,
};

export const month = new Intl.DateTimeFormat("bn-BD", { month: "long", timeZone: wedding.timeZone })
  .format(new Date(Date.UTC(2000, wedding.month - 1, 1)));
const dayFormatter = new Intl.DateTimeFormat("bn-BD", { weekday: "long", timeZone: wedding.timeZone });

export function eventDate(event: Event) {
  const weekday = wedding.year === null ? event.weekday
    : dayFormatter.format(new Date(Date.UTC(wedding.year, wedding.month - 1, event.day)));
  return `${bnNumber.format(event.day)} ${month}, ${weekday}`;
}

function dhakaTimestamp(year: number, moment: Moment) {
  return Date.UTC(year, wedding.month - 1, moment.day, moment.hour - 6, moment.minute);
}

export function timepieceReadings(event: Event): TimepieceReading[] {
  const { year } = wedding;
  return event.moments.map((moment) => {
    const date = year === null ? null : new Date(Date.UTC(year, wedding.month - 1, moment.day));
    const weekOffset = date === null ? 0 : (date.getUTCDay() + 1) % 7;
    return {
      label: moment.label,
      day: bnNumber.format(moment.day),
      weekday: date ? dayFormatter.format(date) : event.weekday,
      monthLabel: year === null ? month : `${month} ${bnNumber.format(year)}`,
      week: year === null ? [] : Array.from({ length: 7 }, (_, i) => {
        const day = new Date(Date.UTC(year, wedding.month - 1, moment.day - weekOffset + i)).getUTCDate();
        return { day: bnNumber.format(day), selected: i === weekOffset };
      }),
      time: momentTime(moment),
      iso: year === null ? undefined : new Date(dhakaTimestamp(year, moment)).toISOString(),
      hour: moment.hour,
      minute: moment.minute,
    };
  });
}

const [first, last] = wedding.events;
const dateRange = `${bnNumber.format(first.day)}–${bnNumber.format(last.day)} ${month}`;
export const weddingDates = wedding.year === null ? dateRange : `${dateRange}, ${bnNumber.format(wedding.year)}`;

export const ceremony = wedding.year === null ? null : {
  start: dhakaTimestamp(wedding.year, lagnaStart),
  end: dhakaTimestamp(wedding.year, lagnaEnd),
  label: `${bnNumber.format(lagnaStart.day)} ${month} ${bnNumber.format(wedding.year)} · ${momentTime(lagnaStart)} মিনিট · বাংলাদেশ সময়`,
};
