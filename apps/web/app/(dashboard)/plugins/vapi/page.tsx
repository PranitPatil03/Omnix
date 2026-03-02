"use client";

import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { VapiView } from "@/modules/plugins/ui/views/vapi-view";
import { SubscriptionGuard } from "@/modules/billing/ui/components/subscription-guard";

const Page = () => {
  return (
    <SubscriptionGuard
      fallback={
        <PremiumFeatureOverlay>
          <VapiView />
        </PremiumFeatureOverlay>
      }
    >
      <VapiView />
    </SubscriptionGuard>
  );
};

export default Page;
