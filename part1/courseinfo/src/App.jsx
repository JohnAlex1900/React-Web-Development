import React from "react";

const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  );
};

const Part = (props) => {
  return (
    <div>
      <p>
        {props.name}: {props.exercises}
      </p>
    </div>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part name={props.name} exercises={props.exercises} />
    </div>
  );
};

const Total = (props) => {
  const e1 = props.exercises1;
  const e2 = props.exercises2;
  const e3 = props.exercises3;

  return (
    <div>
      <p>{e1 + e2 + e3}</p>
    </div>
  );
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header course={course} />
      <Content name={part1} exercises={exercises1} />
      <Content name={part2} exercises={exercises2} />
      <Content name={part3} exercises={exercises3} />

      <Total
        exercises1={exercises1}
        exercises2={exercises2}
        exercises3={exercises3}
      />
    </div>
  );
};

export default App;
