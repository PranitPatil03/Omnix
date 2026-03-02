import Link from "next/link";
import {
  BotIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  ZapIcon,
  ArrowRightIcon,
  HeadphonesIcon,
  FileTextIcon,
  PaletteIcon,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2">
            <BotIcon className="size-6 text-primary" />
            <span className="text-xl font-bold">Omnix</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-4 py-24 md:py-32 text-center">
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          <ZapIcon className="mr-2 size-3.5" />
          AI-Powered Customer Support
        </div>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Your AI Support Agent,{" "}
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Always On
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          Deploy an intelligent AI chatbot that resolves customer queries instantly,
          escalates when needed, and learns from your knowledge base — all embeddable
          in a single script tag.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Start Free <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/40 px-4 py-24 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete AI support platform that handles conversations,
              knowledge management, and customer communication.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BotIcon,
                title: "AI Chat Agent",
                description:
                  "Powered by GPT-4o, your agent answers questions, searches your knowledge base, and resolves issues automatically.",
              },
              {
                icon: MessageSquareTextIcon,
                title: "Live Conversations",
                description:
                  "Monitor all customer conversations in real-time. Escalated chats land in your inbox for human follow-up.",
              },
              {
                icon: FileTextIcon,
                title: "Knowledge Base (RAG)",
                description:
                  "Upload PDFs, docs, and text files. The AI searches them with retrieval-augmented generation for accurate answers.",
              },
              {
                icon: HeadphonesIcon,
                title: "Voice Support",
                description:
                  "Integrate Vapi for voice-based AI assistants your customers can call directly from the widget.",
              },
              {
                icon: PaletteIcon,
                title: "Customizable Widget",
                description:
                  "Tailor the chat widget&apos;s greeting, suggestions, and appearance. Embed it anywhere with one script tag.",
              },
              {
                icon: ShieldCheckIcon,
                title: "Multi-Tenant & Secure",
                description:
                  "Organization-based isolation ensures each team&apos;s data, conversations, and files are completely separated.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-24 md:py-32">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Up and Running in Minutes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to deploy your AI support agent.
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create Your Organization",
                description:
                  "Sign up, create an organization, and invite your team members.",
              },
              {
                step: "2",
                title: "Upload Your Knowledge",
                description:
                  "Add PDFs, documents, and text files to train your AI agent on your product.",
              },
              {
                step: "3",
                title: "Embed the Widget",
                description:
                  "Copy a single <script> tag into your website and your AI agent is live.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="border-t bg-muted/40 px-4 py-24 md:py-32">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free and upgrade when you need advanced features.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-xl border bg-background p-8 text-left shadow-sm">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="mt-1 text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ZapIcon className="size-4 text-primary" /> AI chat support
                </li>
                <li className="flex items-center gap-2">
                  <ZapIcon className="size-4 text-primary" /> 1 team member
                </li>
                <li className="flex items-center gap-2">
                  <ZapIcon className="size-4 text-primary" /> Basic knowledge base
                </li>
              </ul>
              <Button className="mt-8 w-full" variant="outline" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
            {/* Pro */}
            <div className="rounded-xl border-2 border-primary bg-background p-8 text-left shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                Popular
              </div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="mt-1 text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ZapIcon className="size-4 text-primary" /> Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <ZapIcon className="size-4 text-primary" /> Up to 5 team members
                </li>
                <li className="flex items-center gap-2">
                  <ZapIcon className="size-4 text-primary" /> Widget customization
                </li>
                <li className="flex items-center gap-2">
                  <ZapIcon className="size-4 text-primary" /> Voice support (Vapi)
                </li>
              </ul>
              <Button className="mt-8 w-full" asChild>
                <Link href="/sign-up">Start Pro Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 md:py-32">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Transform Your Support?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join teams using Omnix to deliver instant, intelligent customer support 24/7.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/sign-up">
              Get Started Free <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BotIcon className="size-4" />
            <span>Omnix &copy; {new Date().getFullYear()}</span>
          </div>
          <nav className="flex gap-6">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
