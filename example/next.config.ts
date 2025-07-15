import type { NextConfig } from "next";
// import path from "path";

const nextConfig: NextConfig = {
  // webpack: (config, options) => {
  //   config.resolve.alias["nextools"] = path.resolve(
  //     __dirname,
  //     "./node_modules/nextools",
  //   );
  //   return config;
  // },
  // For transpiling external packages (optional):
  transpilePackages: ["nextools"],
};

export default nextConfig;
