// src/generator.ts
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import { PortfolioData } from "./prompt";
import { getTheme } from "./themes";

export async function generatePortfolio(
  data: PortfolioData,
  projectPath: string
) {
  const spinner = ora("Generating your portfolio...").start();
  const theme = getTheme(data.theme, data.accentColor);

  try {
    // Write globals.css
    await fs.writeFile(
      path.join(projectPath, "app", "globals.css"),
      generateCSS(theme)
    );

    // Write layout.tsx
    await fs.writeFile(
      path.join(projectPath, "app", "layout.tsx"),
      generateLayout(data, theme)
    );

    // Write page.tsx
    await fs.writeFile(
      path.join(projectPath, "app", "page.tsx"),
      generatePage(data, theme)
    );

    spinner.succeed("Portfolio generated!");
  } catch (err) {
    spinner.fail("Failed to generate portfolio.");
    throw err;
  }
}

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

* { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: '${theme.fonts.body}', sans-serif;
  font-weight: 300;
  line-height: 1.7;
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: '${theme.fonts.display}', sans-serif;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

.glass-card {
  background: var(--glass-bg, var(--bg-card));
  border: 1px solid var(--glass-border, var(--border));
  backdrop-filter: blur(var(--glass-blur, 0px));
  border-radius: var(--radius);
}

.accent { color: var(--accent); }

.glow {
  box-shadow: 0 0 30px var(--accent-glow);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.animate-fade-up {
  animation: fadeUp 0.7s ease forwards;
}

.animate-fade-in {
  animation: fadeIn 1s ease forwards;
}
`.trim();
}

function generateLayout(
  data: PortfolioData,
  theme: ReturnType<typeof getTheme>
): string {
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
function generatePage(
  data: PortfolioData,
  theme: ReturnType<typeof getTheme>
): string {
  const isGlass = theme.name === "glass";

  return `
"use client";
import { useState, useEffect } from "react";

const data = ${JSON.stringify(data, null, 2)} as const;

const navLinks = ["About", "Experience", "Projects", "Skills", "Contact"];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 2rem",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? (${isGlass} ? "rgba(15,25,35,0.8)" : "rgba(10,10,10,0.9)") : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "all 0.3s ease",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--accent)" }}>
          {data.name.split(" ")[0]}<span style={{ color: "var(--text-muted)" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: "2rem" }}>
          {navLinks.map(link => (
            <a key={link} href={"#" + link.toLowerCase()}
              style={{ fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--text-secondary)",
                textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >{link}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="about" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "0 10vw", paddingTop: "64px", position: "relative", overflow: "hidden",
      }}>
        {/* bg glow */}
        <div style={{
          position: "absolute", top: "20%", left: "5%", width: "400px", height: "400px",
          background: "var(--accent-glow)", borderRadius: "50%", filter: "blur(80px)", opacity: 0.4,
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "700px", animation: "fadeUp 0.8s ease forwards" }}>
          <p style={{ color: "var(--accent)", fontSize: "0.9rem", letterSpacing: "0.15em",
            textTransform: "uppercase", marginBottom: "1rem" }}>
            Available for work
          </p>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 800,
            lineHeight: 1.05, marginBottom: "1.2rem" }}>
            Hi, I'm<br />
            <span style={{ color: "var(--accent)" }}>{data.name}</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            {data.title}
          </p>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: "520px",
            lineHeight: 1.8, marginBottom: "2.5rem" }}>
            {data.bio}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href={"#projects"} style={{
              padding: "0.75rem 2rem", background: "var(--accent)", color: "#000",
              borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.9rem",
              textDecoration: "none", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >View Projects</a>
            <a href={"#contact"} style={{
              padding: "0.75rem 2rem", border: "1px solid var(--border)", color: "var(--text-primary)",
              borderRadius: "var(--radius)", fontWeight: 400, fontSize: "0.9rem",
              textDecoration: "none", transition: "border-color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >Contact Me</a>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: "8rem 10vw" }}>
        <SectionHeading title="Experience" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "3rem" }}>
          {data.experience.map((exp, i) => (
            <div key={i} className="glass-card" style={{ padding: "2rem", position: "relative",
              borderLeft: "2px solid var(--accent)" }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{exp.role}</h3>
                  <p style={{ color: "var(--accent)", fontSize: "0.9rem" }}>{exp.company}</p>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {exp.startDate} — {exp.endDate}
                </span>
              </div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginTop: "0.75rem" }}>
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "8rem 10vw", background: "var(--bg-secondary)" }}>
        <SectionHeading title="Projects" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem", marginTop: "3rem" }}>
          {data.projects.map((proj, i) => (
            <div key={i} className="glass-card" style={{ padding: "2rem",
              transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px var(--accent-glow)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>{proj.name}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem",
                lineHeight: 1.7, marginBottom: "1.25rem" }}>{proj.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {proj.techStack.map((tech, j) => (
                  <span key={j} style={{ padding: "0.25rem 0.75rem",
                    background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                    borderRadius: "99px", fontSize: "0.75rem", color: "var(--accent)" }}>
                    {tech}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}>
                    Live ↗
                  </a>
                )}
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textDecoration: "none" }}>
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "8rem 10vw" }}>
        <SectionHeading title="Skills" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "3rem" }}>
          {data.skills.map((skill, i) => (
            <span key={i} className="glass-card" style={{
              padding: "0.6rem 1.4rem", fontSize: "0.95rem",
              color: "var(--text-primary)", transition: "border-color 0.2s, color 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLSpanElement).style.color = "var(--accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLSpanElement).style.borderColor = "var(--glass-border, var(--border))";
                (e.currentTarget as HTMLSpanElement).style.color = "var(--text-primary)";
              }}
            >{skill}</span>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{
        padding: "8rem 10vw", background: "var(--bg-secondary)", textAlign: "center" }}>
        <SectionHeading title="Contact" centered />
        <p style={{ color: "var(--text-secondary)", maxWidth: "480px",
          margin: "1.5rem auto 3rem", lineHeight: 1.8 }}>
          Have a project in mind or just want to chat? My inbox is always open.
        </p>
        <a href={"mailto:" + data.email} style={{
          display: "inline-block", padding: "1rem 3rem",
          background: "var(--accent)", color: "#000",
          borderRadius: "var(--radius)", fontWeight: 600, fontSize: "1rem",
          textDecoration: "none", transition: "opacity 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >Say Hello →</a>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "3rem" }}>
          {data.github && (
            <a href={data.github} target="_blank" rel="noreferrer"
              style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem",
                transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >GitHub</a>
          )}
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noreferrer"
              style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem",
                transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >LinkedIn</a>
          )}
          {data.twitter && (
            <a href={data.twitter} target="_blank" rel="noreferrer"
              style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem",
                transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >Twitter</a>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "2rem", textAlign: "center",
        borderTop: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
        Built with create-next-portfolio-builder
      </footer>

    </main>
  );
}

function SectionHeading({ title, centered }: { title: string; centered?: boolean }) {
  return (
    <div style={{ textAlign: centered ? "center" : "left" }}>
      <p style={{ color: "var(--accent)", fontSize: "0.8rem",
        letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
        {String(navLinks.indexOf(title) + 1).padStart(2, "0")}
      </p>
      <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800 }}>{title}</h2>
      <div style={{ width: "40px", height: "2px", background: "var(--accent)",
        marginTop: "1rem", marginLeft: centered ? "auto" : 0,
        marginRight: centered ? "auto" : 0 }} />
    </div>
  );
}

const navLinks = ["About", "Experience", "Projects", "Skills", "Contact"];
`.trim();
}