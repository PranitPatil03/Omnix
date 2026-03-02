"use client";

import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { CustomizationView } from "@/modules/customization/ui/views/customization-view";
import { SubscriptionGuard } from "@/modules/billing/ui/components/subscription-guard";

const Page = () => {
  return (
    <SubscriptionGuard
      fallback={
        <PremiumFeatureOverlay>
          <CustomizationView />
        </PremiumFeatureOverlay>
      }
    >
      <CustomizationView />
    </SubscriptionGuard>
  )
};

export default Page;
