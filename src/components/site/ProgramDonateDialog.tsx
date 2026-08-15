import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Heart, Lock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BTN } from "@/components/site/ui";

const ZEFFY_FORM = "https://www.zeffy.com/embed/donation-form/give-inspiration-that-changes-lives";
const ZEFFY_ORIGIN = "https://www.zeffy.com";

/** Zeffy posts a completion message from the embedded form's origin. */
function isZeffySuccess(event: MessageEvent): boolean {
  if (!event.origin.startsWith(ZEFFY_ORIGIN)) return false;
  const raw = event.data;
  const text =
    typeof raw === "string" ? raw : raw && typeof raw === "object" ? JSON.stringify(raw) : "";
  return /(payment|donation|checkout).{0,24}(success|complete|succeed)|thank[-_ ]?you/i.test(text);
}

/**
 * Programme-scoped donation box. The selected programme is passed to Zeffy as
 * campaign metadata so the gift is attributed to what the donor chose to
 * support; Zeffy's webhook (/api/zeffy-webhook.php) then records the gift and
 * the programme's live funding figures refresh via onCompleted.
 */
export function ProgramDonateDialog({
  programSlug,
  programTitle,
  triggerClassName,
  triggerLabel = "Donate to this programme",
  onCompleted,
}: {
  programSlug: string;
  programTitle: string;
  triggerClassName?: string;
  triggerLabel?: string;
  onCompleted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  const src = `${ZEFFY_FORM}?utm_source=website&utm_medium=program-card&utm_campaign=${encodeURIComponent(
    programSlug,
  )}&designation=${encodeURIComponent(programTitle)}`;

  const handleCompleted = useCallback(() => {
    setCompleted(true);
    // The webhook lands a moment after the donor sees the confirmation, so
    // give the ledger a beat before pulling the refreshed totals.
    window.setTimeout(() => onCompleted?.(), 2500);
  }, [onCompleted]);

  // Zeffy iframe callback.
  useEffect(() => {
    if (!open) return;
    const listener = (event: MessageEvent) => {
      if (isZeffySuccess(event)) handleCompleted();
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [open, handleCompleted]);

  // Redirect-style return: /programs?donation=success&programme=<slug>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("donation") !== "success") return;
    const returned = params.get("programme") ?? params.get("program");
    if (returned && returned !== programSlug) return;
    setCompleted(true);
    setOpen(true);
    onCompleted?.();
  }, [programSlug, onCompleted]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setCompleted(false);
      }}
    >
      <DialogTrigger className={triggerClassName ?? BTN.primary}>
        <Heart className="h-4 w-4" aria-hidden="true" />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">
            {completed ? `Thank you for backing ${programTitle}` : `Support ${programTitle}`}
          </DialogTitle>
          <DialogDescription>
            {completed
              ? "Your gift is confirmed. It's now counted towards this programme's funding on this page."
              : `Your gift is tagged to ${programTitle} so it funds this programme directly.`}
          </DialogDescription>
        </DialogHeader>

        {completed ? (
          <div
            role="status"
            className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-5 text-sm"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-muted-foreground">
              A receipt is on its way from Zeffy. The {programTitle} totals shown on this page update
              as soon as the gift settles.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Processed securely by Zeffy with zero platform fees — 100% of your donation reaches
                the programme.
              </span>
            </div>

            {open && (
              <iframe
                title={`Donation form for ${programTitle}`}
                src={src}
                allow="payment"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                className="mt-4 h-[70vh] min-h-[520px] w-full rounded-2xl border-0"
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
