import { type LucideIcon, Palette, Rocket, Trophy } from "lucide-react";

export const featuredEvents: ReadonlyArray<{
  category: string;
  date: string;
  day: string;
  description: string;
  icon: LucideIcon;
  month: string;
  title: string;
}> = [
  {
    category: "Technology",
    date: "24",
    day: "Thursday",
    description: "A one-night build sprint for ideas that deserve a prototype.",
    icon: Rocket,
    month: "JUL",
    title: "Midnight Makers",
  },
  {
    category: "Culture",
    date: "02",
    day: "Saturday",
    description: "A living gallery of illustration, spoken word, and sound.",
    icon: Palette,
    month: "AUG",
    title: "Canvas After Dark",
  },
  {
    category: "Sports",
    date: "09",
    day: "Saturday",
    description: "Teams compete for the all-campus trophy under the lights.",
    icon: Trophy,
    month: "AUG",
    title: "Intercollege Finals",
  },
];

export const landingStats = [
  { label: "Active student community", value: "12k+" },
  { label: "Events hosted yearly", value: "180" },
  { label: "Campus organizations", value: "46" },
] as const;

export const testimonials = [
  {
    initials: "AM",
    name: "Anika Mehta",
    quote:
      "I stopped finding out about the best events after they happened. Everything I need is now in one calm, clear place.",
    role: "Computer Science, 3rd year",
  },
  {
    initials: "RD",
    name: "Rohan Desai",
    quote:
      "Registration takes seconds, and the calendar keeps my semester from becoming a spreadsheet of missed chances.",
    role: "Design Society Lead",
  },
] as const;

export const faqs = [
  {
    answer:
      "Use your campus email to create an account. Once verified, you can discover events, register, and manage your schedule from one place.",
    question: "Who can use CampusPulse?",
  },
  {
    answer:
      "Yes. Your personal calendar view brings registrations and bookmarked events together, so it is easy to see what is coming up.",
    question: "Can I keep track of my registrations?",
  },
  {
    answer:
      "Open the event from your dashboard and cancel your registration. If a waitlist is enabled, the next student can be notified right away.",
    question: "What if I can no longer attend?",
  },
] as const;
