"use client";

import { useEffect, useState } from "react";
import { getBillingData } from "@/app/(dashboard)/billing/actions";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { CreditCardIcon, CalendarIcon, CheckIcon, ExternalLinkIcon, LinkIcon, FileTextIcon, Loader2Icon } from "lucide-react";

export const ActiveSubscriptionView = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [managing, setManaging] = useState(false);

    useEffect(() => {
        let active = true;
        const fetch = async () => {
            try {
                const res = await getBillingData();
                if (active) setData(res);
            } finally {
                if (active) setLoading(false);
            }
        };
        fetch();
        return () => { active = false; };
    }, []);

    const handleManage = async () => {
        setManaging(true);
        try {
            const response = await fetch("/api/stripe/portal", { method: "POST" });
            const portalResponse = await response.json();
            if (portalResponse.url) {
                window.location.href = portalResponse.url;
            }
        } catch {
            alert("Failed to load portal");
            setManaging(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!data || !data.subscription) {
        return (
            <div className="rounded-lg border bg-background p-6 text-center text-muted-foreground">
                <p>You don&apos;t have an active subscription.</p>
            </div>
        );
    }

    const { subscription, paymentMethod, customer, invoices } = data;

    const formatDate = (ts: number) => {
        return new Date(ts * 1000).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="mx-auto w-full max-w-4xl space-y-8">
            {/* Current Subscription */}
            <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Subscription</h2>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between rounded-lg border bg-background p-6 shadow-sm">
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold">Omnix {subscription.planName}</h3>
                        <p className="text-2xl font-bold mt-2">
                            ${(subscription.amount / 100).toFixed(2)} <span className="text-base font-normal text-muted-foreground">per month</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {subscription.cancelAtPeriodEnd ? (
                                `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
                            ) : (
                                `Your next billing date is ${formatDate(subscription.currentPeriodEnd)}.`
                            )}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button variant="outline" onClick={handleManage} disabled={managing}>
                            {managing ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : null}
                            Manage Subscription
                        </Button>
                    </div>
                </div>
            </section>

            {/* Payment Method */}
            <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</h2>
                <div className="rounded-lg border bg-background p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-14 items-center justify-center rounded border bg-muted/50">
                            <CreditCardIcon className="size-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium capitalize">{paymentMethod?.brand || "Card"} ending in {paymentMethod?.last4 || "****"}</p>
                            <p className="text-sm text-muted-foreground">Expires {paymentMethod?.expMonth}/{paymentMethod?.expYear}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Billing Information */}
            <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Billing Information</h2>
                <div className="rounded-lg border bg-background p-6 shadow-sm">
                    <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm">
                        <div className="text-muted-foreground">Name</div>
                        <div className="font-medium">{customer.name}</div>

                        <div className="text-muted-foreground">Email</div>
                        <div className="font-medium">{customer.email}</div>
                    </div>
                </div>
            </section>

            {/* Invoice History */}
            <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice History</h2>
                <div className="rounded-lg border bg-background shadow-sm overflow-hidden">
                    <div className="divide-y">
                        {invoices.length === 0 ? (
                            <div className="p-6 flex items-center justify-center text-sm text-muted-foreground">
                                No past invoices.
                            </div>
                        ) : null}
                        {invoices.map((inv: any) => (
                            <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-6">
                                    <span className="text-sm font-medium w-32">{formatDate(inv.date)}</span>
                                    <span className="text-sm text-muted-foreground">${(inv.amount / 100).toFixed(2)}</span>
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 uppercase tracking-wide">
                                        {inv.status}
                                    </span>
                                    <span className="text-sm text-muted-foreground hidden sm:block">Omnix {subscription.planName}</span>
                                </div>
                                {inv.pdfUrl && (
                                    <Button variant="ghost" size="sm" asChild>
                                        <a href={inv.pdfUrl} target="_blank" rel="noreferrer">
                                            <FileTextIcon className="size-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
