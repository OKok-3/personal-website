import { getPayload, Payload } from "payload";
import config from "@/payload.config";
import { HomePageClient } from "@/components/PageClient";

import type { HomePage } from "@/payload-types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const payload: Payload = await getPayload({ config });
  const homePageGlobal: HomePage = await payload.findGlobal({
    slug: "home-page",
    depth: 2,
  });

  const content = homePageGlobal.content?.[0];
  if (!content) {
    return <div>Ooops, there seems to be a problem.</div>;
  }

  return <HomePageClient content={content} />;
}
