import ImageUploader from "./ImageUploader.jsx";

export function ProfileImageUploader(props) {
  return (
    <ImageUploader
      {...props}
      inputId="profile-image-upload"
      label="Photo"
      maxSize={5 * 1024 * 1024}
      maxDimension={512}
      sizeClass="h-24 w-24 rounded-full border-4 border-white"
      helperText="JPG, PNG, GIF or WebP. Preview only until image upload is enabled."
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
      helperText="JPG, PNG, GIF or WebP. Preview only until image upload is enabled."
    />
  );
}
