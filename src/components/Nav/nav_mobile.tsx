"use client";

import React from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { NavItem } from "@/types/nav";

interface NavMobileProp {
  navItems: NavItem[];
}

export default function NavMobile(props: NavMobileProp) {
  const { navItems } = props;
  const [docMounted, setDocMounted] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setDocMounted(true);
  });

  return (
    <div className="flex h-full w-full flex-col items-center md:hidden">
      <div
        className="relative mt-auto mr-4 mb-auto ml-auto aspect-square h-full md:hidden"
        onClick={() => {
          setMenuOpen(true);
        }}
      >
        <Image
          src="/icons/menu.svg"
          alt="Menu Button Image"
          fill
          priority
          sizes="1px"
          className="object-contain p-2"
        />
      </div>
      {docMounted &&
        menuOpen &&
        ReactDOM.createPortal(
          <ul
            className="absolute top-0 left-0 flex min-h-[100dvh] w-screen flex-col items-center justify-between bg-neutral-50/50 py-[25dvh] backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          >
            {navItems.map((item) => (
              <li key={item.path}>
                <a href={item.path} className="text-2xl font-medium">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
