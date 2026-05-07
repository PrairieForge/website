// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { loadEnv } from "vite";

// For Local Dev, set NGROK_HOST from .env
const { NGROK_HOST } = loadEnv("", process.cwd(), "");

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Bebas Neue",
      cssVariable: "--font-sans",
    },
    {
      provider: fontProviders.google(),
      name: "Lora",
      cssVariable: "--font-serif",
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [NGROK_HOST],
    },
  },
});
