import typescript from "@rollup/plugin-typescript";

export default {
  input: {
    forms: "src/forms/index.ts",
    utils: "src/utils.ts",
    session: "src/session.ts",
  },
  output: [
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "@tnt/reactools/[name].js",
    },
    {
      dir: "dist",
      format: "cjs",
      entryFileNames: "@tnt/reactools/[name].cjs",
    },
  ],
  plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  external: ["react", "react-dom"],
};
