import ImageUploader from "./ImageUploader.jsx";

export function ProfileImageUploader(props) {
  return (
    <ImageUploader
      {...props}
      inputId="profile-image-upload"
      label="Photo"
      maxSize={5 * 1024 * 1024}
      maxDimension={512}
      sizeClass="h-24 w-24 rounded-full border-4 border-surface"
      helperText="Recommended: 400 × 400px (1:1 square) · JPG, PNG, GIF or WebP up to 5MB."
    />
  );
}

export function CoverImageUploader(props) {
  return (
    <ImageUploader
      {...props}
      inputId="cover-image-upload"
      label="Cover"
      maxSize={10 * 1024 * 1024}
      maxDimension={1600}
      sizeClass="h-48 w-full"
      helperText="Recommended: 1200 × 300px (4:1 aspect ratio) · JPG, PNG, or WebP up to 10MB · Keep key graphics centered for mobile display."
    />
  );
}
