import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, List, Button } from "@mui/material";
import { Male, Female, Transgender } from "@mui/icons-material";

import patientService from "../services/patients";
import { Patient, Gender, Entry, Diagnosis, NewEntry } from "../types";
import EntryDetails from "./EntryDetails";
import AddEntryModal from "./AddEntryModal";

interface PatientDetailPageProps {
  diagnoses: Diagnosis[];
}

const PatientDetailPage = ({ diagnoses }: PatientDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getPatientById(id);
        setPatient(fetchedPatient);
      }
    };
    if (id) {
      void fetchPatient();
    }
  }, [id]);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: NewEntry) => {
    if (!id) return;
    try {
      const updatedPatient = await patientService.addEntry(id, values);
      setPatient(updatedPatient);
      closeModal();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4">
        {patient.name} {patient.gender === Gender.Male && <Male />}
        {patient.gender === Gender.Female && <Female />}
        {patient.gender === Gender.Other && <Transgender />}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography variant="h4" style={{ marginTop: "1em" }}>
        Entries
      </Typography>
      <List>
        {patient.entries.map((entry: Entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </List>
      <AddEntryModal
        modalOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submitNewEntry}
        error={error}
      />
      <Button variant="contained" color="primary" onClick={openModal}>
        Add New Entry
      </Button>
    </Box>
  );
};

export default PatientDetailPage;
