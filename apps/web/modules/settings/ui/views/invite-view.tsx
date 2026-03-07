"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { organization, useSession } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Loader2Icon, MailOpenIcon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

interface InviteViewProps {
    id: string;
}

export const InviteView = ({ id }: InviteViewProps) => {
    const router = useRouter();
    const { data: session, isPending: sessionPending } = useSession();
    const [isAccepting, setIsAccepting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleAccept = async () => {
        setIsAccepting(true);
        setError(null);
        try {
            const result = await organization.acceptInvitation({
                invitationId: id,
            });

            // Auto switch to the new org
            const orgId = (result?.data as any)?.invitation?.organizationId;
            if (orgId) {
                document.cookie = `active_organization_id=${orgId};path=/;max-age=${60 * 60 * 24 * 365}`;
                await organization.setActive({ organizationId: orgId });
            }

            setSuccess(true);
            setTimeout(() => {
                window.location.href = "/conversations";
            }, 1000);
        } catch (err: any) {
            setError(err?.message || "Failed to accept the invitation. It may have expired or you may be logged in with the wrong email.");
        } finally {
            setIsAccepting(false);
        }
    };

    const handleDecline = async () => {
        setIsAccepting(true);
        setError(null);
        try {
            await organization.rejectInvitation({
                invitationId: id,
            });
            router.push("/conversations");
        } catch (err: any) {
            setError(err?.message || "Failed to decline the invitation.");
            setIsAccepting(false);
        }
    };

    if (sessionPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center p-4">
            <Card className="w-full max-w-xl border-border bg-card shadow-sm">
                <CardHeader className="text-center space-y-5 pt-8">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        {success ? (
                            <CheckCircle2Icon className="size-8 text-green-600" />
                        ) : (
                            <MailOpenIcon className="size-8 text-blue-600 dark:text-blue-400" />
                        )}
                    </div>
                    <CardTitle className="text-2xl font-semibold">
                        {success ? "Welcome to the Team!" : "You've Been Invited"}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground max-w-sm mx-auto">
                        {success
                            ? "You have successfully joined the organization. Redirecting..."
                            : "You have been invited to join an organization. Click below to accept the invitation and access your new workspace."}
                    </CardDescription>
                </CardHeader>

                {!success && (
                    <CardContent className="px-8 flex flex-col items-center">
                        {error && (
                            <div className="mb-6 w-full flex items-start gap-3 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-4 text-center text-sm text-muted-foreground">
                            {session ? (
                                <>
                                    <p>
                                        Logged in as <strong className="font-semibold text-foreground">{session?.user?.email}</strong>
                                    </p>
                                    <p className="max-w-[280px]">
                                        Make sure this matches the email address the invitation was sent to.
                                    </p>
                                </>
                            ) : (
                                <p>You need to be logged in to accept this invitation.</p>
                            )}
                        </div>
                    </CardContent>
                )}

                {!success && (
                    <CardFooter className="flex w-full gap-4 pb-8 px-8 mt-4">
                        {!session ? (
                            <Button
                                className="w-full h-11"
                                onClick={() => {
                                    router.push(`/sign-in?callbackUrl=/invite/${id}`);
                                }}
                            >
                                Log in to Accept
                            </Button>
                        ) : (
                            <>
                                <Button
                                    className="w-1/3 h-11"
                                    variant="outline"
                                    onClick={handleDecline}
                                    disabled={isAccepting}
                                >
                                    Decline
                                </Button>
                                <Button
                                    className="w-2/3 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={handleAccept}
                                    disabled={isAccepting}
                                >
                                    {isAccepting && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                                    Accept Invite
                                </Button>
                            </>
                        )}
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};
