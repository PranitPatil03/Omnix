"use server";

import { getToken } from "@/lib/auth-server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
});

export async function getBillingData() {
    const token = await getToken();
    if (!token) {
        return null;
    }

    try {
        const payload = JSON.parse(
            Buffer.from(token.split(".")[1]!, "base64url").toString()
        );
        const email: string | undefined = payload.email;

        if (!email) {
            return null;
        }

        const customers = await stripe.customers.list({
            email,
            limit: 1,
            expand: ["data.invoice_settings.default_payment_method"]
        });

        if (customers.data.length === 0) {
            return null;
        }

        const customer = customers.data[0]!;

        // Get Active Subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: "active",
            limit: 1,
            expand: ["data.default_payment_method"]
        });

        // Get Invoices
        const invoices = await stripe.invoices.list({
            customer: customer.id,
            limit: 5,
        });

        const subscription = subscriptions.data.length > 0 ? subscriptions.data[0] : null;

        let paymentMethod = null;
        if (subscription?.default_payment_method) {
            paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;
        } else if (customer.invoice_settings?.default_payment_method) {
            paymentMethod = customer.invoice_settings.default_payment_method as Stripe.PaymentMethod;
        } else {
            // Find latest payment method
            const methods = await stripe.paymentMethods.list({ customer: customer.id, type: "card", limit: 1 });
            if (methods.data.length > 0) paymentMethod = methods.data[0];
        }

        return {
            customer: {
                name: customer.name || email,
                email: customer.email,
                address: customer.address || null,
            },
            subscription: subscription ? {
                id: subscription.id,
                planName: "Pro Plan", // Based on your plans
                amount: subscription.items.data[0]?.price.unit_amount || 2900,
                currency: subscription.currency,
                currentPeriodEnd: subscription.current_period_end,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
            } : null,
            paymentMethod: paymentMethod ? {
                brand: paymentMethod.card?.brand,
                last4: paymentMethod.card?.last4,
                expMonth: paymentMethod.card?.exp_month,
                expYear: paymentMethod.card?.exp_year,
            } : null,
            invoices: invoices.data.map(i => ({
                id: i.id,
                date: i.created,
                amount: i.amount_paid,
                currency: i.currency,
                status: i.status,
                pdfUrl: i.invoice_pdf,
            })),
        };

    } catch (err) {
        console.error("Failed to fetch billing data", err);
        return null;
    }
}
