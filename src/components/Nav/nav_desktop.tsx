import React from "react";
import type { Nav } from "@/payload-types";

interface NavProp {
  navItems: Nav["items"];
}

export default function NavDesktop(props: NavProp) {
  const { navItems } = props;

  return (
    <div className="md:group hidden h-full items-center md:ml-auto md:flex md:gap-6 md:pr-2">
      {navItems.map((item, index) => (
        <a
          key={index}
          href={item.path}
          target={item.openInNewTab ? "_blank" : "_self"}
          rel={item.openInNewTab ? "noopener noreferrer" : ""}
          className="group relative"
        >
          <span>{item.label}</span>
          <span className="absolute -bottom-0.5 left-1/2 block h-[1.4px] w-full origin-center -translate-x-1/2 scale-x-0 bg-neutral-500/0 transition-all duration-300 ease-in-out group-hover:scale-x-100 group-hover:bg-neutral-500" />
        </a>
      ))}
    </div>
  );
}
