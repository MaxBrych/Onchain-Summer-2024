import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[name][ext]",
      },
    });

    if (isServer) {
      config.output.webassemblyModuleFilename = "static/chunks/[name].wasm";
    } else {
      config.optimization.moduleIds = "named";
    }

    return config;
  },
};

export default nextConfig;
