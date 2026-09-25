import ImageUploader from "./ImageUploader.jsx";
import { IMAGE_PROFILES, MAX_RAW_IMAGE_BYTES } from "@/utils/optimizeImage.js";

export function ProfileImageUploader(props) {
  return (
    <ImageUploader
      {...props}
      inputId="profile-image-upload"
      label="Photo"
      preset={IMAGE_PROFILES.AVATAR}
      maxSize={MAX_RAW_IMAGE_BYTES}
      maxDimension={400}
      sizeClass="h-24 w-24 rounded-full border-4 border-surface"
      helperText="Auto-optimized to 400 × 400px (1:1 square, < 20 KB WebP) · Accepts raw photos up to 20 MB."
    />
  );
}

export function CoverImageUploader(props) {
  return (
    <ImageUploader
      {...props}
      inputId="cover-image-upload"
      label="Cover"
      preset={IMAGE_PROFILES.HERO_BANNER}
      maxSize={MAX_RAW_IMAGE_BYTES}
      maxDimension={1920}
      sizeClass="h-48 w-full"
      helperText="Auto-optimized to 1920 × 1080px (16:9 banner, ≤ 250 KB WebP) · Accepts raw photos up to 20 MB."
    />
  );
}
