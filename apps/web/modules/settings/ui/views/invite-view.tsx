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

    // We don't have a built-in direct "getInvitation" that doesn't require org id easily in the client without org context sometimes, 
    // but better-auth acceptInvitation takes the invitationId directly.

    const handleAccept = async () => {
        setIsAccepting(true);
        setError(null);
        try {
            await organization.acceptInvitation({
                invitationId: id,
            });
            setSuccess(true);
            setTimeout(() => {
                router.push("/org-selection");
            }, 2000);
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
            router.push("/org-selection");
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
        <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                        {success ? (
                            <CheckCircle2Icon className="size-8 text-green-600" />
                        ) : (
                            <MailOpenIcon className="size-8 text-primary" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {success ? "Welcome to the Team!" : "You've Been Invited"}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {success
                            ? "You have successfully joined the organization. Redirecting..."
                            : "You have been invited to join an organization. Click below to accept the invitation and access your new workspace."}
                    </CardDescription>
                </CardHeader>

                {!success && (
                    <CardContent>
                        {error && (
                            <div className="mb-4 flex items-start gap-3 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-4 text-center text-sm text-muted-foreground">
                            {session ? (
                                <>
                                    <p>
                                        Logged in as <strong>{session?.user?.email}</strong>
                                    </p>
                                    <p>
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
                    <CardFooter className="flex gap-3 pb-8">
                        {!session ? (
                            <Button
                                className="w-full"
                                onClick={() => {
                                    router.push(`/sign-in?callbackUrl=/invite/${id}`);
                                }}
                            >
                                Log in to Accept
                            </Button>
                        ) : (
                            <>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={handleDecline}
                                    disabled={isAccepting}
                                >
                                    Decline
                                </Button>
                                <Button
                                    className="w-full"
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
