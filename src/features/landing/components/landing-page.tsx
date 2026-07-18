"use client";

import Link from "next/link";
import type { Route } from "next";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, CalendarDays, Check, ChevronDown, Compass, Sparkles } from "lucide-react";

import { AppFooter } from "@/components/layouts/app-footer";
import { AppHeader } from "@/components/layouts/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

import { faqs, featuredEvents, landingStats, testimonials } from "../data/landing-content";

const reveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    y: 0,
  }),
};

function SectionHeading({ eyebrow, title }: Readonly<{ eyebrow: string; title: string }>) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold tracking-[0.22em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      <AppHeader />
      <main>
        <section className="relative isolate px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
          <div className="landing-orb landing-orb-one" />
          <div className="landing-orb landing-orb-two" />
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div animate="visible" className="relative z-10" initial="hidden" variants={reveal} custom={0.05}>
              <Badge variant="secondary">
                <Sparkles className="mr-1 size-3" /> The campus is happening
              </Badge>
              <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
                Make your next campus moment count.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
                Discover the rooms worth walking into, register in a moment, and keep your
                semester beautifully in motion.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="#featured-events">
                    Explore events <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={ROUTES.register as Route}>Create your account</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-muted">
                {['No missed deadlines', 'One unified calendar', 'Built for students'].map((item) => (
                  <span className="flex items-center gap-2" key={item}>
                    <Check className="size-4 text-accent" /> {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div animate="visible" className="relative" custom={0.16} initial="hidden" variants={reveal}>
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/10 blur-3xl" />
              <Card className="relative overflow-hidden p-5 sm:p-7">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[5rem] bg-accent-soft" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Your next week</p>
                    <p className="mt-1 font-display text-2xl font-bold">Made visible.</p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <CalendarDays className="size-5" />
                  </div>
                </div>
                <div className="relative mt-8 space-y-3">
                  {featuredEvents.map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 rounded-2xl border border-border bg-background/65 p-4"
                        initial={{ opacity: 0, x: 18 }}
                        key={event.title}
                        transition={{ delay: 0.4 + index * 0.12, duration: 0.45 }}
                      >
                        <div className="w-9 text-center font-display text-xs font-bold text-accent">
                          {event.month}<span className="block text-xl text-foreground">{event.date}</span>
                        </div>
                        <Icon className="size-5 text-primary" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">{event.title}</p>
                          <p className="text-xs text-muted">{event.day}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-border bg-background-elevated px-5 py-9 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-3">
            {landingStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-bold tracking-tight text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" id="featured-events">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Coming up" title="Find a reason to leave your room." />
            <Button asChild variant="ghost"><Link href={ROUTES.events as Route}>View all events <ArrowRight className="size-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.article animate="visible" custom={0.1 + index * 0.08} initial="hidden" key={event.title} variants={reveal}>
                  <Card className="group h-full overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Icon className="size-5" /></div>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                    <p className="mt-9 text-xs font-bold tracking-[0.2em] text-accent uppercase">{event.month} {event.date} · {event.day}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{event.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{event.description}</p>
                    <Link className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary" href={ROUTES.events as Route}>See details <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
                  </Card>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-10 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground sm:p-10">
            <Compass className="size-8 text-accent" />
            <h2 className="mt-8 font-display text-3xl font-bold tracking-tight">The campus map, finally in your pocket.</h2>
            <p className="mt-4 leading-7 text-primary-foreground/75">A single place to browse opportunities, save what matters, and arrive prepared.</p>
          </div>
          <div>
            <SectionHeading eyebrow="Designed for momentum" title="Less coordination. More showing up." />
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {['Browse by interest', 'Register securely', 'Save your favorites', 'Stay in the loop'].map((item, index) => (
                <div className="flex items-center gap-3 rounded-2xl border border-border p-4" key={item}>
                  <span className="font-display text-lg font-bold text-accent">0{index + 1}</span><span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionHeading eyebrow="From the community" title="What students say when things start clicking." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}><CardContent className="p-7"><p className="font-display text-xl font-bold leading-8 tracking-tight">&ldquo;{testimonial.quote}&rdquo;</p><div className="mt-8 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">{testimonial.initials}</div><div><p className="text-sm font-bold">{testimonial.name}</p><p className="text-xs text-muted">{testimonial.role}</p></div></div></CardContent></Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="text-center"><SectionHeading eyebrow="Questions, answered" title="A clear start to a fuller campus life." /></div>
          <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-background-elevated px-6">
            {faqs.map((faq) => (
              <details className="group py-5" key={faq.question}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-lg font-bold"><span>{faq.question}</span><ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pt-3 text-sm leading-7 text-muted">{faq.answer}</p></details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28"><div className="rounded-[2rem] bg-secondary px-7 py-12 text-center sm:px-12"><p className="text-xs font-bold tracking-[0.22em] text-accent uppercase">Your semester starts here</p><h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">Ready to meet the version of campus you have been missing?</h2><Button asChild className="mt-8" size="lg"><Link href={ROUTES.register as Route}>Join CampusPulse <ArrowRight className="size-4" /></Link></Button></div></section>
      </main>
      <AppFooter />
    </div>
  );
}
