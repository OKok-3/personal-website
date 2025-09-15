import config from "@/payload.config";
import { getPayload, Payload } from "payload";
import NavClient from "./NavClient";

import type { Nav } from "@/payload-types";

export default async function Nav() {
  const payload: Payload = await getPayload({ config });
  const navGlobal: Nav = await payload.findGlobal({
    slug: "nav",
  });
  const navItems: Nav["items"] = navGlobal.items;

  return <NavClient navItems={navItems} />;
}
