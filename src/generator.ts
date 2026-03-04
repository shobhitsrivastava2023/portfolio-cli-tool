// src/generator.ts
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import { PortfolioData } from "./prompt";
import { getTheme } from "./themes";

export async function generatePortfolio(data: PortfolioData, projectPath: string) {
  const spinner = ora("Generating your portfolio...").start();
  const theme = getTheme(data.theme);

  try {
    const componentsDir = path.join(projectPath, "app", "components");
    await fs.ensureDir(componentsDir);

    await fs.writeFile(path.join(projectPath, "app", "globals.css"), generateCSS(theme));
    await fs.writeFile(path.join(projectPath, "app", "layout.tsx"), generateLayout(data));
    await fs.writeFile(path.join(projectPath, "app", "page.tsx"), generatePage(data));
    await fs.writeFile(path.join(componentsDir, "Nav.tsx"), generateNav(data));
    await fs.writeFile(path.join(componentsDir, "Hero.tsx"), generateHero(data));
    await fs.writeFile(path.join(componentsDir, "Experience.tsx"), generateExperience(data));
    await fs.writeFile(path.join(componentsDir, "Projects.tsx"), generateProjects(data));
    await fs.writeFile(path.join(componentsDir, "Skills.tsx"), generateSkills(data));
    await fs.writeFile(path.join(componentsDir, "Contact.tsx"), generateContact(data));

    await copyPhoto(data, projectPath);

    spinner.succeed("Portfolio generated!");
  } catch (err) {
    spinner.fail("Failed to generate portfolio.");
    throw err;
  }
}

async function copyPhoto(data: PortfolioData, projectPath: string) {
  if (!data.photoPath) return;
  try {
    const ext = path.extname(data.photoPath) || ".jpg";
    await fs.copy(data.photoPath, path.join(projectPath, "public", `photo${ext}`));
  } catch {
    console.warn("\n⚠ Could not copy photo, skipping.");
  }
}

// ─── CSS ────────────────────────────────────────────────────────────────────

function generateCSS(theme: ReturnType<typeof getTheme>): string {
  const vars = Object.entries(theme.cssVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");

  return `
@import url('${theme.fonts.googleFontsUrl}');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
${vars}
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-weight: 300;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display);
  line-height: 1.1;
}

a { color: inherit; text-decoration: none; }

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.label {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-up {
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
}

.fade-up-1 { animation-delay: 0.1s; }
.fade-up-2 { animation-delay: 0.2s; }
.fade-up-3 { animation-delay: 0.3s; }
.fade-up-4 { animation-delay: 0.4s; }
`.trim();
}

// ─── LAYOUT ─────────────────────────────────────────────────────────────────

function generateLayout(data: PortfolioData): string {
  return `

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${data.name} — ${data.title}",
  description: "${data.bio}",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`.trim();
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

function generatePage(data: PortfolioData): string {
  return `
  "use client";
import Nav        from "./components/Nav";
import Hero       from "./components/Hero";
import Experience from "./components/Experience";
import Projects   from "./components/Projects";
import Skills     from "./components/Skills";
import Contact    from "./components/Contact";

export default function Portfolio() {
  return (
    <>
      <Nav name="${data.name}" />
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem" }}>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer style={{
        textAlign: "center",
        padding: "3rem 1.5rem",
        borderTop: "1px solid var(--border)",
        color: "var(--text-muted)",
        fontSize: "0.78rem",
        marginTop: "4rem",
      }}>
        {new Date().getFullYear()} · Built with create-next-portfolio-builder
      </footer>
    </>
  );
}
`.trim();
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function generateNav(data: PortfolioData): string {
  return `
"use client";
import { useEffect, useState } from "react";

export default function Nav({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem", height: "56px",
      background: scrolled ? "var(--bg)" : "transparent",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.25s ease",
    }}>

      {/* left — name + status */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>${data.name}</span>
        <span style={{
          display: "flex", alignItems: "center", gap: "0.3rem",
          fontSize: "0.72rem", color: "var(--text-muted)",
          border: "1px solid var(--border)", borderRadius: "99px",
          padding: "0.2rem 0.6rem",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%",
            background: "#4ade80", display: "inline-block" }} />
          Available
        </span>
      </div>

      {/* right — nav links */}
      <div style={{ display: "flex", gap: "1.75rem" }}>
        {["Experience", "Projects", "Skills", "Contact"].map(link => (
          <a key={link} href={"#" + link.toLowerCase()}
            style={{ fontSize: "0.82rem", color: "var(--text-secondary)",
              transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >{link}</a>
        ))}
      </div>
    </nav>
  );
}
`.trim();
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function generateHero(data: PortfolioData): string {
  return `
  "use client";
export default function Hero() {
  return (
    <section style={{ paddingTop: "120px", paddingBottom: "4rem" }}>

      {/* Top row — photo + name card side by side */}
      <div className="fade-up fade-up-1" style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr",
        gap: "0.75rem",
        alignItems: "stretch",
        marginBottom: "0.75rem",
      }}>

        {/* Profile photo */}
        <div className="card" style={{
          overflow: "hidden",
          aspectRatio: "1/1",
          width: "72px",
          height: "72px",
          flexShrink: 0,
        }}>
          <img
            src="/profile.jpg"
            alt="${data.name}"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* Name + handle */}
        <div className="card" style={{
          padding: "0 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.2 }}>${data.name}</h1>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>${data.title}</span>
          </div>
          <span style={{
            fontSize: "0.72rem", color: "var(--text-muted)",
            border: "1px solid var(--border)", borderRadius: "99px",
            padding: "0.2rem 0.65rem", whiteSpace: "nowrap",
          }}>
            @${data.name.toLowerCase().replace(/\s+/g, "")}
          </span>
        </div>
      </div>

      {/* Intro card */}
      <div className="card fade-up fade-up-2" style={{ padding: "1.5rem", marginBottom: "0.75rem" }}>
        <p className="label" style={{ marginBottom: "0.75rem" }}>Intro</p>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.25rem, 2.8vw, 1.6rem)",
          fontWeight: 600,
          lineHeight: 1.3,
          color: "var(--text-primary)",
        }}>
          ${data.bio}
        </p>
      </div>

      {/* Occupation card */}
      <div className="card fade-up fade-up-3" style={{
        padding: "1.25rem 1.5rem",
        marginBottom: "0.75rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <p className="label">Occupation</p>
        <span style={{
          fontSize: "0.82rem", color: "var(--text-secondary)",
          border: "1px solid var(--border)", borderRadius: "99px",
          padding: "0.3rem 0.9rem",
        }}>${data.title}</span>
      </div>

      {/* Socials row */}
      <div className="fade-up fade-up-4" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        ${data.email ? `<a href="mailto:${data.email}" className="card" style={{
          padding: "0.5rem 1rem", fontSize: "0.8rem", color: "var(--text-secondary)",
          transition: "color 0.15s", display: "inline-flex", alignItems: "center", gap: "0.4rem",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
        >✉ Email</a>` : ""}
        ${data.github ? `<a href="${data.github}" target="_blank" rel="noreferrer" className="card" style={{
          padding: "0.5rem 1rem", fontSize: "0.8rem", color: "var(--text-secondary)",
          transition: "color 0.15s", display: "inline-flex", alignItems: "center", gap: "0.4rem",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
        >↗ GitHub</a>` : ""}
        ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" rel="noreferrer" className="card" style={{
          padding: "0.5rem 1rem", fontSize: "0.8rem", color: "var(--text-secondary)",
          transition: "color 0.15s", display: "inline-flex", alignItems: "center", gap: "0.4rem",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
        >↗ LinkedIn</a>` : ""}
        ${data.twitter ? `<a href="${data.twitter}" target="_blank" rel="noreferrer" className="card" style={{
          padding: "0.5rem 1rem", fontSize: "0.8rem", color: "var(--text-secondary)",
          transition: "color 0.15s", display: "inline-flex", alignItems: "center", gap: "0.4rem",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
        >↗ Twitter</a>` : ""}
      </div>

    </section>
  );
}
`.trim();
}
// ─── EXPERIENCE ──────────────────────────────────────────────────────────────

function generateExperience(data: PortfolioData): string {
  return `
  "use client";
export default function Experience() {
  const items = ${JSON.stringify(data.experience, null, 2)};

  return (
    <section id="experience" style={{ paddingBottom: "4rem" }}>
      <p className="label" style={{ marginBottom: "1.25rem" }}>Experience</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((exp, i) => (
          <div key={i} className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem",
              marginBottom: "0.75rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.2rem" }}>
                  {exp.role}
                </h3>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  {exp.company}
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)",
                whiteSpace: "nowrap" }}>
                {exp.startDate} — {exp.endDate}
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
`.trim();
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

function generateProjects(data: PortfolioData): string {
  return `
  "use client";
export default function Projects() {
  const items = ${JSON.stringify(data.projects, null, 2)};

  return (
    <section id="projects" style={{ paddingBottom: "4rem" }}>
      <p className="label" style={{ marginBottom: "1.25rem" }}>Projects</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((proj, i) => (
          <div key={i} className="card" style={{ padding: "1.5rem",
            transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--text-muted)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: "0.6rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{proj.name}</h3>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "var(--text-muted)",
                      transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >Live ↗</a>
                )}
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "0.78rem", color: "var(--text-muted)",
                      transition: "color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >GitHub ↗</a>
                )}
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)",
              lineHeight: 1.75, marginBottom: "1rem" }}>{proj.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {proj.techStack.map((tech, j) => (
                <span key={j} style={{
                  fontSize: "0.72rem", padding: "0.2rem 0.65rem",
                  border: "1px solid var(--border)", borderRadius: "99px",
                  color: "var(--text-muted)",
                }}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`.trim();
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────

function generateSkills(data: PortfolioData): string {
  return `
  "use client";
export default function Skills() {
  const skills = ${JSON.stringify(data.skills)};

  return (
    <section id="skills" style={{ paddingBottom: "4rem" }}>
      <p className="label" style={{ marginBottom: "1.25rem" }}>Skills</p>
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {skills.map((skill, i) => (
            <span key={i} style={{
              fontSize: "0.82rem", padding: "0.35rem 0.9rem",
              border: "1px solid var(--border)", borderRadius: "99px",
              color: "var(--text-secondary)", transition: "all 0.15s", cursor: "default",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--text-primary)";
                (e.currentTarget as HTMLSpanElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLSpanElement).style.color = "var(--text-secondary)";
              }}
            >{skill}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
`.trim();
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function generateContact(data: PortfolioData): string {
  return `
  "use client";
export default function Contact() {
  return (
    <section id="contact" style={{ paddingBottom: "4rem" }}>
      <p className="label" style={{ marginBottom: "1.25rem" }}>Contact</p>
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 700,
          marginBottom: "0.75rem" }}>
          Let's work together.
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)",
          lineHeight: 1.75, marginBottom: "1.75rem", maxWidth: "420px" }}>
          Have a project in mind or just want to say hi?
          My inbox is always open.
        </p>
        <a href="mailto:${data.email}" style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.65rem 1.4rem",
          background: "var(--accent)", color: "var(--accent-fg)",
          borderRadius: "var(--radius)", fontSize: "0.85rem", fontWeight: 500,
          transition: "opacity 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          ${data.email} ✉
        </a>
      </div>
    </section>
  );
}
`.trim();
}