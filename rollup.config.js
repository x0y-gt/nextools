import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

const external = [
  "react",
  "react-dom",
  "react-hook-form",
  "zod",
  "iron-session",
  "node-ipinfo",
  "react-google-recaptcha",
];

// TODO: delete all unnecessary .d.ts files in dist folder
export default [
  {
    input: {
      forms: "src/forms/index.ts",
      utils: "src/utils.ts",
      session: "src/session.ts",
      auth: "src/auth.ts",
      location: "src/location.ts",
      recaptcha: "src/recaptcha/index.ts",
      index: "src/index.ts", // Main entry point
    },
    output: [
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "@tnt/nextools/[name].js",
        sourcemap: true,
      },
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "@tnt/nextools/[name].cjs",
        sourcemap: true,
      },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
    external,
  },
  // {
  //   input: "src/index.ts",
  //   output: [
  //     {
  //       file: "dist/@tnt/nextools/index.js",
  //       format: "es",
  //     },
  //   ],
  //   plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  //   external,
  // },
  {
    input: {
      forms: "dist/forms/index.d.ts",
      recaptcha: "dist/recaptcha/index.d.ts",
      utils: "dist/utils.d.ts",
      session: "dist/session.d.ts",
      auth: "dist/auth.d.ts",
      location: "dist/location.d.ts",
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
