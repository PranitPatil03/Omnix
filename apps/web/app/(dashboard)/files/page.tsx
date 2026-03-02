"use client";

import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { FilesView } from "@/modules/files/ui/views/files-view";
import { SubscriptionGuard } from "@/modules/billing/ui/components/subscription-guard";

const Page = () => {
  return (
    <SubscriptionGuard
      fallback={
        <PremiumFeatureOverlay>
          <FilesView />
        </PremiumFeatureOverlay>
      }
    >
      <FilesView />
    </SubscriptionGuard>
  );
};

export default Page;
