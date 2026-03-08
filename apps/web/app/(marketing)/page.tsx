"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: "/images/icons/message.png",
    name: "AI-Powered Chat Agent",
    description:
      "Powered by Claude & GPT, your agent answers questions, searches your knowledge base, and resolves issues automatically.",
  },
  {
    icon: "/images/icons/knowledge-base.png",
    name: "Knowledge Base (RAG)",
    description:
      "Upload PDFs, docs, and text. The AI retrieves accurate answers with retrieval-augmented generation.",
  },
  {
    icon: "/images/icons/paint.png",
    name: "Embeddable Widget",
    description:
      "Customize and embed a chat widget on any site with a single script tag. Fully brandable.",
  },
  {
    icon: "/images/icons/voice.png",
    name: "Voice AI Support",
    description:
      "Let customers talk to an AI voice assistant powered by Vapi, directly from the widget.",
  },
  {
    icon: "/images/icons/messages.png",
    name: "Real-time Conversations",
    description:
      "Monitor live customer chats, view AI responses, and take over escalated conversations.",
  },
  {
    icon: "/images/icons/orgs.png",
    name: "Multi-Tenant & Secure",
    description:
      "Organization-based isolation keeps every team's data, conversations, and files completely separated.",
  },
];

const plans = [
  {
    name: "Free Plan",
    price: "$0",
    description:
      "For individuals getting started with AI customer support.",
    features: [
      "AI chat support",
      "1 team member",
      "Basic knowledge base",
      "Embeddable chat widget",
      "Community support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro Plan",
    price: "$29",
    description:
      "For teams that need more power and customization.",
    features: [
      "Everything in Free",
      "Up to 5 team members",
      "Widget customization",
      "Voice support (Vapi)",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Upgrade Now",
    highlight: true,
  },
  {
    name: "Business Plan",
    price: null,
    description:
      "For large organizations needing full-scale automation.",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Multi-org management",
      "Custom integrations",
      "Dedicated account manager",
      "Enterprise-grade security",
    ],
    cta: "Talk to Team",
    highlight: false,
  },
];

const faqs = [
  {
    q: "How does the AI chat agent work?",
    a: "The AI agent uses large language models (Claude & GPT) combined with retrieval-augmented generation to search your uploaded knowledge base and respond to customer queries in real time. It can answer questions, escalate to humans, and learn from your documents.",
  },
  {
    q: "Can I customize the chat widget's appearance?",
    a: "Yes. You can fully customize the widget's colors, greeting message, suggested questions, and position. It's embedded on your site with a single script tag and adapts to your brand.",
  },
  {
    q: "What file types does the knowledge base support?",
    a: "You can upload PDFs, plain text files, and documents. The system chunks and embeds them so the AI can retrieve accurate, contextual answers from your content.",
  },
  {
    q: "How does voice AI support work?",
    a: "Voice support is powered by Vapi. Customers can speak to an AI assistant directly from the chat widget. The voice agent uses the same knowledge base as the text agent for consistent answers.",
  },
  {
    q: "Is my data isolated from other organizations?",
    a: "Absolutely. Omnixx uses organization-based multi-tenancy. Each team's conversations, files, and configurations are completely separated and cannot be accessed by other organizations.",
  },
  {
    q: "Do I need technical knowledge to get started?",
    a: "Not at all. Sign up, create an organization, upload your documents, and copy a single embed script into your website. No coding required.",
  },
  {
    q: "Can I transfer chats to a human agent?",
    a: "Yes. When the AI detects it cannot resolve a query, it escalates the conversation. Your team can monitor all live chats from the dashboard and take over at any time.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc]">
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 w-full bg-[#f8fafc]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Omnixx" width={24} height={20} />
            <span className="text-xl font-normal tracking-tight text-gray-900">
              Omnixx
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link
              href="/sign-in"
              className="text-gray-500 transition-colors hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center rounded-sm bg-gray-900 px-5 text-sm font-medium text-white transition-all hover:bg-gray-800"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">

        <h1 className="relative max-w-3xl text-4xl font-normal tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
          AI support agents{" "}
          <br className="hidden sm:block" />
          that never sleep
        </h1>
        <p className="relative mt-6 max-w-2xl text-base font-normal leading-relaxed text-gray-500 md:text-lg">
          Deploy an intelligent AI chatbot that resolves customer queries
          instantly, escalates when needed, and learns from your knowledge base.
        </p>
        <div className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center gap-2 rounded-sm bg-gradient-to-b from-blue-400 to-blue-600 px-8 text-sm font-medium text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]"
          >
            Get Started Free
            <ArrowRightIcon className="size-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 items-center rounded-sm border border-gray-300 bg-white px-8 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            How It Works
          </a>
        </div>
      </section>

      {/* ── Features – Bento Grid (3 × 2) ── */}
      <section id="features" className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-base text-gray-500">
              A complete AI support platform — chat, knowledge, voice, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/50"
              >
                {/* Animated shimmer on hover */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-50/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <div className="relative">
                  <Image
                    src={feature.icon}
                    alt={feature.name}
                    width={48}
                    height={48}
                    className="mb-5 size-12 transition-transform duration-300 group-hover:scale-110"
                  />
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>

                {/* Corner glow */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-blue-400/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Simple,
              <br className="hidden sm:block" />
              Transparent Pricing
            </h2>
            <p className="mt-4 text-base text-gray-500">
              Choose the plan that fits your team. Scale your AI support
              <br className="hidden sm:block" />
              with no hidden fees or surprises.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl border bg-white p-8 transition-shadow hover:shadow-lg ${plan.highlight
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 shadow-sm"
                  }`}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-3">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-400">/month</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      Custom
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  {plan.description}
                </p>

                <ul className="mt-8 flex-1 space-y-3 text-sm text-gray-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-up"
                  className={`mt-8 flex h-12 items-center justify-center rounded-sm text-sm font-medium transition-all ${plan.highlight
                    ? "bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Frequently
              <br className="hidden sm:block" />
              Asked Questions
            </h2>
            <p className="mt-4 text-base text-gray-500">
              Everything you need to know about AI support agents,
              <br className="hidden sm:block" />
              integrations, and deployment.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-6 py-5 text-left transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {faq.q}
                    </span>
                    <ChevronDownIcon
                      className={`size-4 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                  <div
                    className={`grid transition-all duration-200 ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden text-sm leading-relaxed text-gray-500">
                      {faq.a}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative px-6 py-28 md:py-36">
        {/* Soft gradient background — peach-left, blue-right */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 0% 80%, rgba(253,200,180,0.45) 0%, transparent 60%), radial-gradient(ellipse 80% 100% at 100% 80%, rgba(186,210,255,0.5) 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            AI support agents that
            <br className="hidden sm:block" />
            work for you
          </h2>
          <p className="mt-6 text-base text-gray-500 md:text-lg">
            Automate conversations, resolve queries, and manage support
            efficiently, giving your team more time to focus on what matters
            most.
          </p>
          <Link
            href="/sign-up"
            className="mt-10 inline-flex h-12 items-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 px-8 text-sm font-medium text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)]"
          >
            Try For Free
          </Link>
        </div>
      </section>
    </div>
  );
}
