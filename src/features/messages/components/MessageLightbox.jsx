import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function MessageLightbox({ image, onClose }) {
  return (
    <Dialog
      open={Boolean(image)}
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <DialogContent className="max-w-3xl p-3 sm:p-4">
        <DialogHeader>
          <DialogTitle className="truncate text-xs sm:text-sm font-semibold">
            {image?.name || "Image preview"}
          </DialogTitle>
        </DialogHeader>
        {image?.url && (
          <div className="mt-1 flex max-h-[75dvh] items-center justify-center overflow-hidden rounded-lg bg-black/5 dark:bg-black/40">
            <img
              src={image.url}
              alt={image.name || "Preview"}
              className="max-h-[72dvh] w-auto max-w-full object-contain rounded-md"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
