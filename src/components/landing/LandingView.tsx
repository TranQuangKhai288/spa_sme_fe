import { DefaultLanding } from "./DefaultLanding";

export async function LandingView() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || "default";

  if (tenantId === "default") {
    return <DefaultLanding />;
  }

  try {
    // Dynamically load the custom landing page based on the config
    const CustomLanding = (await import(`@/tenants/${tenantId}/LandingPage`)).default;
    return <CustomLanding />;
  } catch (error) {
    console.error(`Failed to load custom landing page for tenant ${tenantId}`, error);
    // Fallback to default if the file is missing or broken
    return <DefaultLanding />;
  }
}
