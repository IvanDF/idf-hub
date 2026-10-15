import { PROJECTS } from "@/data/projects";
import { YGG_COMPANION_FACTS, YGG_LAWS } from "@/data/yggdrasil";
import Image from "next/image";
import Link from "next/link";
import DayTimeline from "./DayTimeline";
import Decisions from "./Decisions";
import Forge from "./Forge";
import RealmTree from "./RealmTree";
import TmuxBar from "./TmuxBar";
import styles from "./YggdrasilPage.module.scss";

/**
 * Yggdrasil, the home server as its own world. Deliberately unlike the rest
 * of the site: a tmux session rather than a page, in the palette the whole
 * setup shares.
 */
export default function YggdrasilPage() {
  // Read from the project record rather than a second copy here. This is a
  // server component, so the array is resolved at build time and none of it
  // reaches the browser.
  const decisions = PROJECTS.find((p) => p.id === "yggdrasil")?.decisions ?? [];

  return (
    <div className={styles.page}>

      <main className={styles.pane}>
        <section className={styles.hero} aria-labelledby="ygg-title">
          <p className={styles.prompt}>
            <span className={styles.promptUser}>ivan@yggdrasil</span>
            <span className={styles.promptPath}>~</span>
            <span aria-hidden="true">$</span> cat README
          </p>
          <h1 id="ygg-title" className={styles.title}>
            <span className={styles.titleRune} aria-hidden="true">
              ᛉ
            </span>
            Yggdrasil
          </h1>
          <p className={styles.lede}>A home server designed around one person&apos;s day.</p>
          <p className={styles.intro}>
            One laptop from 2017. No port open to the internet. Every service named after a being
            from Norse myth, every change written down. It runs the house, keeps my notes and my
            passwords, holds what I watch and what I read, sends the day&apos;s training and
            speaks to me every morning, on hardware I own.
          </p>
          <figure className={styles.cover}>
            <Image
              src="/projects/yggdrasil/cover.png"
              alt="The home server drawn as a pixel-art world tree: Ratatoskr the squirrel at its roots, the nine realms as landmarks around it, a river carrying a longship when the torrent client is running."
              width={600}
              height={344}
              className={styles.coverImage}
              priority
            />
            <figcaption className={styles.coverCaption}>
              One saved frame of the companion. It runs live, in the real terminal —{" "}
              <a href="#ygg-companion" className={styles.coverLink}>
                what it draws
              </a>
              .
            </figcaption>
          </figure>
        </section>

        <section id="ygg-tree" data-reveal="" className={styles.section} aria-labelledby="ygg-tree-h">
          <h2 id="ygg-tree-h" className={styles.heading}>
            <span aria-hidden="true">#</span> the tree
          </h2>
          <p className={styles.sectionLede}>Choose a branch.</p>
          <RealmTree />
        </section>

        <section id="ygg-laws" data-reveal="" className={styles.section} aria-labelledby="ygg-laws-h">
          <h2 id="ygg-laws-h" className={styles.heading}>
            <span aria-hidden="true">#</span> the laws
          </h2>
          <ol className={styles.laws}>
            {YGG_LAWS.map((law, i) => (
              <li key={law.title} className={styles.law}>
                <span className={styles.lawIndex}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.lawTitle}>{law.title}</h3>
                <p className={styles.lawBody}>{law.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="ygg-decisions" data-reveal="" className={styles.section} aria-labelledby="ygg-decisions-h">
          <h2 id="ygg-decisions-h" className={styles.heading}>
            <span aria-hidden="true">#</span> the decisions
          </h2>
          <p className={styles.sectionLede}>
            Every one could have gone the other way. Here is the reasoning, and
            the bill.
          </p>
          <Decisions decisions={decisions} />
        </section>

        <section id="ygg-day" data-reveal="" className={styles.section} aria-labelledby="ygg-day-h">
          <h2 id="ygg-day-h" className={styles.heading}>
            <span aria-hidden="true">#</span> a day in the tree
          </h2>
          <DayTimeline />
        </section>

        <section id="ygg-companion" data-reveal="" className={styles.section} aria-labelledby="ygg-companion-h">
          <h2 id="ygg-companion-h" className={styles.heading}>
            <span aria-hidden="true">#</span> the companion
          </h2>
          <p className={styles.sectionLede}>
            Not a feature of this page. Type <code className={styles.inlineCode}>yggdrasil</code> in
            the real terminal and the system draws itself, redrawn every few seconds from whatever
            is actually happening. The image above is one frame of it, saved.
          </p>
          <ol className={styles.laws}>
            {YGG_COMPANION_FACTS.map((fact, i) => (
              <li key={fact.title} className={styles.law}>
                <span className={styles.lawIndex}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.lawTitle}>{fact.title}</h3>
                <p className={styles.lawBody}>{fact.body}</p>
              </li>
            ))}
          </ol>
          <p className={styles.sectionLede}>
            Four drawing modes trade resolution for what the terminal font can actually render:
            block, solid, braille and sextant. It needs a truecolor terminal — iTerm2, Ghostty,
            kitty, WezTerm — not the stock macOS Terminal app.
          </p>
        </section>

        <section id="ygg-forge" data-reveal="" className={styles.section} aria-labelledby="ygg-forge-h">
          <h2 id="ygg-forge-h" className={styles.heading}>
            <span aria-hidden="true">#</span> the forge
          </h2>
          <p className={styles.sectionLede}>The themes this setup runs on. Take them.</p>
          <Forge />
        </section>

        <footer className={styles.footer}>
          <Link href="/lab" className={styles.footerLink}>
            ← back to the work
          </Link>
          <p className={styles.footerNote}>
            <span aria-hidden="true">ᚠ ᚢ ᚦ ᚨ ᚱ</span> built and tended by Ivan Del Fatti
          </p>
        </footer>
      </main>

      {/* At the foot, where tmux puts it. */}
      <TmuxBar />
    </div>
  );
}
