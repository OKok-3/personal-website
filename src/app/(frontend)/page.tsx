import Image from "next/image";
import "./globals.css";

export default function Home() {
  return (
    <div className="align-center flex h-full max-w-full flex-col px-8 pt-[18vh]">
      <h1 className="text-2xl font-semibold">Hi, my name is Daniel</h1>
      <h2 className="mt-2 text-xl">
        Engineering solutions, learning along the way in tech and finance.
      </h2>
      <p className="mt-4 text-sm text-neutral-400">
        I'm Daniel, and I enjoy working with code, data, and infrastructure to
        build systems that solve real problems. My curiosity drives me to
        explore quantitative finance alongside technology, creating tools that
        are both scalable and insightful.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <div>
          <a
            href="https://www.github.com/OKok-3"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center"
            aria-label="LinkedIn profile"
          >
            <Image
              src="/logos/github.svg"
              alt="GitHub"
              width={24}
              height={24}
              className="opacity-70 transition-all duration-300 ease-in-out group-hover:opacity-50"
            />
          </a>
        </div>
        <div>
          <a
            href="https://www.linkedin.com/in/tong-g"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center"
            aria-label="GitHub profile"
          >
            <Image
              src="/logos/linkedin.svg"
              alt="LinkedIn"
              width={24}
              height={24}
              className="opacity-70 transition-all duration-300 ease-in-out group-hover:opacity-50"
            />
          </a>
        </div>
        <div>
          <a
            href="mailto:tguan29@uwo.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center"
            aria-label="Email address"
          >
            <Image
              src="/icons/email.svg"
              alt="Email"
              width={28}
              height={28}
              className="opacity-70 transition-all duration-300 ease-in-out group-hover:opacity-50"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
