import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KeyGlass — Online Keyboard Tester",
    short_name: "KeyGlass",
    description:
      "Test every key on Mac, Windows, Linux, mechanical, laptop, and mobile keyboards online with real-time NKRO, chatter detection, and keycode inspection.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f9fc",
    theme_color: "#0071e3",
    categories: ["utilities", "productivity", "developer tools"],
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
