import "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import AddEntryForm from "./AddEntryForm";
import { NewEntry } from "../types";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog open={modalOpen} onClose={onClose}>
    <DialogTitle>Add a new entry</DialogTitle>
    <DialogContent>
      {error && <Typography color="error">{`Error: ${error}`}</Typography>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} />
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;
