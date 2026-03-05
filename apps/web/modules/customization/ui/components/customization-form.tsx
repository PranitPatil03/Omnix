import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
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
import { VapiFormFields } from "./vapi-form-fields";
import { FormSchema } from "../../types";
import { widgetSettingsSchema } from "../../schemas";
import { WidgetPreview } from "./widget-preview";
import { PlusIcon, Trash2Icon } from "lucide-react";

type WidgetSettings = Doc<"widgetSettings">;

interface CustomizationFormProps {
  initialData?: WidgetSettings | null;
  hasVapiPlugin: boolean;
};

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema) as any,
    defaultValues: {
      companyName: initialData?.companyName || "",
      tagline: initialData?.tagline || "",
      greetMessage:
        initialData?.greetMessage || "Hi! How can I help you today?",
      defaultSuggestions: initialData?.defaultSuggestions?.length
        ? initialData.defaultSuggestions.map((s: string) => ({ value: s }))
        : [{ value: "" }],
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || "",
        phoneNumber: initialData?.vapiSettings.phoneNumber || "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "defaultSuggestions",
  });

  // Reset form when data loads (e.g. after JWT refresh gives us the orgId)
  useEffect(() => {
    if (initialData) {
      form.reset({
        companyName: initialData.companyName || "",
        tagline: initialData.tagline || "",
        greetMessage: initialData.greetMessage || "Hi! How can I help you today?",
        defaultSuggestions: initialData.defaultSuggestions?.length
          ? initialData.defaultSuggestions.map((s: string) => ({ value: s }))
          : [{ value: "" }],
        vapiSettings: {
          assistantId: initialData.vapiSettings.assistantId || "",
          phoneNumber: initialData.vapiSettings.phoneNumber || "",
        },
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: FormSchema) => {
    try {
      const suggestions = values.defaultSuggestions
        .map((s) => s.value?.trim())
        .filter(Boolean) as string[];

      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none"
            ? ""
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none"
            ? ""
            : values.vapiSettings.phoneNumber,
      };

      await upsertWidgetSettings({
        companyName: values.companyName || undefined,
        tagline: values.tagline || undefined,
        greetMessage: values.greetMessage,
        defaultSuggestions: suggestions,
        vapiSettings,
      });

      form.reset(values);
      toast.success("Widget settings saved");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  const watchedValues = useWatch({ control: form.control });

  return (
    <div className="flex gap-8 items-start">
      <div className="flex-1 min-w-0">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>General Chat Settings</CardTitle>
                <CardDescription>
                  Configure basic chat widget behavior and messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company / Brand Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Clyra"
                        />
                      </FormControl>
                      <FormDescription>
                        Shown on the widget welcome screen as &quot;Hi there! Welcome to [Company Name] 👋&quot;
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., AI-Powered Contract Intelligence"
                        />
                      </FormControl>
                      <FormDescription>
                        Shown below the greeting on the widget welcome screen
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="greetMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Greeting Message</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Welcome message shown when chat open"
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        The first message customers see when they open the chat
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm">
                        Default Suggestions
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Quick reply suggestions shown to customers to help guide the
                        conversation
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ value: "" })}
                      disabled={fields.length >= 5}
                    >
                      <PlusIcon className="size-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`defaultSuggestions.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Suggestion ${index + 1}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {hasVapiPlugin && (
              <Card>
                <CardHeader>
                  <CardTitle>Voice Assistant Settings</CardTitle>
                  <CardDescription>
                    Configure voice calling features powered by Vapi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <VapiFormFields form={form} />
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button disabled={form.formState.isSubmitting} type="submit">
                Save Settings
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Live Widget Preview */}
      <div className="hidden lg:block sticky top-8">
        <p className="text-sm font-medium text-muted-foreground mb-3">Live Preview</p>
        <WidgetPreview
          companyName={watchedValues.companyName || ""}
          tagline={watchedValues.tagline || ""}
          greetMessage={watchedValues.greetMessage || ""}
          suggestions={
            (watchedValues.defaultSuggestions || [])
              .map((s) => s?.value)
              .filter(Boolean) as string[]
          }
        />
      </div>
    </div>
  );
};
