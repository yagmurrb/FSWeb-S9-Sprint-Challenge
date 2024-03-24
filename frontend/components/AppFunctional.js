import axios from "axios";
import React, { useState } from "react";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [counter, setCounter] = useState(initialSteps);
  const [degisenIndex, setDegisenIndex] = useState(initialIndex);
  const [email, setEmail] = useState(initialEmail);
  const [errorMessage, setErrorMessage] = useState(initialMessage);

  const postObject = {
    email: email,
    x: (degisenIndex + 1) % 3 == 0 ? 3 : (degisenIndex + 1) % 3,
    y:
      degisenIndex < 3
        ? 1
        : degisenIndex < 6
        ? 2
        : degisenIndex < 9
        ? 3
        : false,
    steps: counter,
  };

  function getXY() {
    const xyArray = [];
    for (let y = 1; y < 4; y++) {
      for (let x = 1; x < 4; x++) {
        xyArray.push(`(${x},${y})`);
      }
    }
    return xyArray[degisenIndex];
  }

  function sonrakiIndex(yon) {
    if (
      yon === "left" &&
      degisenIndex !== 0 &&
      degisenIndex !== 3 &&
      degisenIndex !== 6
    ) {
      setDegisenIndex(degisenIndex - 1);
      setCounter(counter + 1);
      setErrorMessage("");
    } else if (yon === "left") {
      setErrorMessage("Sola gidemezsiniz");
    }

    if (
      yon === "right" &&
      degisenIndex !== 2 &&
      degisenIndex !== 5 &&
      degisenIndex !== 8
    ) {
      setDegisenIndex(degisenIndex + 1);
      setCounter(counter + 1);
      setErrorMessage("");
    } else if (yon === "right") {
      setErrorMessage("Sağa gidemezsiniz");
    }

    if (yon === "up" && 3 <= degisenIndex && degisenIndex < 9) {
      setDegisenIndex(degisenIndex - 3);
      setCounter(counter + 1);
      setErrorMessage("");
    } else if (yon === "up") {
      setErrorMessage("Yukarıya gidemezsiniz");
    }

    if (yon === "down" && degisenIndex < 6) {
      setDegisenIndex(degisenIndex + 3);
      setCounter(counter + 1);
      setErrorMessage("");
    } else if (yon === "down") {
      setErrorMessage("Aşağıya gidemezsiniz");
    }
    if (yon === "reset") {
      setCounter(0);
      setDegisenIndex(initialIndex);
      setErrorMessage("");
      setEmail("");
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    axios
      .post("http://localhost:9000/api/result", postObject)
      .then(function (response) {
        console.log(response);
        setErrorMessage(response.data.message);
        setEmail("");
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates" data-testid="coordinates">
          Koordinatlar {getXY()}
        </h3>
        <h3 id="steps">{counter} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === degisenIndex ? " active" : ""}`}
          >
            {idx === degisenIndex ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{errorMessage}</h3>
      </div>
      <div id="keypad">
        <button onClick={() => sonrakiIndex("left")} type="button" id="left">
          SOL
        </button>
        <button onClick={() => sonrakiIndex("up")} type="button" id="up">
          YUKARI
        </button>
        <button onClick={() => sonrakiIndex("right")} type="button" id="right">
          SAĞ
        </button>
        <button onClick={() => sonrakiIndex("down")} type="button" id="down">
          AŞAĞI
        </button>
        <button onClick={() => sonrakiIndex("reset")} type="button" id="reset">
          reset
        </button>
      </div>
      <form>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit" onClick={onSubmit}></input>
      </form>
    </div>
  );
}
