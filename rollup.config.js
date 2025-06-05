import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

const external = [
  "react",
  "react-dom",
  "react-hook-form",
  "zod",
  "react-leaflet",
  "leaflet",
  "react-google-recaptcha",
  "react-icons",
  "aws-sdk",
];

// TODO: delete all unnecessary .d.ts files in dist folder
export default [
  {
    input: {
      forms: "src/forms/index.ts",
      utils: "src/utils.ts",
      location: "src/location.tsx",
      recaptcha: "src/recaptcha/index.ts",
      files: "src/files/index.tsx",
      filesService: "src/files/service.ts",
      formatters: "src/formatters.ts",
      index: "src/index.ts", // Main entry point
    },
    output: [
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "@tnt/nextools/[name].js",
        // sourcemap: true,
      },
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "@tnt/nextools/[name].cjs",
        // sourcemap: true,
      },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
    external,
  },
  {
    input: {
      forms: "dist/forms/index.d.ts",
      recaptcha: "dist/recaptcha/index.d.ts",
      utils: "dist/utils.d.ts",
      location: "dist/location.d.ts",
      files: "dist/files/index.d.ts",
      filesService: "dist/files/service.d.ts",
      formatter: "dist/formatters.d.ts",
      index: "dist/index.d.ts", // Main entry point
    },
    output: [
      {
        dir: "dist",
        format: "es",
        entryFileNames: "@tnt/nextools/[name].d.ts",
      },
    ],
    plugins: [dts()],
    external,
  },
];
