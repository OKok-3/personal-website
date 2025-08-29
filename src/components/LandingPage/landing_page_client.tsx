import Link from "next/link";
import Image from "next/image";
import type { LandingPage, Icon } from "@/payload-types";

export default function LandingPageClient(props: {
  content: LandingPage["content"][0];
}) {
  const { h1, h2, description, location, socials } = props.content;

  return (
    <div className="align-center flex h-full max-w-full flex-col px-8 pt-[18vh] md:px-20 lg:max-w-280 lg:pt-[25dvh] lg:pl-60">
      <h1 className="text-2xl font-semibold lg:text-4xl">{h1}</h1>
      <h2 className="mt-2 text-xl lg:mt-4 lg:text-2xl">{h2}</h2>
      <p className="mt-4 text-sm text-neutral-400 lg:text-lg">{description}</p>
      <div className="mt-10 flex items-center gap-5">
        {socials?.map((social) => (
          <div key={social.platform} className="relative aspect-square h-6">
            <Link
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center"
              aria-label={`${social.platform} profile`}
            >
              <Image
                src={(social.icon as Icon).url || ""}
                alt={`${social.platform} icon`}
                fill
                priority={true}
                sizes="1px"
                className="opacity-70 transition-all duration-300 ease-in-out group-hover:opacity-50"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
