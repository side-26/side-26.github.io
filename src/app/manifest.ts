import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mahdi Rashidi — Full-Stack Developer",
    short_name: "Mahdi Rashidi",
    description:
      "A full-stack developer portfolio focused on dependable product delivery and clear technical ownership.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    icons: [
      {
        src: "/logo/logo.jpg",
        sizes: "1254x1254",
        type: "image/jpeg",
      },
    ],
  };
}
