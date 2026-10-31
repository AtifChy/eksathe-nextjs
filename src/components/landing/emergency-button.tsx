"use client";

import { useState } from "react";
import { PhoneIcon } from "lucide-react";

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

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="lg"
        onClick={() => setOpen(true)}
      >
        <PhoneIcon />
        জরুরি সহায়তা 100
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>জরুরি সহায়তা</DialogTitle>
            <DialogDescription>
              এই বাটনটি স্বয়ংক্রিয়ভাবে কল করে না।
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            জরুরি সহায়তার জন্য আপনার এলাকার যাচাইকৃত সরকারি জরুরি নম্বরে সরাসরি
            যোগাযোগ করুন।
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
