// src/App.tsx
import React from "react";
import TaskTree from "./components/taskTree/TaskTree";
import TaskDetails from "./components/taskDetails/TaskDetails";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div className="content">
        <TaskTree />
        <TaskDetails />
      </div>
    </div>
  );
};

export default App;
