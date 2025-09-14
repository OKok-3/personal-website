import { getPayload, Payload } from "payload";
import config from "@/payload.config";
import type { LandingPage } from "@/payload-types";
import HomePageClient from "@/components/HomePageClient";

export default async function Home() {
  const payload: Payload = await getPayload({ config });
  const homePageGlobal: LandingPage = await payload.findGlobal({
    slug: "landing-page",
  });

  const content = homePageGlobal.content?.[0];
  if (!content) {
    return <div>Ooops, there seems to be a problem.</div>;
  }

  return <HomePageClient content={content} />;
}
