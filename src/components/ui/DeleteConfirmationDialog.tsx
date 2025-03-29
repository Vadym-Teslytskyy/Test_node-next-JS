"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DeleteConfirmationDialogProps = {
  onConfirm: () => void;
  trigger: React.ReactElement; // The element that triggers the dialog (e.g. a button)
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
};

/**
 * DeleteConfirmationDialog
 *
 * A reusable confirmation dialog for deletion actions.
 *
 * @param onConfirm - Callback to invoke when the deletion is confirmed.
 * @param trigger - The element that triggers the dialog.
 * @param title - Dialog title.
 * @param description - Dialog description.
 * @param cancelText - Text for the cancel button.
 * @param confirmText - Text for the confirm button.
 */
const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  onConfirm,
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the record.",
  cancelText = "Cancel",
  confirmText = "Continue",
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
