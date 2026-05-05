// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

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
  },
});
