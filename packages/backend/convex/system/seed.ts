import { internalMutation } from "../_generated/server";

export const seedClyra = internalMutation({
  args: {},
  handler: async (ctx) => {
    const organizationId = "jh7d1vg9e55xtmc7dykg23dn8h827ak2";

    // 1. Seed business info
    const existingInfo = await ctx.db
      .query("businessInfo")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId),
      )
      .unique();

    const businessData = {
      organizationId,
      companyName: "Clyra",
      website: "https://clyra.ai",
      industry: "Legal Technology / Contract Intelligence",
      description:
        "Clyra uses intelligent AI to scan contracts, highlight risks, and recommend edits so your team can move faster with confidence. We help legal teams, founders, and professionals review contracts in minutes rather than hours.",
      productsAndServices:
        "Clyra offers AI-powered contract analysis. Upload any contract PDF and receive comprehensive risk detection, legal compliance assessment, smart negotiation recommendations, and cost analytics.\n\nBasic Plan (Free Forever): PDF contract upload, AI contract type detection, 5 risks with severity levels, 5 opportunities with impact levels, brief contract summary, overall favorability score.\n\nPro Plan ($20/month): Everything in Basic, plus unlimited PDF uploads, 10+ detailed risks and opportunities, comprehensive contract summary, improvement and negotiation points, key clauses and legal compliance assessment, compensation and IP breakdown, PDF/Word report export, priority analysis processing.",
      supportEmail: "support@clyra.ai",
      supportPhone: "+1 (888) 255-9271",
      businessHours:
        "Monday to Friday, 9 AM – 6 PM EST. AI support is available 24/7.",
      returnPolicy:
        "Clyra offers a 14-day money-back guarantee on the Pro plan. If you are not satisfied within 14 days of upgrading, contact support@clyra.ai for a full refund. The Basic plan is free forever with no payment required.",
      additionalContext: `## Frequently Asked Questions

### Getting Started

**Q: What is Clyra?**
A: Clyra is an AI-powered contract intelligence platform that helps individuals and teams review, analyze, and understand contracts quickly. Simply upload a PDF and our AI provides risk detection, compliance checks, negotiation points, and more.

**Q: Who is Clyra for?**
A: Clyra is designed for legal professionals, startup founders, procurement teams, freelancers, and anyone who needs to review contracts without spending hours reading through dense legal language.

**Q: How do I get started?**
A: Sign up for a free Basic account at clyra.ai — no credit card required. Upload your first contract PDF and receive an instant analysis.

**Q: Is there a free plan?**
A: Yes! The Basic plan is free forever. It includes PDF upload, AI contract type detection, 5 identified risks with severity levels, 5 opportunities with impact levels, a brief summary, and an overall favorability score.

### Features

**Q: What types of contracts can Clyra analyze?**
A: Clyra can analyze any contract type including NDAs, employment agreements, service agreements, vendor contracts, SaaS agreements, lease agreements, partnership agreements, and more.

**Q: What is AI-Powered Analysis?**
A: Upload any contract PDF and get comprehensive analysis with risks, opportunities, and actionable insights — usually in under 2 minutes.

**Q: What is Risk Detection?**
A: Clyra automatically identifies and categorizes contractual risks by severity (low, medium, high) — such as unfavorable payment terms, unlimited liability clauses, auto-renewal traps, IP ownership concerns, and one-sided termination rights.

**Q: What is Legal Compliance?**
A: Clyra provides an instant compliance check against common regulatory requirements relevant to your contract type, flagging potential compliance gaps.

**Q: What are Smart Recommendations?**
A: Clyra generates AI-driven negotiation points and suggested edits tailored specifically to what the analysis finds in your contract.

**Q: What is Cost Analytics?**
A: Clyra tracks contract values, identifies potential savings, and helps you optimize spending across multiple contracts (available on Pro).

**Q: Can I export my contract analysis?**
A: Yes — Pro users can export full reports in PDF or Word format for easy sharing with team members or legal counsel.

### Pricing

**Q: What does the Basic plan include?**
A: The Basic plan is free forever and includes: PDF contract upload, AI contract type detection, 5 risks with severity levels, 5 opportunities with impact levels, a brief contract summary, and an overall favorability score.

**Q: What does the Pro plan include?**
A: The Pro plan is $20/month and includes everything in Basic, plus: unlimited PDF uploads, 10+ detailed risks and opportunities, comprehensive contract summary, improvement and negotiation points, key clauses and legal compliance assessment, compensation and IP breakdown, PDF/Word export, and priority analysis processing.

**Q: Is there an annual pricing option?**
A: Annual pricing with a discount is coming soon. Contact support@clyra.ai to be notified when it launches.

**Q: Can I cancel anytime?**
A: Yes, you can cancel your Pro subscription at any time from your account settings. You will retain Pro access until the end of your current billing period.

**Q: Do you offer a free trial of Pro?**
A: We offer a 14-day money-back guarantee. Upgrade to Pro and if you are not satisfied within 14 days, email support@clyra.ai for a full refund.

### Privacy & Security

**Q: Is my contract data safe?**
A: Yes. All uploaded contracts are encrypted in transit and at rest. We do not share your contract data with third parties, and contracts are never used to train AI models.

**Q: How long are my contracts stored?**
A: Contracts and analysis reports are stored as long as your account is active. You can delete any contract from your dashboard at any time.

### Technical

**Q: What file formats are supported?**
A: Currently Clyra supports PDF files. Support for Word (.docx) and plain text files is coming soon.

**Q: What is the maximum file size?**
A: The maximum upload size is 25 MB per contract.

**Q: How accurate is the AI analysis?**
A: Clyra uses state-of-the-art language models fine-tuned for legal documents. While highly accurate, Clyra is designed to assist your review — it is not a substitute for qualified legal advice for high-stakes contracts.

**Q: How long does analysis take?**
A: Most analyses complete in under 2 minutes. Pro users receive priority processing for faster results.

### Account & Billing

**Q: How do I upgrade to Pro?**
A: Log in to your Clyra account and click "Upgrade to Pro" on the billing page or any plan comparison screen.

**Q: How do I cancel my Pro subscription?**
A: Go to Settings > Billing and click "Cancel Subscription". Your Pro features remain active until the billing period ends.

**Q: What payment methods are accepted?**
A: We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe. All transactions are fully secure.

**Q: I forgot my password. How do I reset it?**
A: Click "Forgot password" on the sign-in page, enter your email, and a reset link will be sent within a few minutes. Check your spam folder if it does not arrive.

**Q: How do I contact support?**
A: Email us at support@clyra.ai or call +1 (888) 255-9271, Monday to Friday, 9 AM – 6 PM EST. Our AI support agent is available 24/7 in the chat widget.`,
    };

    if (existingInfo) {
      await ctx.db.patch(existingInfo._id, businessData);
    } else {
      await ctx.db.insert("businessInfo", businessData);
    }

    // 2. Seed widget settings
    const existingWidget = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId),
      )
      .unique();

    const widgetData = {
      organizationId,
      companyName: "Clyra",
      tagline: "AI-Powered Contract Intelligence",
      greetMessage:
        "Hi! 👋 I'm Clyra's AI assistant. I can help you with contract analysis questions, pricing, and features. How can I help you today?",
      defaultSuggestions: [
        "What contracts can you analyze?",
        "How much does the Pro plan cost?",
        "Is my data secure?",
      ],
      vapiSettings: {
        assistantId: undefined,
        phoneNumber: undefined,
      },
    };

    if (existingWidget) {
      await ctx.db.patch(existingWidget._id, widgetData);
    } else {
      await ctx.db.insert("widgetSettings", widgetData);
    }

    // 3. Seed subscription
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId),
      )
      .unique();

    if (existingSub) {
      await ctx.db.patch(existingSub._id, { status: "active" });
    } else {
      await ctx.db.insert("subscriptions", {
        organizationId,
        status: "active",
      });
    }

    return {
      businessInfo: existingInfo ? "updated" : "created",
      widgetSettings: existingWidget ? "updated" : "created",
      subscription: existingSub ? "updated" : "created",
    };
  },
});
