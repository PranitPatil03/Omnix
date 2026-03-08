"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CheckCircle,
  FileText,
  FileSearch,
  Sparkles,
  Mic,
} from "lucide-react";
import { motion } from "framer-motion";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { ChatAgentBackground, WidgetBackground, ConversationsBackground, MultiTenantBackground } from "@/components/ui/bento-backgrounds";
import { cn } from "@workspace/ui/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const bentoFeatures = [
  // Row 1: Big (col-span-2) + Small (col-span-1)
  {
    icon: "/images/icons/message.png",
    name: "AI-Powered Chat Agent",
    description:
      "Powered by Claude & GPT, your agent answers questions, searches your knowledge base, and resolves issues automatically.",
    className: "col-span-3 md:col-span-2 lg:col-span-2",
    background: <ChatAgentBackground />,
  },
  {
    icon: "/images/icons/knowledge-base.png",
    name: "Knowledge Base (RAG)",
    description:
      "Upload PDFs, docs, and text. The AI retrieves accurate answers with retrieval-augmented generation.",
    className: "col-span-3 md:col-span-1 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105 overflow-hidden">
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className="flex flex-col items-center gap-4 pt-4 w-full"
        >
          {[...Array(2)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-4 w-full items-center">
              {[
                { tag: "Matched", text: "FAQ Section 3.2", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100", border: "border-emerald-200" },
                { tag: "High Relevance", text: "Product Feature Docs", icon: FileSearch, color: "text-blue-500", bg: "bg-blue-100", border: "border-blue-200" },
                { tag: "Context Found", text: "Pricing Details", icon: FileText, color: "text-amber-500", bg: "bg-amber-100", border: "border-amber-200" },
                { tag: "Retrieved", text: "Troubleshooting Guide", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-100", border: "border-purple-200" },
              ].map((item, i) => (
                <div
                  key={`${groupIdx}-${i}`}
                  className="flex items-center gap-3 w-full max-w-[240px] rounded-xl border border-gray-950/[.05] bg-white p-3 shadow-sm"
                >
                  <div className={cn("p-2 rounded-full border", item.bg, item.border)}>
                    <item.icon className={cn("h-4 w-4", item.color)} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold text-gray-900">{item.tag}</span>
                    <span className="text-xs text-gray-500 truncate">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    ),
  },
  // Row 2: Small (col-span-1) + Big (col-span-2)
  {
    icon: "/images/icons/paint.png",
    name: "Embeddable Widget",
    description:
      "Customize and embed a chat widget on any site with a single script tag. Fully brandable.",
    className: "col-span-3 md:col-span-1 lg:col-span-1",
    background: <WidgetBackground />,
  },
  {
    icon: "/images/icons/voice.png",
    name: "Voice AI Support",
    description:
      "Let customers talk to an AI voice assistant powered by Vapi, directly from the widget.",
    className: "col-span-3 md:col-span-2 lg:col-span-2",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative w-full h-full max-w-[400px]">
            {/* Voice waveform visualization */}
            <motion.div
              className="absolute top-12 left-8 w-[200px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm z-10"
              animate={{ y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Mic className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-semibold text-gray-500 tracking-wide">VOICE INPUT</span>
              </div>
              {/* Animated waveform bars */}
              <div className="flex items-end gap-1 h-8">
                {[3, 5, 2, 7, 4, 6, 3, 5, 2, 4, 6, 3, 5, 7, 2].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-blue-400 rounded-full"
                    animate={{ height: [`${h * 3}px`, `${((h + 3) % 8) * 3 + 4}px`, `${h * 3}px`] }}
                    transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </motion.div>

            {/* AI Response card */}
            <motion.div
              className="absolute top-[120px] right-6 w-[180px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg z-20 border border-blue-400"
              initial={{ opacity: 0.8, x: 10 }}
              animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
              transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-blue-200" />
                <span className="text-[10px] font-bold text-white tracking-wide">AI RESPONSE</span>
              </div>
              <p className="text-[9px] text-blue-100 leading-relaxed font-medium">
                Your subscription renews on March 15. I can help you modify or cancel it.
              </p>
              <div className="mt-2.5 flex gap-1.5">
                <div className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[8px] font-semibold tracking-wide">Modify</div>
                <div className="px-2.5 py-1 rounded-full bg-black/20 text-white text-[8px] font-semibold tracking-wide">Cancel</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    ),
  },
  // Row 3: Big (col-span-2) + Small (col-span-1)
  {
    icon: "/images/icons/messages.png",
    name: "Real-time Conversations",
    description:
      "Monitor live customer chats, view AI responses, and take over escalated conversations.",
    className: "col-span-3 md:col-span-2 lg:col-span-2",
    background: <ConversationsBackground />,
  },
  {
    icon: "/images/icons/orgs.png",
    name: "Multi-Tenant & Secure",
    description:
      "Organization-based isolation keeps every team's data, conversations, and files completely separated.",
    className: "col-span-3 md:col-span-1 lg:col-span-1",
    background: <MultiTenantBackground />,
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
              className="text-gray-500 transition-colors hover:text-gray-900 underline underline-offset-2"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center rounded-sm bg-gray-900 px-5 text-sm font-medium text-white transition-all hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-3xl text-4xl font-light tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl"
        >
          AI support agents{" "}
          <br className="hidden sm:block" />
          that never sleep
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative mt-6 max-w-2xl text-base font-light leading-relaxed text-gray-500 md:text-lg"
        >
          Deploy an intelligent AI chatbot that resolves customer queries
          instantly, escalates when needed, and learns from your knowledge base.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center gap-2 rounded-sm bg-gradient-to-b from-blue-400 to-blue-600 px-8 text-sm font-medium text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]"
          >
            Get Started Free
            <ArrowRightIcon className="size-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 items-center rounded-sm border bg-white px-8 text-sm shadow-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            How It Works
          </a>
        </motion.div>
      </section>

      {/* ── Features – Bento Grid ── */}
      <section id="features" className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-base text-gray-500">
              A complete AI support platform — chat, knowledge, voice, and more.
            </p>
          </div>

          <BentoGrid className="max-w-6xl mx-auto">
            {bentoFeatures.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
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
                className={`relative flex flex-col border rounded-sm transition-shadow shadow-sm ${plan.highlight
                  ? "shadow-xl p-7 md:-my-2 md:py-8"
                  : "shadow-sm p-8"
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
                  className="w-full rounded-sm border px-6 py-5 text-left transition-shadow shadow-sm"
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
