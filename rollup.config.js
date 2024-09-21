import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
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
  plugins: [typescript({ tsconfig: "./tsconfig.json" }), commonjs()],
  external: [
    "react",
    "react-dom",
    "react-hook-form",
    "zod",
    "iron-session",
    "node-ipinfo",
    "react-google-recaptcha",
  ],
};
