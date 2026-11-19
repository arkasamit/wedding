import Image from "next/image";
import { MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { Ambience } from "./ambience";
import { Alpana, BananaPlant, EventArt, FloralSprig, Lotus, Toran, WeddingGate } from "./art";
import { Cinema } from "./cinema";
import { Countdown } from "./countdown";
import { WeddingEntrance } from "./entrance";
import { CopyAddress, Portraits } from "./interactions";
import { MusicProvider, MusicToggle } from "./music";
import { EventTimepiece } from "./event-timepiece";
import { bnNumber, ceremony, eventDate, month, timepieceReadings, wedding, weddingDates } from "./wedding";

const marigoldPetals = [
  [3, 52, 0], [97, -52, 80], [11, 33, 220], [89, -31, 340],
  [22, 48, 120], [78, -34, 230], [6, 24, 420], [94, -18, 520],
  [34, -26, 300], [66, 27, 460], [17, -26, 590], [83, 26, 660],
];
const turmericLights = [
  [4, 18], [95, 23], [11, 43], [89, 54], [27, 87], [70, 84],
  [20, 10], [75, 9], [43, 66], [58, 34], [32, 21], [83, 81],
];
const finalePetals = [3, 95, 9, 89, 16, 82, 24, 74, 34, 64, 44, 54];

export default function Home() {
  const cover = wedding.photos.cover;
  const theme = Object.fromEntries(Object.entries(wedding.theme).map(([name, value]) => [`--${name}`, value]));

  return <MusicProvider><WeddingEntrance title={wedding.title} style={theme as CSSProperties}>
    <a className="skip-link" href="#invitation">মূল আমন্ত্রণে যান</a>
    <header className="header" id="top">
      <nav className="nav wrap" aria-label="আমন্ত্রণপত্র">
        <a className="monogram" href="#top"><Lotus />{wedding.title}</a>
        <div className="nav-links flex items-center">
          <a href="#couple">বর-কনে</a>
          <a href="#schedule">অনুষ্ঠানসূচি</a>
          <a href="#venue">অনুষ্ঠানস্থল</a>
        </div>
        <MusicToggle />
      </nav>
    </header>
    <main>
      <section className="hero" aria-labelledby="hero-heading" data-ambient="">
        <WeddingGate />
        <Toran />
        <div className="intro-petals marigold-rain" aria-hidden="true">
          {marigoldPetals.map(([x, drift, delay]) => <i key={x} style={{
            "--petal-x": `${x}%`, "--petal-drift": `${drift}px`, "--petal-delay": `${delay}ms`,
          } as CSSProperties} />)}
        </div>
        <div className="hero-stage">
          <BananaPlant side="left" />
          <BananaPlant side="right" />
          <Alpana className="hero-alpana" />
          <div className="hero-intro">
            <p className="kicker ornament-label">শুভ পরিণয়</p>
            <h1 id="hero-heading" tabIndex={-1}>{wedding.title}</h1>
            <p className="hero-date">{weddingDates}</p>
          </div>
          {ceremony && <section className="hero-countdown" aria-labelledby="countdown-heading">
            <h2 id="countdown-heading">শুভলগ্নের কাউন্টডাউন</h2>
            <Countdown {...ceremony} />
          </section>}
          <div className="hero-photo" style={{ "--focal": cover.focal, "--mobile-focal": cover.mobileFocal } as CSSProperties}>
            <div className="hero-image-frame">
              <Image src={cover.src} alt={cover.alt} sizes="(max-width: 800px) 94vw, 770px" preload placeholder="blur" />
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <ul className="hero-events">
            {wedding.events.map((event) => <li key={event.day}>{bnNumber.format(event.day)} {month} — {event.title}</li>)}
          </ul>
          <a className="action" href="#invitation">আমন্ত্রণ দেখুন</a>
        </div>
      </section>

      <section className="invitation section-space" id="invitation" aria-labelledby="invitation-heading" data-scene="">
        <FloralSprig className="sprig sprig-left" />
        <FloralSprig className="sprig sprig-right" />
        <div className="invitation-panel wrap">
          <Lotus className="section-lotus" />
          <h2 id="invitation-heading">সস্নেহ আমন্ত্রণ</h2>
          <p>{wedding.invitation}</p>
        </div>
      </section>

      <section className="couple section-space" id="couple" aria-labelledby="couple-heading" data-scene="">
        <Alpana className="couple-seal couple-seal-left" />
        <Alpana className="couple-seal couple-seal-right" />
        <div className="wrap">
          <div className="section-heading"><Lotus className="section-lotus" /><h2 id="couple-heading">বর ও কনের পরিচয়</h2></div>
          <Portraits people={wedding.people} />
        </div>
      </section>

      <section className="schedule" id="schedule" aria-labelledby="schedule-heading">
        <div className="section-heading schedule-heading"><Lotus className="section-lotus" /><h2 id="schedule-heading">অনুষ্ঠানসূচি</h2></div>
        {wedding.events.map((event, index) => {
          const kind = index === 0 ? "haldi" : "bibaho";
          return <article className={`event-panel ${kind}`} key={event.day} data-scene="" data-ambient="">
            <div className="act-light" aria-hidden="true" />
            {kind === "haldi" && <div className="turmeric-lights" aria-hidden="true">
              {turmericLights.map(([x, y], i) => <i key={x} style={{
                left: `${x}%`, top: `${y}%`, animationDelay: `-${i * 0.71}s`,
              }} />)}
            </div>}
            <FloralSprig className="sprig sprig-left" />
            <FloralSprig className="sprig sprig-right" />
            <div className="event-inner wrap">
              <EventTimepiece readings={timepieceReadings(event)} />
              <div className="event-copy">
                {kind === "haldi" ? <p className="act-label">প্রথম অঙ্ক</p> :
                  <div className="act-heading">
                    <p className="act-label">দ্বিতীয় অঙ্ক</p>
                    <div className="wedding-diya" data-ambient="" aria-hidden="true"><EventArt kind="lamp" /></div>
                  </div>}
                <p className="event-date">{eventDate(event)}</p>
                <h3>{event.title}</h3>
                <dl className="event-details">
                  {event.details.map(({ label, value }) => <div key={value}>
                    <dt className={label ? undefined : "sr-only"}>{label ?? "সময়"}</dt>
                    <dd>{value}</dd>
                  </div>)}
                </dl>
                {event.invitation && <p className="event-invitation">{event.invitation}</p>}
                {event.note && <p className="event-note">{event.note}</p>}
              </div>
            </div>
          </article>;
        })}
      </section>

      <section className="venue section-space" id="venue" aria-labelledby="venue-heading" data-scene="">
        <FloralSprig className="sprig sprig-right" />
        <div className="venue-inner wrap">
          <div className="nameplate">
            <Alpana className="venue-alpana ink-reveal" />
            <p className="kicker">অনুষ্ঠানস্থল</p>
            <h2 id="venue-heading">{wedding.venue.name}</h2>
          </div>
          <div className="venue-copy">
            <address id="venue-address">{wedding.venue.address}</address>
            <div className="venue-actions">
              <a className="action" href={wedding.venue.map} target="_blank" rel="noopener noreferrer"><MapPin size={17} aria-hidden="true" />পথনির্দেশ দেখুন</a>
              <CopyAddress address={wedding.venue.address} />
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer className="footer grand-finale" data-scene="" data-ambient="">
      <Alpana className="footer-seal scene-art" />
      <div className="finale-light" aria-hidden="true" />
      <div className="finale-petals marigold-rain" aria-hidden="true">
        {finalePetals.map((x, index) => <i key={x} style={{
          "--petal-x": `${x}%`, "--petal-delay": `${(index % 5) * 115}ms`,
          "--petal-drift": `${index % 2 ? -20 : 20}px`,
        } as CSSProperties} />)}
      </div>
      <div className="wrap closing-card">
        <Lotus className="closing-lotus" />
        <div className="lamp"><EventArt kind="lamp" /></div>
        <h2>সস্নেহ নিমন্ত্রণ</h2>
        <p>{wedding.blessing}</p>
        <p className="signature">{wedding.hosts}</p>
      </div>
      <section className="wrap reception-card" aria-labelledby="reception-heading">
        <div>
          <h2 id="reception-heading">অভ্যর্থনায়</h2>
          <p className="reception-names">{wedding.reception.greeters}</p>
        </div>
        <div className="reception-contact">
          <h3>প্রয়োজনে যোগাযোগ</h3>
          <ul className="reception-phones">
            {wedding.reception.phones.map(({ label, href }) => <li key={href}><a href={href}>{label}</a></li>)}
          </ul>
        </div>
      </section>
    </footer>
    <Cinema intensity={wedding.motion} />
    <Ambience />
  </WeddingEntrance></MusicProvider>;
}
