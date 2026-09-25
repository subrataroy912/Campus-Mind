import { useState } from "react";
import { Check, Clock, Copy, Link2, RefreshCw, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useGenerateInviteLinkMutation } from "../api/classroomApi.js";
import { parseApiError } from "@/lib/errorUtils.js";

function formatExpiry(expiresAt) {
  if (!expiresAt) return "Expires in 48 hours";
  try {
    const target = new Date(expiresAt).getTime();
    const diffMs = target - Date.now();
    if (diffMs <= 0) return "Expired";
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (hours < 24) return `Expires in ${hours} hour${hours === 1 ? "" : "s"}`;
    const days = Math.ceil(hours / 24);
    return `Expires in ${days} day${days === 1 ? "" : "s"}`;
  } catch {
    return "Expires in 48 hours";
  }
}

export function InviteLinkModal({ isOpen, onClose, classroom }) {
  const [copied, setCopied] = useState(false);
  const [localToken, setLocalToken] = useState(null);
  const [localExpiresAt, setLocalExpiresAt] = useState(null);

  const [generateInviteLink, { isLoading: isGenerating }] =
    useGenerateInviteLinkMutation();

  const token = localToken || classroom?.inviteToken || classroom?.code || "";
  const expiresAt = localExpiresAt || classroom?.inviteExpiresAt;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const inviteUrl = token ? `${origin}/join?invite=${encodeURIComponent(token)}` : "";

  const handleCopy = () => {
    if (!inviteUrl) return;
    navigator.clipboard?.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    toast.add({
      title: "Link copied",
      description: "Invite link copied to clipboard.",
      type: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!classroom?.id) return;
    try {
      const res = await generateInviteLink(classroom.id).unwrap();
      if (res?.token) {
        setLocalToken(res.token);
        setLocalExpiresAt(res.expiresAt);
      }
      toast.add({
        title: "New link generated",
        description: "Previous invitation links have been invalidated.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Generation failed",
        description: parseApiError(err, "Failed to generate new invitation link.").message,
        type: "error",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-5">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Space Invitation Link
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Share this link with invited members. Links expire after 48 hours.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-3 space-y-3.5">
          {/* Link box */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Invite URL
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-mono text-foreground"
              />
              <Button
                size="sm"
                onClick={handleCopy}
                disabled={!inviteUrl}
                className="gap-1.5 text-xs h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Expiration badge */}
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground border border-border/60">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{formatExpiry(expiresAt)}</span>
          </div>

          {/* Warning notice */}
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>
              Generating a new link immediately deactivates previous links for this space.
            </span>
          </div>

          {/* Revoke & Refresh button */}
          <div className="flex justify-between items-center pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Generating…" : "Revoke & Generate New Link"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs h-8"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
