export default function Nav() {
  const items: Array<
    | { href: string; label: string }
    | {
        href: string;
        label: string;
        children: { href: string; label: string }[];
      }
  > = [
    {
      href: "/projects",
      label: "Projects",
      children: [
        { href: "/projects/web-dev", label: "Web Dev" },
        { href: "/projects/data-engineering", label: "Data Engineering" },
        { href: "/projects/self-hosting", label: "Self Hosting" },
      ],
    },
    { href: "/experiences", label: "Experiences" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
  ];
  return (
    <nav className="flex h-14 w-full items-center px-5 pt-5">
      <div className="text-lg font-semibold">Logo</div>
      <ul className="text-md ml-auto flex items-center gap-8 rounded-md border border-neutral-300/50 bg-neutral-200/20 px-6 py-2 text-center backdrop-blur-md">
        {items.map((item) => {
          const hasChildren =
            "children" in item && Array.isArray(item.children);
          return (
            <li key={item.href} className="group relative">
              <a
                href={item.href}
                aria-haspopup={hasChildren ? "true" : undefined}
                aria-expanded={hasChildren ? "false" : undefined}
                className="group/nav relative inline-block cursor-pointer font-medium text-neutral-800 select-none dark:text-neutral-100"
              >
                <span>{item.label}</span>
                <span className="pointer-events-none absolute -bottom-0.5 left-1/2 block h-[1.3px] w-[100%] origin-center -translate-x-1/2 scale-x-0 rounded-full bg-neutral-500/0 transition-all duration-500 ease-in-out group-hover/nav:scale-x-100 group-hover/nav:bg-neutral-500 dark:bg-neutral-100" />
              </a>
              {hasChildren && (
                <ul className="invisible absolute top-full left-0 z-20 mt-2 flex w-48 flex-col gap-1 rounded-md border border-neutral-200/70 bg-white/80 p-2 text-left opacity-0 shadow-sm backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-900/80">
                  {item.children!.map((child) => (
                    <li key={child.href}>
                      <a
                        href={child.href}
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
