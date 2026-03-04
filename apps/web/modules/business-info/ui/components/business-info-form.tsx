"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type BusinessInfo = Doc<"businessInfo">;

const businessInfoSchema = z.object({
  companyName: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  productsAndServices: z.string().optional(),
  supportEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  supportPhone: z.string().optional(),
  businessHours: z.string().optional(),
  returnPolicy: z.string().optional(),
  additionalContext: z.string().optional(),
});

type FormSchema = z.infer<typeof businessInfoSchema>;

interface BusinessInfoFormProps {
  initialData?: BusinessInfo | null;
}

export const BusinessInfoForm = ({ initialData }: BusinessInfoFormProps) => {
  const upsertBusinessInfo = useMutation(api.private.businessInfo.upsert);

  const form = useForm<FormSchema>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      companyName: initialData?.companyName || "",
      website: initialData?.website || "",
      industry: initialData?.industry || "",
      description: initialData?.description || "",
      productsAndServices: initialData?.productsAndServices || "",
      supportEmail: initialData?.supportEmail || "",
      supportPhone: initialData?.supportPhone || "",
      businessHours: initialData?.businessHours || "",
      returnPolicy: initialData?.returnPolicy || "",
      additionalContext: initialData?.additionalContext || "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    try {
      await upsertBusinessInfo({
        companyName: values.companyName || undefined,
        website: values.website || undefined,
        industry: values.industry || undefined,
        description: values.description || undefined,
        productsAndServices: values.productsAndServices || undefined,
        supportEmail: values.supportEmail || undefined,
        supportPhone: values.supportPhone || undefined,
        businessHours: values.businessHours || undefined,
        returnPolicy: values.returnPolicy || undefined,
        additionalContext: values.additionalContext || undefined,
      });

      toast.success("Business information saved");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>
              Basic information about your company that helps the AI identify and represent your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Acme Inc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., https://acme.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., SaaS, E-commerce, Healthcare"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Briefly describe what your company does, your mission, and your target audience..."
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    A short overview of your business so the AI understands your
                    context
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products & Services</CardTitle>
            <CardDescription>
              Describe what you offer so the AI can answer product-related questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="productsAndServices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Products & Services</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`e.g.,\n- Pro Plan ($29/mo): Unlimited projects, priority support\n- Starter Plan ($9/mo): 5 projects, email support\n- API Access: RESTful API for developers`}
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    List your key products, services, and pricing. The more
                    detail, the better the AI answers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return / Refund Policy</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="e.g., 30-day money-back guarantee on all plans. No refunds after 30 days."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Information</CardTitle>
            <CardDescription>
              Contact details and availability for customer support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="supportEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="e.g., support@acme.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., +1 (555) 123-4567"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Hours</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Mon–Fri 9AM–6PM EST"
                    />
                  </FormControl>
                  <FormDescription>
                    When your support team is available for escalated
                    conversations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Context</CardTitle>
            <CardDescription>
              Any other information the AI should know when answering customer
              questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="additionalContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Instructions / Context</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`e.g.,\n- We're currently running a 20% off promotion until Dec 31\n- Our new v2.0 launches next month\n- Always recommend the Pro plan for teams larger than 5`}
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any extra context, promotions, FAQs, or special
                    instructions for the AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Business Info"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
