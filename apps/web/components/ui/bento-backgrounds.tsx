"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";

/* ------------------------------------------------------------------ */
/*  1. AI Chat Agent – messages appear one by one, then loop           */
/* ------------------------------------------------------------------ */

const chatMessages = [
  { side: "left" as const, text: "Hi, I need help with my subscription. I was charged twice this month.", time: "2:14 PM" },
  { side: "right" as const, text: "I can see the duplicate charge on your account. Let me process a refund for $29.00 right away.", time: "2:14 PM · AI Agent" },
  { side: "left" as const, text: "That was fast! How long until the refund shows up?", time: "2:15 PM" },
  { side: "right" as const, text: "The refund has been initiated. It typically takes 3-5 business days to appear on your statement.", time: "2:15 PM · AI Agent" },
  { side: "left" as const, text: "Great, thanks! Can you also help me change my plan?", time: "2:16 PM" },
  { side: "right" as const, text: "Of course! You're currently on the Pro plan. Would you like to upgrade to Business or switch to Free?", time: "2:16 PM · AI Agent" },
];

export function ChatAgentBackground() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= chatMessages.length) {
          // Reset after a pause
          return 0;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex w-full [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]">
      <div className="w-full space-y-2.5 px-5 pt-4">
        <AnimatePresence mode="popLayout">
          {chatMessages.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className={cn("flex", msg.side === "right" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[70%] px-3.5 py-2 rounded-2xl",
                  msg.side === "right" ? "rounded-br-md bg-blue-500" : "rounded-bl-md bg-gray-100"
                )}
              >
                <p className={cn("text-[11px] leading-relaxed", msg.side === "right" ? "text-white" : "text-gray-700")}>
                  {msg.text}
                </p>
                <span className={cn("text-[8px] mt-0.5 block", msg.side === "right" ? "text-blue-200" : "text-gray-400")}>
                  {msg.time}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Widget – messages appear one by one in a mini widget, then loop */
/* ------------------------------------------------------------------ */

const widgetMessages = [
  { side: "left" as const, text: "Hi! How can I help you today?" },
  { side: "right" as const, text: "How do I upgrade my plan?" },
  { side: "left" as const, text: "Go to Settings → Billing to upgrade your plan!" },
  { side: "right" as const, text: "Thanks! And how do I add team members?" },
  { side: "left" as const, text: "Navigate to Settings → Team and click 'Invite Member'." },
];

export function WidgetBackground() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => (prev >= widgetMessages.length ? 0 : prev + 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-0 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
      <div className="absolute inset-0 flex justify-center items-start pt-6">
        <div className="w-full max-w-[220px] rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-lg">
          {/* Widget header */}
          <div className="bg-blue-500 px-4 py-3">
            <div className="text-[11px] font-semibold text-white">Omnixx Support</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              <span className="text-[9px] text-blue-100">Online</span>
            </div>
          </div>
          {/* Chat messages */}
          <div className="px-3 py-3 space-y-2 bg-gray-50/50 min-h-[120px]">
            <AnimatePresence mode="popLayout">
              {widgetMessages.slice(0, visibleCount).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex", msg.side === "right" ? "justify-end" : "justify-start")}
                >
                  {msg.side === "left" ? (
                    <div className="bg-white border border-gray-100 rounded-xl rounded-bl-sm px-3 py-2 max-w-[82%] shadow-sm">
                      <p className="text-[10px] text-gray-700">{msg.text}</p>
                    </div>
                  ) : (
                    <div className="bg-blue-500 rounded-xl rounded-br-sm px-3 py-2 max-w-[82%]">
                      <p className="text-[10px] text-white">{msg.text}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Input */}
          <div className="px-3 py-2.5 border-t border-gray-100 flex items-center gap-2">
            <div className="h-7 flex-1 rounded-full bg-gray-100 px-3 flex items-center">
              <span className="text-[9px] text-gray-400">Type a message...</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-white rotate-45 -ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Real-time Conversations – cycles through different chats        */
/* ------------------------------------------------------------------ */

const conversations = [
  {
    name: "Sarah Chen", initial: "S", email: "sarah@acme.co", status: "Unresolved", statusColor: "bg-red-100 text-red-600", sideStatus: "bg-red-400",
    messages: [
      { side: "left" as const, text: "I was charged twice this month for my subscription." },
      { side: "right" as const, text: "I can see the duplicate charge. Processing a refund now.", label: "AI Agent" },
      { side: "left" as const, text: "How long until the refund shows up?" },
    ],
  },
  {
    name: "James Wilson", initial: "J", email: "james@corp.io", status: "AI Handling", statusColor: "bg-blue-100 text-blue-600", sideStatus: "bg-emerald-400",
    messages: [
      { side: "left" as const, text: "How do I integrate the API with my React app?" },
      { side: "right" as const, text: "You can install our SDK with npm install @omnixx/sdk and import it.", label: "AI Agent" },
      { side: "left" as const, text: "Does it support TypeScript?" },
    ],
  },
  {
    name: "Emily Park", initial: "E", email: "emily@startup.co", status: "Resolved", statusColor: "bg-emerald-100 text-emerald-600", sideStatus: "bg-emerald-400",
    messages: [
      { side: "left" as const, text: "Can I export my conversation history?" },
      { side: "right" as const, text: "Yes! Go to Settings → Data → Export and select the date range.", label: "AI Agent" },
      { side: "left" as const, text: "Perfect, thank you!" },
    ],
  },
  {
    name: "Michael Torres", initial: "M", email: "mike@dev.com", status: "Escalated", statusColor: "bg-amber-100 text-amber-600", sideStatus: "bg-amber-400",
    messages: [
      { side: "left" as const, text: "I can't access my dashboard. It shows a 403 error." },
      { side: "right" as const, text: "It looks like your permissions were updated. Let me escalate this to our team.", label: "AI Agent" },
      { side: "left" as const, text: "Please hurry, I need access for a demo." },
    ],
  },
];

const sidebarConvos = [
  { name: "Sarah Chen", msg: "I was charged twice...", time: "2m", status: "bg-red-400" },
  { name: "James Wilson", msg: "How do I integrate the...", time: "5m", status: "bg-emerald-400" },
  { name: "Emily Park", msg: "Can I export my convers...", time: "12m", status: "bg-emerald-400" },
  { name: "Michael Torres", msg: "I can't access my dash...", time: "18m", status: "bg-amber-400" },
  { name: "Lisa Kumar", msg: "I need a refund for...", time: "25m", status: "bg-red-400" },
];

export function ConversationsBackground() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % conversations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const active = conversations[activeIdx];
  if (!active) return null;

  return (
    <div className="absolute right-0 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
      <div className="absolute inset-0 flex justify-center items-start pt-2">
        <div className="w-[92%] rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm flex">
          {/* Sidebar */}
          <div className="w-[38%] border-r border-gray-100 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-900">Conversations</span>
              <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">12</span>
            </div>
            {sidebarConvos.map((conv, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 px-3 py-2 border-b border-gray-50 cursor-pointer transition-colors duration-300",
                  i === activeIdx && "bg-blue-50/60"
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center">
                    <span className="text-[7px] text-white font-bold">{conv.name.charAt(0)}</span>
                  </div>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white", conv.status)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-semibold text-gray-900 truncate">{conv.name}</span>
                    <span className="text-[7px] text-gray-400 shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-[8px] text-gray-500 truncate mt-0.5">{conv.msg}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Chat view — switches with animation */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center">
                      <span className="text-[6px] text-white font-bold">{active.initial}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-semibold text-gray-900">{active.name}</span>
                      <span className="text-[7px] text-gray-400 ml-1.5">{active.email}</span>
                    </div>
                  </div>
                  <span className={cn("text-[7px] px-1.5 py-0.5 rounded-full font-semibold", active.statusColor)}>{active.status}</span>
                </div>
                <div className="flex-1 px-3 py-2 space-y-1.5 bg-gray-50/30">
                  {active.messages.map((msg, mi) => (
                    <motion.div
                      key={mi}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 * mi, duration: 0.3 }}
                      className={cn("flex", msg.side === "right" ? "justify-end" : "justify-start")}
                    >
                      {msg.side === "left" ? (
                        <div className="bg-white border border-gray-100 rounded-lg rounded-bl-sm px-2.5 py-1.5 max-w-[80%] shadow-sm">
                          <p className="text-[8px] text-gray-700">{msg.text}</p>
                        </div>
                      ) : (
                        <div className="bg-blue-500 rounded-lg rounded-br-sm px-2.5 py-1.5 max-w-[80%]">
                          <p className="text-[8px] text-white">{msg.text}</p>
                          {"label" in msg && <span className="text-[6px] text-blue-200 block mt-0.5">{msg.label}</span>}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="px-3 py-1.5 border-t border-gray-100 flex items-center gap-1.5">
                  <div className="h-5 flex-1 rounded-md bg-gray-100 px-2 flex items-center">
                    <span className="text-[7px] text-gray-400">Type your response as an operator...</span>
                  </div>
                  <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 border-t border-r border-white rotate-45 -ml-0.5" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Multi-Tenant – horizontal slide/flip between org cards          */
/* ------------------------------------------------------------------ */

const orgs = [
  {
    name: "Acme Corp", initials: "AC", plan: "Pro Plan", members: 5,
    gradient: "from-blue-500 to-blue-600",
    team: [
      { name: "Alice Johnson", role: "Owner", avatar: "AJ", color: "from-violet-400 to-violet-600" },
      { name: "Bob Smith", role: "Admin", avatar: "BS", color: "from-blue-400 to-blue-600" },
      { name: "Carol Lee", role: "Member", avatar: "CL", color: "from-emerald-400 to-emerald-600" },
    ],
  },
  {
    name: "Startup Inc", initials: "SI", plan: "Business Plan", members: 12,
    gradient: "from-violet-500 to-purple-600",
    team: [
      { name: "David Kim", role: "Owner", avatar: "DK", color: "from-amber-400 to-orange-600" },
      { name: "Eva Martinez", role: "Admin", avatar: "EM", color: "from-pink-400 to-rose-600" },
      { name: "Frank Liu", role: "Member", avatar: "FL", color: "from-cyan-400 to-teal-600" },
    ],
  },
  {
    name: "DevOps Team", initials: "DT", plan: "Free Plan", members: 3,
    gradient: "from-emerald-500 to-green-600",
    team: [
      { name: "Grace Park", role: "Owner", avatar: "GP", color: "from-indigo-400 to-blue-600" },
      { name: "Henry Wang", role: "Member", avatar: "HW", color: "from-slate-400 to-gray-600" },
    ],
  },
  {
    name: "CloudBase", initials: "CB", plan: "Pro Plan", members: 8,
    gradient: "from-orange-500 to-red-600",
    team: [
      { name: "Irene Zhou", role: "Owner", avatar: "IZ", color: "from-rose-400 to-pink-600" },
      { name: "Jake Ross", role: "Admin", avatar: "JR", color: "from-teal-400 to-emerald-600" },
      { name: "Karen Bell", role: "Member", avatar: "KB", color: "from-blue-400 to-indigo-600" },
    ],
  },
];

export function MultiTenantBackground() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % orgs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const org = orgs[activeIdx];
  if (!org) return null;

  return (
    <div className="absolute right-0 top-0 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105 overflow-hidden">
      <div className="flex items-start justify-center pt-4 px-3 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -100, rotateY: -15 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full max-w-[240px] rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", org.gradient)}>
                <span className="text-[9px] text-white font-bold">{org.initials}</span>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-gray-900">{org.name}</div>
                <div className="text-[8px] text-gray-400">{org.plan} · {org.members} members</div>
              </div>
            </div>
            <div className="space-y-1.5">
              {org.team.map((member, mIdx) => (
                <motion.div
                  key={mIdx}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + mIdx * 0.1 }}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-gray-50/70"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center", member.color)}>
                      <span className="text-[6px] text-white font-bold">{member.avatar}</span>
                    </div>
                    <span className="text-[9px] text-gray-700 font-medium">{member.name}</span>
                  </div>
                  <span className="text-[7px] text-gray-400 font-medium">{member.role}</span>
                </motion.div>
              ))}
            </div>
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-gray-100">
              {orgs.map((_, dotIdx) => (
                <div
                  key={dotIdx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    dotIdx === activeIdx ? "bg-blue-500 w-3" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
