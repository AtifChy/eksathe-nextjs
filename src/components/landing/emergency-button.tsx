"use client";

import { PhoneIcon } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EmergencyButton() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <Button type="button" variant="destructive" size="lg" onClick={() => setOpen(true)}>
        <PhoneIcon />
        {t.emergency.buttonLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.emergency.modalTitle}</DialogTitle>
            <DialogDescription>{t.emergency.modalSubtitle}</DialogDescription>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">{t.emergency.modalDescription}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
