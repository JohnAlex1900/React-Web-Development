import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then((response) => {
          if (response.data) {
            setCountry({ found: true, data: response.data });
          } else {
            setCountry({ found: false });
          }
        })
        .catch((error) => {
          console.error("Error fetching country data:", error);
          setCountry({ found: false });
        });
    } else {
      setCountry(null);
    }
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>country not found...</div>;
  }

  const { data } = country;

  return (
    <div>
      <h3>{data.name.common}</h3>
      <div>capital: {data.capital[0]}</div>
      <div>area: {data.area} km²</div>
      <div>languages: {Object.values(data.languages).join(", ")}</div>
      <img
        src={data.flags.svg}
        height="100"
        alt={`flag of ${data.name.common}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      {country &&
        (country.found ? (
          <Country country={country} />
        ) : (
          <div>country not found...</div>
        ))}
    </div>
  );
};

export default App;
