import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { getNote } from "./graphql/queries";
import { updateNote as updateNumberMutation } from "./graphql/mutations";

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import awsconfig from "./amplifyconfiguration.json";

Amplify.configure(awsconfig);

const client = generateClient();

const App = () => {
  const [number, setNumber] = useState(0);

  /** Gets number from storage */
  const fetchNumber = async () => {
    const apiData = await client.graphql({
      query: getNote,
      variables: {
        id: "3dbb2fb7-3ec0-48b4-bec9-f590be123192",
      },
    });
    setNumber(apiData.data.getNote.number);
    return apiData.data.getNote.number;
  };

  const updateNumber = async (newNumber) => {
    const result = await client.graphql({
      query: updateNumberMutation,
      variables: {
        input: {
          id: "3dbb2fb7-3ec0-48b4-bec9-f590be123192",
          number: newNumber,
        },
      },
    });
    setNumber(result.data.updateNote.number);
  };

  const increaseCounter = async () => {
    const currentNumber = await fetchNumber();
    const newNumber = currentNumber + 1;

    await updateNumber(newNumber);
  };

  /** useEffect adds 1 to the number everytime the site is visited */
  useEffect(() => {
    increaseCounter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    increaseCounter();
  };

  return (
    <>
      <div className="container">
        <h1>{number}</h1>
        <button onClick={handleClick}>Click me</button>
      </div>
    </>
  );
};

export default App;
