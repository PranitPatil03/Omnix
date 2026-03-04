interface BusinessInfo {
  companyName?: string;
  website?: string;
  industry?: string;
  description?: string;
  productsAndServices?: string;
  supportEmail?: string;
  supportPhone?: string;
  businessHours?: string;
  returnPolicy?: string;
  additionalContext?: string;
}

export function buildBusinessContext(
  businessInfo: BusinessInfo | null | undefined,
): string | null {
  if (!businessInfo) return null;

  const lines: string[] = [];

  lines.push("## Business Information");
  lines.push(
    "Use this information to provide accurate, company-specific answers. " +
    "Always prefer this data over generic responses.",
  );
  lines.push("");

  if (businessInfo.companyName) {
    lines.push(`**Company Name:** ${businessInfo.companyName}`);
  }
  if (businessInfo.website) {
    lines.push(`**Website:** ${businessInfo.website}`);
  }
  if (businessInfo.industry) {
    lines.push(`**Industry:** ${businessInfo.industry}`);
  }
  if (businessInfo.description) {
    lines.push(`**About the Business:** ${businessInfo.description}`);
  }
  if (businessInfo.productsAndServices) {
    lines.push(
      `**Products & Services:** ${businessInfo.productsAndServices}`,
    );
  }
  if (businessInfo.supportEmail) {
    lines.push(`**Support Email:** ${businessInfo.supportEmail}`);
  }
  if (businessInfo.supportPhone) {
    lines.push(`**Support Phone:** ${businessInfo.supportPhone}`);
  }
  if (businessInfo.businessHours) {
    lines.push(`**Business Hours:** ${businessInfo.businessHours}`);
  }
  if (businessInfo.returnPolicy) {
    lines.push(`**Return/Refund Policy:** ${businessInfo.returnPolicy}`);
  }
  if (businessInfo.additionalContext) {
    lines.push("");
    lines.push("### Additional Context");
    lines.push(businessInfo.additionalContext);
  }

  // Only return if we actually have some data beyond the header
  const hasData = Object.entries(businessInfo).some(
    ([key, value]) =>
      key !== "organizationId" &&
      key !== "_id" &&
      key !== "_creationTime" &&
      typeof value === "string" &&
      value.trim().length > 0,
  );

  return hasData ? lines.join("\n") : null;
}
