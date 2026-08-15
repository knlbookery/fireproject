import { useState } from "react";
import { Heart, Lock } from "lucide-react";

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

/**
 * Programme-scoped donation box. The selected programme is passed to Zeffy as
 * campaign metadata so the gift is attributed to what the donor chose to support.
 */
export function ProgramDonateDialog({
  programSlug,
  programTitle,
  triggerClassName,
  triggerLabel = "Donate to this programme",
}: {
  programSlug: string;
  programTitle: string;
  triggerClassName?: string;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  const src = `${ZEFFY_FORM}?utm_source=website&utm_medium=program-card&utm_campaign=${encodeURIComponent(
    programSlug,
  )}&designation=${encodeURIComponent(programTitle)}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={triggerClassName ?? BTN.primary}>
        <Heart className="h-4 w-4" aria-hidden="true" />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">
            Support {programTitle}
          </DialogTitle>
          <DialogDescription>
            Your gift is tagged to {programTitle} so it funds this programme directly.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Processed securely by Zeffy with zero platform fees — 100% of your donation reaches the
            programme.
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
      </DialogContent>
    </Dialog>
  );
}
