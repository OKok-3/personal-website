import "./globals.css";
import { getPayload, Payload } from "payload";
import config from "@/payload.config";
import type { LandingPage } from "@/payload-types";
import LandingPageClient from "@/components/LandingPageClient";

export default async function Home() {
  const payload: Payload = await getPayload({ config });
  const landingPageGlobal: LandingPage = await payload.findGlobal({
    slug: "landing-page",
  });

  const content = landingPageGlobal.content?.[0];
  if (!content) {
    return <div>Ooops, there seems to be a problem.</div>;
  }

  return <LandingPageClient content={content} />;
}
