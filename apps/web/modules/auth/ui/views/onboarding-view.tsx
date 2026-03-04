"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { organization, useActiveOrganization, useListOrganizations, useSession } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { BuildingIcon, BriefcaseIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

// ─── Schemas ────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
});

const step2Schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().url("Please enter a valid URL (e.g. https://yoursite.com)").or(z.literal("")),
  description: z.string().min(10, "Please briefly describe your business (at least 10 characters)"),
  productsAndServices: z.string().optional(),
  commonQuestions: z.string().optional(),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

// ─── Step indicators ────────────────────────────────────────────────────────

const steps = [
  { label: "Create Organization", icon: BuildingIcon },
  { label: "Business Setup", icon: BriefcaseIcon },
];

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center gap-3 mb-8">
    {steps.map((step, idx) => {
      const Icon = step.icon;
      const done = idx < current;
      const active = idx === current;
      return (
        <div key={idx} className="flex items-center gap-2">
          {idx > 0 && (
            <div className={cn("h-px w-8 flex-shrink-0 transition-colors", done ? "bg-primary" : "bg-border")} />
          )}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                active && "border-primary bg-primary text-primary-foreground",
                done && "border-primary bg-primary/10 text-primary",
                !active && !done && "border-border text-muted-foreground"
              )}
            >
              {done ? "✓" : <Icon className="size-3.5" />}
            </div>
            <span className={cn("text-sm font-medium hidden sm:block", active ? "text-foreground" : "text-muted-foreground")}>
              {step.label}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Main component ──────────────────────────────────────────────────────────

export const OnboardingView = () => {
  const { data: session, isPending: sessionPending } = useSession();
  const { data: activeOrg, isPending: orgPending } = useActiveOrganization();
  const { data: orgs, isPending: listPending } = useListOrganizations();
  const upsertBusinessInfo = useMutation(api.private.businessInfo.upsert);

  // If org already exists, skip straight to step 2
  const [step, setStep] = useState<0 | 1>(0);
  const [orgCreating, setOrgCreating] = useState(false);

  useEffect(() => {
    if (!listPending && orgs && orgs.length > 0) {
      setStep(1);
    }
  }, [orgs, listPending]);

  // Redirect away if not logged in
  useEffect(() => {
    if (!sessionPending && !session) {
      window.location.href = "/sign-in";
    }
  }, [session, sessionPending]);

  // ── Step 1 form ──
  const form1 = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { orgName: session?.user?.name ? `${session.user.name}'s Business` : "" },
  });

  const handleStep1 = async (values: Step1Values) => {
    setOrgCreating(true);
    try {
      const slug = values.orgName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/, "");

      const result = await organization.create({ name: values.orgName.trim(), slug });
      if (result.data) {
        await organization.setActive({ organizationId: result.data.id });
        document.cookie = `active_organization_id=${result.data.id};path=/;max-age=${60 * 60 * 24 * 365}`;
        // Full page reload so the Convex auth token picks up the new orgId
        // before step 2 submits any mutations that require identity.orgId.
        window.location.href = "/onboarding";
      }
    } finally {
      setOrgCreating(false);
    }
  };

  // ── Step 2 form ──
  const form2 = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      companyName: activeOrg?.name ?? "",
      website: "",
      description: "",
      productsAndServices: "",
      commonQuestions: "",
    },
  });

  // Populate company name once org is known
  useEffect(() => {
    if (activeOrg?.name && !form2.getValues("companyName")) {
      form2.setValue("companyName", activeOrg.name);
    }
  }, [activeOrg, form2]);

  const handleStep2 = async (values: Step2Values) => {
    await upsertBusinessInfo({
      companyName: values.companyName,
      website: values.website || undefined,
      description: values.description,
      productsAndServices: values.productsAndServices || undefined,
      additionalContext: values.commonQuestions || undefined,
    });
    // Onboarding complete → go to billing to pick a plan
    window.location.href = "/billing";
  };

  if (sessionPending || listPending || orgPending) {
    return (
      <div className="flex items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("w-full px-4", step === 0 ? "max-w-lg" : "max-w-2xl")}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-center gap-2">
        <SparklesIcon className="size-6 text-primary" />
        <span className="text-lg font-semibold">Getting Started</span>
      </div>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Let&apos;s set up your AI support agent in just a couple of steps.
      </p>

      <StepIndicator current={step} />

      {/* ── Step 1: Create Org ── */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create your organization</CardTitle>
            <CardDescription>
              This will be the workspace for your AI support agent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-4">
                <FormField
                  control={form1.control}
                  name="orgName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Acme Inc." autoFocus />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={orgCreating}>
                  {orgCreating && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                  Continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* ── Step 2: Business Info ── */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your business</CardTitle>
            <CardDescription>
              This information trains your AI agent so it answers customer questions accurately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-5">
                {/* Company name */}
                <FormField
                  control={form2.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Acme Inc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website */}
                <FormField
                  control={form2.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://yoursite.com" type="url" />
                      </FormControl>
                      <FormDescription>
                        Your public-facing website so the AI can reference it.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form2.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What does your business do? *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Briefly describe your company, what you offer, and who your customers are…"
                        />
                      </FormControl>
                      <FormDescription>
                        A clear description helps the AI understand your context.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Products & Services */}
                <FormField
                  control={form2.control}
                  name="productsAndServices"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Products &amp; Services</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder={`e.g.\n- Pro Plan ($29/mo): unlimited projects\n- Starter Plan ($9/mo): 5 projects`}
                        />
                      </FormControl>
                      <FormDescription>
                        List your key offerings and pricing so customers get accurate answers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Common questions */}
                <FormField
                  control={form2.control}
                  name="commonQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Common Questions Customers Ask</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder={`e.g.\n- Do you offer a free trial? Yes, 14 days.\n- How do I cancel? You can cancel anytime from your dashboard.\n- Do you support multiple languages? Yes, 30+ languages.`}
                        />
                      </FormControl>
                      <FormDescription>
                        Add FAQs or anything the AI must know to answer visitors on your site.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form2.formState.isSubmitting}
                    size="lg"
                  >
                    {form2.formState.isSubmitting && (
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                    )}
                    Save &amp; Continue to Billing
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground text-xs"
                    onClick={() => { window.location.href = "/billing"; }}
                  >
                    Skip for now
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
