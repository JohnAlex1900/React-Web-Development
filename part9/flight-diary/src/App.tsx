import React, { useEffect, useState } from "react";
import DiaryList from "./components/DiaryList";
import DiaryForm from "./components/DiaryForm";
import { DiaryEntry } from "./types";
import { getDiaries } from "./services/diaryService";

const App: React.FC = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const diaries = await getDiaries();
      setDiaries(diaries);
    };

    fetchDiaries();
  }, []);

  const addDiaryEntry = (diary: DiaryEntry) => {
    setDiaries(diaries.concat(diary));
  };

  return (
    <div>
      <h1>Flight Diaries</h1>
      <DiaryForm addDiaryEntry={addDiaryEntry} />
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
