import React from "react";

const Header = (props) => {
  console.log(props);
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  );
};

const Content = (props) => {
  console.log(props);
  const { parts } = props;
  return (
    <div>
      {parts.map((part) => (
        <p key={part.id}>
          {part.name}: {part.exercises}
        </p>
      ))}
    </div>
  );
};

const Total = (props) => {
  const { total } = props;
  const totalExercises = total.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div>
      <p>
        <b>Total of {totalExercises} exercises</b>
      </p>
    </div>
  );
};

const Course = ({ courses }) => {
  return (
    <>
      <Header course={courses} />
      <Content parts={courses.parts} />
      <Total total={courses.parts} />
    </>
  );
};

export default Course;
