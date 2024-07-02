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

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl);
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  const create = async (newResource) => {
    try {
      const response = await axios.post(baseUrl, newResource);
      setResources([...resources, response.data]); // Update local state with new resource
    } catch (error) {
      console.error("Error creating resource:", error);
    }
  };

  const service = {
    getAll: () => resources,
    create,
  };

  return [resources, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
    content.onChange({ target: { value: "" } }); // Clear input after submission
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
    name.onChange({ target: { value: "" } }); // Clear name input after submission
    number.onChange({ target: { value: "" } }); // Clear number input after submission
  };

  return (
    <div>
      <h2>Notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>Create</button>
      </form>
      {notes.map((note) => (
        <p key={note.id}>{note.content}</p>
      ))}

      <h2>Persons</h2>
      <form onSubmit={handlePersonSubmit}>
        <div>
          Name: <input {...name} />
        </div>
        <div>
          Number: <input {...number} />
        </div>
        <button>Create</button>
      </form>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} - {person.number}
        </p>
      ))}
    </div>
  );
};

export default App;
