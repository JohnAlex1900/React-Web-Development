import React, { useState } from "react";
import { NewDiaryEntry, Weather, Visibility, DiaryEntry } from "../types";
import { createDiary } from "../services/diaryService";

interface DiaryFormProps {
  addDiaryEntry: (diary: DiaryEntry) => void;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ addDiaryEntry }) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState("");

  const submitDiary = async (event: React.FormEvent) => {
    event.preventDefault();
    const newDiary: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment,
    };
    const addedDiary = await createDiary(newDiary);
    addDiaryEntry(addedDiary);
    setDate("");
    setVisibility(Visibility.Great);
    setWeather(Weather.Sunny);
    setComment("");
  };

  return (
    <form onSubmit={submitDiary}>
      <div>
        date
        <input
          type="date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
      </div>
      <div>
        visibility
        <select
          value={visibility}
          onChange={({ target }) => setVisibility(target.value as Visibility)}
        >
          {Object.values(Visibility).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div>
        weather
        <select
          value={weather}
          onChange={({ target }) => setWeather(target.value as Weather)}
        >
          {Object.values(Weather).map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>
      <div>
        comment
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default DiaryForm;
