import Image from "next/image";
import { Payload, getPayload } from "payload";
import config from "@/payload.config";

type NavItem = {
  label: string;
  path: string;
  openInNewTab: boolean;
  acl: string;
  subItems: NavItem[];
};

type NavGlobal = {
  items: NavItem[];
};

export default async function Nav() {
  const payload: Payload = await getPayload({ config });
  const navGlobal: NavGlobal = await payload.findGlobal({
    slug: "nav",
  });
  const navItems: NavItem[] = navGlobal.items;

  return (
    <nav className="flex h-16 w-full items-center px-5 pt-5">
      <div className="relative aspect-square h-full max-h-12 shrink-0 overflow-hidden rounded-full transition-colors duration-300 ease-in-out hover:bg-neutral-200/50">
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
      <ul className="text-md ml-auto flex items-center gap-8 rounded-md border border-neutral-300/50 bg-neutral-200/20 px-6 py-2 text-center backdrop-blur-md">
        {navItems.map((item) => {
          const hasChildren = item.subItems.length > 0;
          return (
            <li key={item.path} className="group relative">
              <a
                href={item.path}
                target={item.openInNewTab ? "_blank" : "_self"}
                className="group/nav relative inline-block cursor-pointer font-medium text-neutral-800 select-none dark:text-neutral-100"
              >
                <span>{item.label}</span>
                <span className="pointer-events-none absolute -bottom-0.5 left-1/2 block h-[1.3px] w-[100%] origin-center -translate-x-1/2 scale-x-0 rounded-full bg-neutral-500/0 transition-all duration-500 ease-in-out group-hover/nav:scale-x-100 group-hover/nav:bg-neutral-500 dark:bg-neutral-100" />
              </a>
              {hasChildren && (
                <ul className="invisible absolute top-full left-0 z-20 mt-2 flex w-48 flex-col gap-1 rounded-md border border-neutral-200/70 bg-white/80 p-2 text-left opacity-0 shadow-sm backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-900/80">
                  {item.subItems!.map((child) => (
                    <li key={child.path}>
                      <a
                        href={child.path}
                        target={child.openInNewTab ? "_blank" : "_self"}
                        className="block rounded-sm px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus:bg-neutral-800"
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
