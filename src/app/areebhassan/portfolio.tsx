"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  FolderKanban,
  ExternalLink,
  Brain,
  Star,
  Quote,
  LayoutGrid,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface Project {
  _id: string;
  title: string;
  description: string;
  vercelLink: string;
}

interface Skill {
  _id: string;
  name: string;
}

interface Testimonial {
  _id: string;
  image: string;
  name?: string;
  message: string;
  createdAt?: string;
}

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactComment, setContactComment] = useState("");
  const [sendingContact, setSendingContact] = useState(false);
  const [profileSrc, setProfileSrc] = useState<string>("/hero-profile.jpg");
  const [typedIntro, setTypedIntro] = useState("");
  const [completedProjects, setCompletedProjects] = useState(0);
  const [activeSection, setActiveSection] = useState<
    "home" | "about" | "projects" | "contact" | "skills" | "testimonials"
  >("home");
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const hasCountedRef = useRef(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })],
  );

  const sectionMotion = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const [resProj, resSkills, resTestimonials] = await Promise.all([
          fetch(`${apiUrl}/api/projects`),
          fetch(`${apiUrl}/api/skills`),
          fetch(`${apiUrl}/api/testimonials`),
        ]);

        if (resProj.ok) {
          const data = await resProj.json();
          setProjects(data.projects || []);
        }

        if (resSkills.ok) {
          const data = await resSkills.json();
          setSkills(data.skills || []);
        }

        if (resTestimonials.ok) {
          const data = await resTestimonials.json();
          setTestimonials(data.testimonials || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedTestimonial(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    const introText =
      "Hi there, I'm Syed Muhammad Areeb Hassan — Full-stack developer.";
    let index = 0;
    const introTimer = window.setInterval(() => {
      setTypedIntro(introText.slice(0, index + 1));
      index += 1;
      if (index >= introText.length) {
        window.clearInterval(introTimer);
      }
    }, 45);

    return () => {
      window.clearInterval(introTimer);
    };
  }, []);

  const countObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (hasCountedRef.current) return;

    const aboutSection = document.getElementById("about");
    if (!aboutSection) return;

    let frameId: number;
    const target = 20;
    const duration = 1400;
    const startTimeRef = { current: 0 } as { current: number };

    const animateCount = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const progress = Math.min(1, (time - startTimeRef.current) / duration);
      const nextValue = Math.min(target, Math.floor(progress * target));
      setCompletedProjects(Math.max(1, nextValue));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateCount);
      }
    };

    countObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        hasCountedRef.current = true;
        setCompletedProjects(1);
        frameId = window.requestAnimationFrame(animateCount);
        countObserverRef.current?.disconnect();
      },
      { threshold: 0.05, rootMargin: "-100px 0px -100px 0px" },
    );

    countObserverRef.current.observe(aboutSection);

    return () => {
      countObserverRef.current?.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="min-h-screen bg-[#efe6dc] text-zinc-900 font-sans relative selection:bg-amber-300 selection:text-zinc-900 transition-all duration-700 ease-out">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-300/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/50 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-cyan-500 text-white shadow-lg shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] uppercase text-slate-800">
                Areeb Hassan
              </p>
              <p className="text-xs text-slate-500">Full-stack developer</p>
            </div>
          </div>

          <nav className="hidden items-center gap-3 text-sm md:flex">
            {[
              {
                id: "home",
                label: "Home",
                base: "bg-cyan-600 text-white",
                active: "shadow-lg shadow-cyan-500/20",
              },
              {
                id: "about",
                label: "About",
                base: "bg-amber-500 text-white",
                active: "shadow-lg shadow-amber-500/20",
              },
              {
                id: "projects",
                label: "Projects",
                base: "bg-violet-600 text-white",
                active: "shadow-lg shadow-violet-500/20",
              },
              {
                id: "skills",
                label: "Skills",
                base: "bg-emerald-600 text-white",
                active: "shadow-lg shadow-emerald-500/20",
              },
              {
                id: "testimonials",
                label: "Testimonials",
                base: "bg-fuchsia-600 text-white",
                active: "shadow-lg shadow-fuchsia-500/20",
              },
              {
                id: "contact",
                label: "Contact",
                base: "bg-orange-500 text-white",
                active: "shadow-lg shadow-orange-500/20",
              },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  const section = document.getElementById(item.id);
                  if (section) {
                    section.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                  setActiveSection(item.id as any);
                }}
                className={`inline-flex items-center rounded-full px-4 py-2 transition text-sm font-medium ${item.base} ${
                  activeSection === item.id
                    ? item.active
                    : "opacity-90 hover:opacity-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="https://github.com/AreebHasssan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-300 hover:text-cyan-600 hover:shadow-md"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/areeb-hassan-165039353"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-amber-300 hover:text-amber-600 hover:shadow-md"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        id="home"
        className="relative pt-28 pb-24 scroll-mt-28"
        {...sectionMotion}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.15),_transparent_18%)]" />
        <div className="max-w-7xl mx-auto px-6 animate-fade-in">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/10">
                <span className="font-mono text-amber-300">{typedIntro}</span>
                <span className="animate-pulse">|</span>
              </div>

              <h1 className="max-w-3xl text-lg font-extrabold tracking-tight text-slate-950 sm:text-lg lg:text-4xl">
                <motion.span
                  initial={{
                    opacity: 0,
                    y: 60,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.18,
                  }}
                  className="inline-block"
                >
                  Syed Muhammad Areeb Hassan
                </motion.span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Building modern products with React, Next.js, Node.js,
                MongoDB,Python Django and Tailwind CSS that feel fast, polished,
                and professional.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#projects"
                  onClick={() => setActiveSection("projects")}
                  className="inline-flex items-center gap-3 rounded-full bg-cyan-600 px-6 py-4 text-sm font-semibold text-white shadow-2xl shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-700"
                >
                  Explore My Work
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  onClick={() => setActiveSection("contact")}
                  className="inline-flex items-center gap-3 rounded-full bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Book a Call
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 [&_div]:transition-transform [&_div]:duration-300 [&_div]:ease-out [&_div]:hover:-translate-y-1 [&_div]:hover:shadow-xl">
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-900/5">
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-500">
                    Design Focus
                  </p>
                  <p className="mt-4 text-lg font-semibold text-slate-950">
                    Clean product UI
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-900/5">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-500">
                    Fast builds
                  </p>
                  <p className="mt-4 text-lg font-semibold text-slate-950">
                    Fast, scalable apps
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-900/5">
                  <p className="text-xs uppercase tracking-[0.28em] text-violet-500">
                    Reliable
                  </p>
                  <p className="mt-4 text-lg font-semibold text-slate-950">
                    Production-ready deployments
                  </p>
                </div>
              </div>
            </div>
            <div className="relative mx-auto lg:mx-0 lg:max-w-[920px] lg:pt-8 mt-0 md:-mt-11">
              {/* === ENHANCED BACKGROUND EFFECTS === */}
              <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl animate-pulse" />
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl animate-pulse delay-300" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/10 blur-3xl animate-pulse delay-700" />

              {/* === MAIN CARD === */}
              <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl backdrop-saturate-150 transition duration-500 hover:shadow-[0_40px_100px_-20px_rgba(15,23,42,0.4)] dark:bg-slate-900/80 dark:border-slate-700/40 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                {/* Subtle grid overlay for depth */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

                {/* === SINGLE COLUMN LAYOUT - CENTERED === */}
                <div className="flex flex-col items-center min-h-[600px] p-8">
                  {/* === AVAILABLE BADGE - TOP === */}
                  <div className="w-full flex justify-center mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50/80 px-4 py-2 text-sm font-medium text-green-700 backdrop-blur-sm border border-green-200/50 shadow-lg animate-in fade-in slide-in-from-top-2 duration-700">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      Available for work
                    </span>
                  </div>

                  {/* === IMAGE SECTION - CENTERED === */}
                  <div className="relative w-full max-w-2xl flex-1 flex items-center justify-center">
                    {/* Glow ring behind image */}
                    <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
                    <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl animate-pulse delay-500" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl animate-pulse delay-700" />

                    {/* Rotating border effect */}
                    <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

                    <div className="relative z-10 overflow-hidden rounded-4xl w-full aspect-square max-w-[400px]">
                      <Image
                        src={profileSrc}
                        alt="Profile"
                        width={800}
                        height={800}
                        onError={() =>
                          setProfileSrc(
                            "https://res.cloudinary.com/drn1auott/image/upload/v1783978327/profiles/geehcak9xkpyh1e2ib67.jpg",
                          )
                        }
                        className="h-full w-full object-cover shadow-2xl ring-1 ring-white/10 transition duration-700 group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)]"
                      />

                      {/* Overlay gradient that appears on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* === OPTIONAL: NAME OR INFO BELOW IMAGE === */}
                  <div className="mt-6 text-center">
                    <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                      Syed Muhammad Areeb Hassan
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="about"
        className="py-20 max-w-7xl mx-auto px-6 scroll-mt-28"
        {...sectionMotion}
      >
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              About Me
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
              Building thoughtful digital experiences for user-first products.
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              I'm a passionate full-stack developer who builds thoughtful,
              user-friendly web applications. I enjoy working across the stack —
              from backend APIs and databases to polished frontends. Outside of
              coding I like learning new technologies, improving UX, and working
              on open-source tools.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              If you'd like to work together or talk about a project, please
              reach out via the contact form below.
            </p>
            <div>
              <p className="text-3xl font-black tracking-tight text-slate-950">
                {completedProjects}+
              </p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.24em] text-slate-900 dark:text-slate-400">
                Projects Completed
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.15)]">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                  How I work
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  Fast, polished, and reliable delivery
                </h3>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Strategy</p>
                  <p className="mt-3 font-semibold text-slate-950">
                    Product-led decisions that align with business goals.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Build</p>
                  <p className="mt-3 font-semibold text-slate-950">
                    Modern React, Next.js, Node.js, and database workflows.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Launch</p>
                  <p className="mt-3 font-semibold text-slate-950">
                    Production-ready deployments with clarity and care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="relative py-24 scroll-mt-28"
        {...sectionMotion}
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 grid gap-4 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
            <div>
              <div className="flex items-center gap-2 text-cyan-500 font-semibold text-sm uppercase tracking-[0.32em] mb-2">
                <LayoutGrid className="w-4 h-4" /> Showcase
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                Recent Projects
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Each project is designed to deliver value with strong UX,
              responsive layout, and a polished production-ready build.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-[2rem] bg-slate-100 p-6 animate-pulse"
                />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_70px_-40px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    {project.vercelLink && (
                      <iframe
                        src={project.vercelLink}
                        title={project.title}
                        className="h-full w-full border-0 overflow-hidden"
                        scrolling="no"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                      />
                    )}
                    <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-slate-950/70 to-transparent" />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 shadow-sm">
                        <FolderKanban className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-950 transition group-hover:text-amber-600">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Live preview
                      </span>
                      {project.vercelLink ? (
                        <a
                          href={project.vercelLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200 hover:text-rose-900"
                        >
                          View site
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">No link</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-12 text-center shadow-sm">
              <FolderKanban className="h-12 w-12 text-slate-400" />
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  No projects yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Add projects in the admin panel and they will be displayed
                  here with a live preview.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="relative bg-slate-950 py-24 scroll-mt-28"
        {...sectionMotion}
      >
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.14),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.85)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                Ready to collaborate
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Let’s build something great together.
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                Share your idea, project goals, or collaboration plan. I’ll
                review it fast and get back to you with a smart plan.
              </p>
              <div className="space-y-4 text-sm leading-6 text-slate-200">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-semibold text-white">Email</p>
                  <p className="text-slate-400">areebhs@gmail.com</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-semibold text-white">Availability</p>
                  <p className="text-slate-400">
                    Open for new freelance & contract work
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-4xl bg-white p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.25)]">
              <h3 className="text-2xl font-bold text-slate-950">Contact Me</h3>
              <p className="mt-2 text-sm text-slate-500">
                Fill in your details and I’ll reach out with a tailored
                proposal.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSendingContact(true);
                  try {
                    const apiUrl =
                      process.env.NEXT_PUBLIC_API_URL ||
                      "http://localhost:8000";
                    const res = await fetch(`${apiUrl}/api/messages`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: contactName,
                        contact: contactPhone,
                        email: contactEmail,
                        comment: contactComment,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok)
                      throw new Error(data.message || "Failed to send message");
                    alert("Message sent — thanks!");
                    setContactName("");
                    setContactPhone("");
                    setContactEmail("");
                    setContactComment("");
                  } catch (err) {
                    alert(
                      err instanceof Error
                        ? err.message
                        : "Failed to send message",
                    );
                  } finally {
                    setSendingContact(false);
                  }
                }}
                className="mt-8 space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span>Name</span>
                    <input
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    <span>Phone</span>
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Phone or WhatsApp"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200"
                    />
                  </label>
                </div>
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Message</span>
                  <textarea
                    required
                    rows={5}
                    value={contactComment}
                    onChange={(e) => setContactComment(e.target.value)}
                    placeholder="Tell me about your project"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200"
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingContact}
                    className="inline-flex items-center justify-center rounded-full bg-fuchsia-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {sendingContact ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        id="skills"
        className="py-20 max-w-7xl mx-auto px-6 border-t border-zinc-200"
        {...sectionMotion}
      >
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-2">
          <Brain className="w-4 h-4" /> Expertise
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
          Core Capabilities
        </h2>

        {loading ? (
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-white/60 border border-zinc-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        ) : skills.length > 0 ? (
          <div className="flex flex-wrap gap-3 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-out [&_span]:hover:-translate-y-1 [&_span]:hover:scale-105">
            {skills.map((skill) => (
              <span
                key={skill._id}
                className="bg-amber-100 border border-amber-200 text-amber-800 px-5 py-2.5 rounded-full text-sm font-medium transition duration-300 select-none cursor-default"
              >
                {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-slate-200 bg-white/70 p-8 text-center text-slate-500">
            No skills are available yet. Please add skills in the backend to
            display them here.
          </div>
        )}
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        id="testimonials"
        className="py-20 max-w-7xl mx-auto px-6 border-t border-zinc-200"
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm uppercase tracking-wider mb-2">
          <Star className="w-4 h-4 text-purple-400" /> Feedback
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
          Testimonials
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 bg-white/60 border border-zinc-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="space-y-6">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((testi) => (
                  <div
                    key={testi._id}
                    className="min-w-0 flex-[0_0_100%] px-2 sm:px-4"
                  >
                    <div className="h-full min-h-80  sm:min-h-90 lg:min-h-100 bg-white/90 backdrop-blur-sm border border-zinc-200 rounded-3xl p-8 relative flex flex-col justify-between shadow-sm transition-transform duration-300 ease-out hover:-translate-y-1">
                      <div>
                        <Quote className="w-8 h-8 text-amber-200 mb-4" />
                        <p className="text-zinc-800 text-sm leading-relaxed italic mb-6">
                          &ldquo;{testi.message}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                        {testi.image && (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-200">
                            <Image
                              src={testi.image}
                              alt="Client Avatar"
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-800">
                            {testi.name || "Client"}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(
                              testi.createdAt || Date.now(),
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === selectedTestimonial
                        ? "w-8 bg-purple-600"
                        : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous testimonial"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-purple-300 hover:text-purple-600"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next testimonial"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-purple-300 hover:text-purple-600"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 text-sm">No client reviews yet.</p>
        )}
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 bg-[#efe6dc]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-700">
          <p>
            &copy; {new Date().getFullYear()} Developer.IO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
