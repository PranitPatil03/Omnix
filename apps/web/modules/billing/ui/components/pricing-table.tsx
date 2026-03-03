"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { CheckIcon, LoaderIcon } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals getting started",
    features: [
      "AI chat support",
      "1 team member",
      "Basic knowledge base",
      "Community support",
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
    isFree: true,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For teams that need more power",
    features: [
      "Everything in Free",
      "Up to 5 team members",
      "Widget customization",
      "Voice support (Vapi)",
      "Priority support",
      "Advanced analytics",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
    isFree: false,
  },
];

export const PricingTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const subscription = useQuery(api.private.subscriptions.getStatus);
  const syncStatus = useMutation(api.private.subscriptions.syncStatus);
  const isActive = subscription?.status === "active";
  const searchParams = useSearchParams();

  // After Stripe checkout redirects back with ?success=true,
  // verify the payment with Stripe and sync to Convex
  useEffect(() => {
    const success = searchParams.get("success");
    if (success !== "true") return;
    if (isActive) return; // Already synced

    let cancelled = false;

    const verify = async () => {
      try {
        setVerifyMessage("Verifying your payment...");
        const res = await fetch("/api/stripe/verify", { method: "POST" });
        const data = await res.json();

        if (cancelled) return;

        if (data.verified && data.status) {
          await syncStatus({ status: data.status });
          setVerifyMessage("Payment confirmed! Your plan has been upgraded.");
          // Clean up the URL
          window.history.replaceState({}, "", "/billing");
        } else {
          setVerifyMessage(
            "Payment is being processed. It may take a moment to reflect."
          );
        }
      } catch {
        if (!cancelled) {
          setVerifyMessage(
            "Could not verify payment right now. Please refresh in a moment."
          );
        }
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [searchParams, isActive, syncStatus]);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to open billing portal");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      {verifyMessage && (
        <div className="w-full max-w-3xl rounded-lg border bg-background p-4 text-sm text-center">
          {verifyMessage}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl w-full">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border bg-background p-6 shadow-sm ${plan.popular ? "border-2 border-primary" : ""
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                Popular
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <CheckIcon className="size-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              variant={plan.buttonVariant}
              disabled={plan.isFree || isLoading}
              onClick={
                plan.isFree
                  ? undefined
                  : isActive
                    ? handleManage
                    : handleUpgrade
              }
            >
              {isLoading && !plan.isFree ? (
                <LoaderIcon className="mr-2 size-4 animate-spin" />
              ) : null}
              {plan.isFree
                ? isActive
                  ? "Free Plan"
                  : "Current Plan"
                : isActive
                  ? "Manage Subscription"
                  : "Upgrade to Pro"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};