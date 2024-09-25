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
    },
    output: [
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "@tnt/nextools/[name].js",
      },
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "@tnt/nextools/[name].cjs",
      },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
    external,
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/@tnt/nextools/index.js",
        format: "es",
      },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
    external,
  },
  {
    input: "dist/@tnt/nextools/index.d.ts", // Point to a single entry for declaration
    output: {
      file: "dist/@tnt/nextools/types.d.ts", // Single output .d.ts file
      format: "es",
    },
    plugins: [dts()],
  },
];
