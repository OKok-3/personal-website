import config from "@/payload.config";
import { getPayload, Payload } from "payload";
import type { AboutPage, Media } from "@/payload-types";
import PageClient from "@/components/PageClient";
import AboutPageClient from "@/components/AboutPage/AboutPageClient";

export default async function About() {
  const payload: Payload = await getPayload({ config });
  const aboutPageGlobal: AboutPage = await payload.findGlobal({
    slug: "about-page",
  });

  const { profilePicture, shortIntroduction, content } = aboutPageGlobal;

  console.log(typeof shortIntroduction);

  return (
    <PageClient
      pageTitle="About"
      pageTagLine="Here is some information about me."
    >
      {/* TODO: Add a prop for content on about page*/}
      <AboutPageClient
        profilePicture={profilePicture as Media}
        shortIntroduction={shortIntroduction}
        content={content}
      />
    </PageClient>
  );
}
