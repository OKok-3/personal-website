import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Ensure native libsql bindings are available at runtime when using standalone output
  serverExternalPackages: ["libsql", "@libsql/*"],
};

export default withPayload(nextConfig);
