import React from "react";
import { DiaryEntry } from "../types";

interface DiaryListProps {
  diaries: DiaryEntry[];
}

const DiaryList: React.FC<DiaryListProps> = ({ diaries }) => {
  return (
    <div>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <p>
            <strong>{diary.date}</strong>
          </p>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryList;
