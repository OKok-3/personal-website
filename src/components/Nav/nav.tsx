import Image from "next/image";
import { getPayload, Payload } from "payload";
import config from "@/payload.config";
import NavDesktop from "./nav_desktop";
import NavMobile from "./nav_mobile";

import type { Nav } from "@/payload-types";

export default async function Nav() {
  const payload: Payload = await getPayload({ config });
  const navGlobal: Nav = await payload.findGlobal({
    slug: "nav",
  });
  const navItems: Nav["items"] = navGlobal.items;

  return (
    <nav className="sticky top-0 left-0 h-16 w-full items-center p-2">
      <div className="relative mx-auto flex h-full w-[95%] items-center rounded-full border-2 border-neutral-100 bg-neutral-50 px-2 drop-shadow-xl drop-shadow-neutral-200/30">
        <div className="relative aspect-square h-full">
          <a href="/" aria-label="Home" className="absolute inset-0">
            <Image
              src="/favicon.png"
              alt="Logo"
              fill
              priority
              sizes="48px"
              className="object-contain"
            />
          </a>
        </div>
        <NavDesktop navItems={navItems} />
        <NavMobile navItems={navItems} />
      </div>
    </nav>
  );
}
