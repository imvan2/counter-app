import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { getNote } from "./graphql/queries";
import { updateNote as updateNumberMutation } from "./graphql/mutations";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import awsconfig from "./amplifyconfiguration.json";
import party from "party-js";

import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";

Amplify.configure(awsconfig);

const client = generateClient();

const App = () => {
  const [number, setNumber] = useState(0);

  const WS_URL = "ws://127.0.0.1:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
  });
  const THROTTLE = 50;
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  /** Gets number from storage */
  const fetchNumber = async () => {
    const apiData = await client.graphql({
      query: getNote,
      variables: {
        id: "3dbb2fb7-3ec0-48b4-bec9-f590be123192",
      },
    });
    sendJsonMessage({ number: apiData.data.getNote.number });
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
    sendJsonMessage({ number: result.data.updateNote.number });
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
  }, []);

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.number !== undefined) {
      setNumber(lastJsonMessage.number);
    }
  }, [lastJsonMessage]);

  const handleClick = () => {
    increaseCounter();
  };

  return (
    <>
      <div className="container">
        <h1 id="number">{number}</h1>
        <button
          onClick={(event) => {
            handleClick();
            party.confetti(event.target);
          }}
        >
          Click me
        </button>
      </div>
    </>
  );
};

export default App;
