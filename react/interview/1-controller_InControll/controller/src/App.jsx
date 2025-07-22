import { useState, useRef } from "react";

import "./App.css";

function App() {
  const handleSubmit = (value) => {
    console.log(value);
  };

  return (
    <>
      {/* <Controlled onSubmit={handleSubmit} /> */}
      <UnControlled onSubmit={handleSubmit} />
    </>
  );
}

function Controlled({ onSubmit }) {
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="controlled-input">受控组件</label>
        <input
          id="controlled-input"
          type="text"
          value={value}
          required
          onChange={(e) => {
            console.log('受控组件触发')
            setValid(e.target.value.length > 5);
            setValue(e.target.value);
          }}
        />
        <button type="submit">提交</button>
        <br />

        {!valid && <span style={{ color: "red" }}>输入错误</span>}
      </form>
    </>
  );
}

function UnControlled({ onSubmit }) {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputRef.current.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="uncontrolled-input">非受控组件</label>
        <input id="uncontrolled-input" type="text" ref={inputRef} />
        <button type="submit">提交</button>
      </form>
    </>
  );
}
export default App;
