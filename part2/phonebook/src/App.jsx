import React, { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";
import Error from "./components/Error";
import Success from "./components/Success";
import "./App.css";

const App = (props) => {
  axios.get("http://localhost:3001/api/persons").then((response) => {
    const personsData = response.data;
    console.log(personsData);
  });

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  console.log("render", persons.length, "persons");

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    // Check for duplicate names
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with the new one?`
        )
      ) {
        // Update the existing person's number
        personService
          .update(existingPerson.name, { ...existingPerson, number: newNumber })
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : updatedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setSuccess(`Updated ${newName}'s number`);
            setTimeout(() => setSuccess(null), 5000);
          })
          .catch((error) => {
            setError(error.response.data.error);
            setTimeout(() => setError(null), 5000);
          });
      }
    } else {
      personObject.id =
        persons.length > 0
          ? (Math.max(...persons.map((p) => parseInt(p.id, 10))) + 1).toString()
          : "1";
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          setSuccess(`Added ${personObject.name}`);
        })
        .catch((error) => {
          setError(error.response.data.error);
          setTimeout(() => setError(null), 5000);
        });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  console.log(persons);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Error message={error} />
      <Success message={success} />
      <div>
        filter shown with
        <input value={filter} onChange={handleFilterChange} />
      </div>
      <br />
      <h2>Add A New</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          <br />
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button onClick={addPerson} type="submit">
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map((person) => (
        <p key={person.id}>
          {person.name}: {person.number}
          <button onClick={() => deletePerson(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default App;
