import { InviteView } from "@/modules/settings/ui/views/invite-view";

export default async function InvitePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <InviteView id={id} />;
}
