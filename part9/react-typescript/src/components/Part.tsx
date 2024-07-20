import "react";
import { CoursePart } from "../types/types";

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h3>{part.name}</h3>
          <p>Exercises: {part.exerciseCount}</p>
          <p>{part.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>{part.name}</h3>
          <p>Exercises: {part.exerciseCount}</p>
          <p>Group projects: {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>{part.name}</h3>
          <p>Exercises: {part.exerciseCount}</p>
          <p>{part.description}</p>
          <p>
            Background material:{" "}
            <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
          </p>
        </div>
      );
    case "special":
      return (
        <div>
          <h3>{part.name}</h3>
          <p>Exercises: {part.exerciseCount}</p>
          <p>{part.description}</p>
          <p>Requirements: {part.requirements.join(", ")}</p>
        </div>
      );
    default:
      return <p>Unknown part kind</p>;
  }
};

export default Part;
