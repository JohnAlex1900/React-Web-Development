import React, { useState, useEffect } from "react";

const Statistics = (props) => {
  return (
    <>
      <div>
        <h1>Statistics</h1>
      </div>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={props.all} />
          <StatisticLine text="average" value={props.a_all / props.all} />
          <StatisticLine
            text="percentage"
            value={(props.good / props.all) * 100 + "%"}
          />
        </tbody>
      </table>
    </>
  );
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const [isStatistics, setIsStatistics] = useState(false);

  const all = good + neutral + bad;

  const a_good = good * 1;
  const a_neutral = neutral * 0;
  const a_bad = bad * -1;

  const a_all = a_bad + a_good + a_neutral;

  useEffect(() => {
    if (good > 0 || neutral > 0 || bad > 0) {
      setIsStatistics(true);
    }
  }, [good, neutral, bad]);

  return (
    <>
      <div>
        <h1>Give Feedback</h1>
      </div>
      <div>
        <Button onClick={() => setGood(good + 1)} text="good" />
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button onClick={() => setBad(bad + 1)} text="bad" />
      </div>

      {isStatistics ? (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          all={all}
          a_all={a_all}
        />
      ) : (
        <p>No Feedback Given</p>
      )}
    </>
  );
};

export default App;
