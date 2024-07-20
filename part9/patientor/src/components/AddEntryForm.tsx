import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Diagnosis, NewEntry, EntryType, HealthCheckRating } from "../types";
import { getDiagnoses } from "../services/diagnoses";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
}

const entryTypes: EntryType[] = [
  "Hospital",
  "OccupationalHealthcare",
  "HealthCheck",
];

const healthCheckRatings: { [key in HealthCheckRating]: string } = {
  0: "Healthy",
  1: "Low Risk",
  2: "High Risk",
  3: "Critical Risk",
};

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [type, setType] = useState<EntryType>("Hospital");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<
    HealthCheckRating | undefined
  >();
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const diagnosesData = await getDiagnoses();
        setDiagnoses(diagnosesData);
      } catch (error) {
        setError("Failed to load diagnoses");
      }
    };
    fetchDiagnoses();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let entry: NewEntry;

    switch (type) {
      case "HealthCheck":
        entry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          healthCheckRating: healthCheckRating ?? HealthCheckRating.Healthy,
        };
        break;
      case "OccupationalHealthcare":
        entry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          employerName,
          sickLeave:
            sickLeaveStartDate && sickLeaveEndDate
              ? { startDate: sickLeaveStartDate, endDate: sickLeaveEndDate }
              : undefined,
        };
        break;
      case "Hospital":
        entry = {
          type,
          description,
          date,
          specialist,
          diagnosisCodes,
          discharge:
            dischargeDate && dischargeCriteria
              ? { date: dischargeDate, criteria: dischargeCriteria }
              : undefined,
        };
        break;
      default:
        throw new Error("Invalid entry type");
    }

    onSubmit(entry);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <FormControl fullWidth margin="normal">
        <InputLabel id="entry-type-label">Entry Type</InputLabel>
        <Select
          labelId="entry-type-label"
          value={type}
          onChange={(e) => setType(e.target.value as EntryType)}
        >
          {entryTypes.map((entryType) => (
            <MenuItem key={entryType} value={entryType}>
              {entryType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        type="date"
        label="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          multiple
          labelId="diagnosis-codes-label"
          value={diagnosisCodes}
          onChange={(e) => setDiagnosisCodes(e.target.value as string[])}
          renderValue={(selected) => (
            <div>
              {selected.map((value) => {
                const diagnosis = diagnoses.find((d) => d.code === value);
                return (
                  <div key={value}>
                    {value} ({diagnosis?.name})
                  </div>
                );
              })}
            </div>
          )}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              <Checkbox checked={diagnosisCodes.indexOf(diagnosis.code) > -1} />
              <ListItemText
                primary={diagnosis.code}
                secondary={diagnosis.name}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {type === "HealthCheck" && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="health-check-rating-label">
            Health Check Rating
          </InputLabel>
          <Select
            labelId="health-check-rating-label"
            value={healthCheckRating ?? ""}
            onChange={(e) =>
              setHealthCheckRating(e.target.value as HealthCheckRating)
            }
          >
            {Object.entries(healthCheckRatings).map(([rating, label]) => (
              <MenuItem key={rating} value={parseInt(rating)}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {type === "OccupationalHealthcare" && (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Employer Name"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Sick Leave Start Date"
            value={sickLeaveStartDate}
            onChange={(e) => setSickLeaveStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Sick Leave End Date"
            value={sickLeaveEndDate}
            onChange={(e) => setSickLeaveEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}

      {type === "Hospital" && (
        <>
          <TextField
            fullWidth
            margin="normal"
            type="date"
            label="Discharge Date"
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Discharge Criteria"
            value={dischargeCriteria}
            onChange={(e) => setDischargeCriteria(e.target.value)}
          />
        </>
      )}

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      <Button
        type="button"
        variant="outlined"
        color="secondary"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </form>
  );
};

export default AddEntryForm;
