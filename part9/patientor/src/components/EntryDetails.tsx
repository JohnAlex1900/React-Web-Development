// EntryDetails.tsx
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Diagnosis,
} from "../types";

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry, diagnoses }) => {
  const getDiagnosisDescription = (code: string): string | undefined => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : undefined;
  };

  const renderDiagnosisCodes = (codes: Array<string> | undefined) => {
    if (!codes) return null;

    return (
      <List>
        {codes.map((code) => (
          <ListItem
            key={code}
            style={{ display: "list-item", paddingLeft: "16px" }}
          >
            <ListItemText
              primary={`${code} - ${
                getDiagnosisDescription(code) || "Unknown code"
              }`}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderHealthCheckEntry = (entry: HealthCheckEntry) => (
    <Paper elevation={3} style={{ padding: "10px", marginBottom: "10px" }}>
      <Box display="flex" alignItems="center">
        <Typography>{entry.date}</Typography>
        <MedicalServicesIcon style={{ marginLeft: "10px" }} />
        <FavoriteIcon
          style={{
            color: entry.healthCheckRating === 0 ? "green" : "red",
            marginLeft: "auto",
          }}
        />
      </Box>
      <Typography>{entry.description}</Typography>
      {renderDiagnosisCodes(entry.diagnosisCodes)}
      <Typography>designed by {entry.specialist}</Typography>
    </Paper>
  );

  const renderHospitalEntry = (entry: HospitalEntry) => (
    <Paper elevation={3} style={{ padding: "10px", marginBottom: "10px" }}>
      <Box display="flex" alignItems="center">
        <Typography>{entry.date}</Typography>
        <LocalHospitalIcon style={{ marginLeft: "10px" }} />
        <FavoriteIcon style={{ color: "blue", marginLeft: "auto" }} />
      </Box>
      <Typography>{entry.description}</Typography>
      {renderDiagnosisCodes(entry.diagnosisCodes)}
      <Typography>Discharge date: {entry.discharge.date}</Typography>
      <Typography>Discharge criteria: {entry.discharge.criteria}</Typography>
      <Typography>designed by {entry.specialist}</Typography>
    </Paper>
  );

  const renderOccupationalHealthcareEntry = (
    entry: OccupationalHealthcareEntry
  ) => (
    <Paper elevation={3} style={{ padding: "10px", marginBottom: "10px" }}>
      <Box display="flex" alignItems="center">
        <Typography>{entry.date}</Typography>
        <WorkIcon style={{ marginLeft: "10px" }} />
      </Box>
      <Typography>{entry.description}</Typography>
      {renderDiagnosisCodes(entry.diagnosisCodes)}
      <Typography>Employer: {entry.employerName}</Typography>
      {entry.sickLeave && (
        <Typography>
          Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </Typography>
      )}
      <Typography>designed by {entry.specialist}</Typography>
    </Paper>
  );

  switch (entry.type) {
    case "HealthCheck":
      return renderHealthCheckEntry(entry);
    case "Hospital":
      return renderHospitalEntry(entry);
    case "OccupationalHealthcare":
      return renderOccupationalHealthcareEntry(entry);
    default:
      return null;
  }
};

export default EntryDetails;
