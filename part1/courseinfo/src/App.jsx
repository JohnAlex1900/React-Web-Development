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
  return (
    <div>
      <p>
        name={props.parts[0].name}: exercises={props.parts[0].exercises}
      </p>
      <p>
        name={props.parts[1].name}: exercises={props.parts[1].exercises}
      </p>
      <p>
        name={props.parts[2].name}: exercises={props.parts[2].exercises}
      </p>
    </div>
  );
};

const Total = (props) => {
  const e1 = props.parts[0].exercises;
  const e2 = props.parts[1].exercises;
  const e3 = props.parts[2].exercises;

  return (
    <div>
      <p>{e1 + e2 + e3}</p>
    </div>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />

      <Total parts={course.parts} />
    </div>
  );
};

export default App;
