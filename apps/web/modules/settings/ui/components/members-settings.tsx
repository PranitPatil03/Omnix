"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useActiveOrganization,
  organization,
  useSession,
} from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Badge } from "@workspace/ui/components/badge";
import {
  Loader2Icon,
  MailIcon,
  Trash2Icon,
  UserPlusIcon,
  ShieldIcon,
  CrownIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

type Role = "owner" | "admin" | "member";

interface Member {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  owner: <CrownIcon className="size-3" />,
  admin: <ShieldIcon className="size-3" />,
  member: <UserIcon className="size-3" />,
};

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
};

export const MembersSettings = () => {
  const { data: activeOrg } = useActiveOrganization();
  const { data: session } = useSession();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  // Members state
  const [membersData, setMembersData] = useState<any>(null);
  const [membersLoading, setMembersLoading] = useState(true);

  // Invitations state
  const [invitationsData, setInvitationsData] = useState<any[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(true);

  // Stable org ID to avoid infinite re-renders from object reference changes
  const orgId = activeOrg?.id;

  const fetchMembers = useCallback(async () => {
    if (!orgId) return;
    setMembersLoading(true);
    try {
      const res = await organization.getFullOrganization({
        query: { organizationId: orgId },
      });
      setMembersData(res.data);
    } catch {
      // ignore
    } finally {
      setMembersLoading(false);
    }
  }, [orgId]);

  const fetchInvitations = useCallback(async () => {
    if (!orgId) return;
    setInvitationsLoading(true);
    try {
      const res = await organization.listInvitations({
        query: { organizationId: orgId },
      });
      setInvitationsData((res.data as any) ?? []);
    } catch {
      // ignore
    } finally {
      setInvitationsLoading(false);
    }
  }, [orgId]);

  const subscription = useQuery(api.private.subscriptions.getStatus);
  const isActive = subscription?.status === "active";

  useEffect(() => {
    fetchMembers();
    fetchInvitations();
  }, [fetchMembers, fetchInvitations]);

  const refetchMembers = fetchMembers;
  const refetchInvitations = fetchInvitations;

  const members: Member[] = (membersData as any)?.members ?? [];
  const invitations: Invitation[] = (invitationsData ?? []).filter(
    (inv: Invitation) => inv.status === "pending"
  );

  const currentUserId = session?.user?.id;
  const currentMember = members.find((m) => m.userId === currentUserId);
  const isOwner = currentMember?.role === "owner";
  const isAdmin = currentMember?.role === "admin" || isOwner;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg || !inviteEmail.trim()) return;

    // Check plan limits (Free plan is limited to 1 member total)
    if (!isActive && (members.length + invitations.length) >= 1) {
      setInviteError("Free plan is limited to 1 member. Let's upgrade you to Pro!");
      return;
    }

    setInviting(true);
    setInviteError("");
    setInviteSuccess("");

    try {
      await organization.inviteMember({
        organizationId: activeOrg.id,
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteSuccess(`Invitation sent to ${inviteEmail.trim()}`);
      setInviteEmail("");
      setTimeout(() => setInviteSuccess(""), 5000);
      refetchInvitations();
    } catch (err: any) {
      setInviteError(
        err?.message || "Failed to send invitation. Make sure the email is valid."
      );
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!activeOrg) return;
    try {
      await organization.removeMember({
        organizationId: activeOrg.id,
        memberIdOrEmail: memberId,
      });
      refetchMembers();
    } catch (err: any) {
      alert(err?.message || "Failed to remove member");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!activeOrg) return;
    try {
      await organization.cancelInvitation({
        invitationId,
      });
      refetchInvitations();
    } catch (err: any) {
      alert(err?.message || "Failed to cancel invitation");
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!activeOrg) return;
    try {
      await organization.updateMemberRole({
        organizationId: activeOrg.id,
        memberId,
        role: newRole as Role,
      });
      refetchMembers();
    } catch (err: any) {
      alert(err?.message || "Failed to update role");
    }
  };

  if (!activeOrg) return null;

  return (
    <div className="space-y-6">
      {/* Invite Member */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlusIcon className="size-5" />
              Invite Team Member
            </CardTitle>
            <CardDescription>
              Send an invitation to add a new member to your organization.
              They&apos;ll receive an email to join.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@example.com"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(v) => setInviteRole(v as Role)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {isOwner && (
                        <SelectItem value="owner">Owner</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {inviteError && (
                <p className="text-sm text-destructive">{inviteError}</p>
              )}
              {inviteSuccess && (
                <p className="text-sm text-green-600">{inviteSuccess}</p>
              )}

              <Button
                type="submit"
                disabled={inviting || !inviteEmail.trim()}
              >
                {inviting ? (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                ) : (
                  <MailIcon className="mr-2 size-4" />
                )}
                Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      {isAdmin && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Invitations that haven&apos;t been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {inv.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Copy Invitation Link"
                          onClick={() => {
                            const url = `${window.location.origin}/invite/${inv.id}`;
                            navigator.clipboard.writeText(url).then(() => {
                              toast.success("Invite link copied!", {
                                description: "Share this link with your team member to join.",
                              });
                            }).catch(() => {
                              toast.error("Failed to copy link.");
                            });
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Cancel Invitation"
                          onClick={() => handleCancelInvitation(inv.id)}
                        >
                          <XIcon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {members.length} member{members.length !== 1 ? "s" : ""} in this
            organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {membersLoading || invitationsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : members.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No members found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  {isAdmin && <TableHead className="w-20"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {member.user.name}
                          {member.userId === currentUserId && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {member.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin && member.role !== "owner" && member.userId !== currentUserId ? (
                        <Select
                          value={member.role}
                          onValueChange={(v) =>
                            handleRoleChange(member.id, v)
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant={
                            roleBadgeVariant[member.role] ?? "outline"
                          }
                          className="capitalize gap-1"
                        >
                          {roleIcons[member.role]}
                          {member.role}
                        </Badge>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        {member.role !== "owner" &&
                          member.userId !== currentUserId && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2Icon className="size-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Remove Member
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove{" "}
                                    <strong>{member.user.name}</strong> from
                                    this organization? They will lose access
                                    immediately.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleRemoveMember(member.id)
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
