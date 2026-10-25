import { createSocialImage, socialImageSize } from "@/lib/social-image";

export const dynamic = "force-static";
export const alt = "Mahdi Rashidi — one accountable full-stack builder for the whole product";
export const size = socialImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createSocialImage();
}
