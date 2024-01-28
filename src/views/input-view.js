"use client";
import React, { useState, useEffect } from "react";
import FinalizeInputView from "./finalizeInput-view";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";

export default function InputView() {
  const [professors, setProfessors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [times, setTimes] = useState([]);
  const [currentScreen, setCurrentScreen] = useState("main");

  const [input, setInput] = useState({
    professor: "",
    subject: "",
    class: "",
    classroom: "",
    time: "",
  });

  /*
  useEffect(() => {
    console.log('Updated professors:', professors);
  }, [professors]);

  
  useEffect(() => {
    console.log('Updated subjects:', subjects);
  }, [subjects]);

  
  useEffect(() => {
    console.log('Updated classes:', classes);
  }, [classes]);


  useEffect(() => {
    console.log('Updated classrooms:', classrooms);
  }, [classrooms]);


  useEffect(() => {
    console.log('Updated times:', times);
  }, [times]);
  */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const [refresh, setRefresh] = useState(true);

  const handleDelete = (category, item) => {
    // console.log(category, item);
    if (category === "professor") {
      let professorsArr = professors;

      const index = professorsArr.indexOf(item);
      if (index > -1) {
        professorsArr.splice(index, 1);
      }
      setProfessors(professorsArr);
    } else if (category === "subject") {
      let subjectsArr = subjects;

      const index = subjectsArr.indexOf(item);
      if (index > -1) {
        subjectsArr.splice(index, 1);
      }
      setSubjects(subjectsArr);
    } else if (category === "class") {
      let classesArr = classes;

      const index = classesArr.indexOf(item);
      if (index > -1) {
        classesArr.splice(index, 1);
      }
      setClasses(classesArr);
    } else {
      let classRoomsArr = classrooms;

      const index = classRoomsArr.indexOf(item);
      if (index > -1) {
        classRoomsArr.splice(index, 1);
      }
      setClassrooms(classRoomsArr);
    }
    setRefresh(!refresh);
  };

  const handleSubmit = (category, value) => {
    if (value.trim() !== "") {
      const addValue = (prev) => [...prev, value];
      switch (category) {
        case "professor":
          setProfessors(addValue);
          break;
        case "subject":
          setSubjects(addValue);
          break;
        case "class":
          setClasses(addValue);
          break;
        case "classroom":
          setClassrooms(addValue);
          break;
        case "time":
          const list = [];
          for (let index = 1; index <= value; index++) {
            list.push(`M${index}`);
          }
          for (let index = 1; index <= value; index++) {
            list.push(`TU${index}`);
          }
          for (let index = 1; index <= value; index++) {
            list.push(`W${index}`);
          }
          for (let index = 1; index <= value; index++) {
            list.push(`TH${index}`);
          }
          for (let index = 1; index <= value; index++) {
            list.push(`F${index}`);
          }

          setTimes(list);
          // console.log(list);
          break;
        default:
      }
    }
    setInput({ ...input, [name]: "" });
  };

  const containerStyle = {
    display: "flex",
    padding: "20px",
    maxHeight: "500px",
  };

  const columnStyle = {
    marginRight: "20px",
    width: "250px",
    maxHeight: "400px",
    overflowY: "auto",
  };

  const returnCategory = (category) => {
    if (category === "professor") return "professors";
    else if (category === "subject") return "subjects";
    else if (category === "class") return "classes";
    else return "classrooms";
  };

  const generisiRaspored = () => {
    const propsToSend = {
      professors,
      subjects,
      classes,
      classrooms,
      times,
    };
    setCurrentScreen({ screen: "finalizeInput", props: propsToSend });
  };
  // console.log("reformat");
  const liStyle = {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
  };
  return (
    <div
      style={{
        backgroundColor: "lightblue",
        height: "100vh",
        overflow: "scroll",
      }}
    >
      {currentScreen === "main" ? (
        <div>
          <div style={containerStyle}>
            <TextField
              type="text"
              name={times}
              value={input[times]}
              onChange={handleInputChange}
              sx={{ marginRight: "20px", width: "220px" }}
              placeholder={`Number of timeslots a day`}
            />
            <button
              style={{
                margin: "10px",
                padding: "5px 10px",
                fontSize: "16px",
                cursor: "pointer",
                background: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => handleSubmit("time", input[times])}
            >
              Add
            </button>
            <div
              style={{ height: "56px", lineHeight: "56px", marginLeft: "20px" }}
            >
              {/* Display values based on category */}
              Number of timeslots a day: {times.length / 5}
            </div>
          </div>
          <div style={containerStyle}>
            {["professor", "subject", "class", "classroom"].map((category) => (
              <div key={category} style={columnStyle}>
                <div>
                  <TextField
                    type="text"
                    name={category}
                    value={input[category]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${category}`}
                  />
                  <button
                    style={{
                      margin: "10px",
                      padding: "5px 10px",
                      fontSize: "16px",
                      cursor: "pointer",
                      background: "blue",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleSubmit(category, input[category])}
                  >
                    Add
                  </button>
                  <div>
                    <p>Added {returnCategory(category)}:</p>{" "}
                  </div>
                </div>
                <div>
                  {/* Display values based on category */}
                  {category === "professor" &&
                    professors.map((item, index) => (
                      <>
                        <div key={index}>
                          {item}{" "}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDelete(category, item)}
                            startIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    ))}
                  {category === "subject" &&
                    subjects.map((item, index) => (
                      <div key={index}>
                        {item}{" "}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDelete(category, item)}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  {category === "class" &&
                    classes.map((item, index) => (
                      <div key={index}>
                        {item}{" "}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDelete(category, item)}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  {category === "classroom" &&
                    classrooms.map((item, index) => (
                      <div key={index}>
                        {item}{" "}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDelete(category, item)}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  {category === "time" &&
                    times.map((item, index) => (
                      <div key={index}>
                        {item}{" "}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDelete(category, item)}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "left",
            }}
          >
            <button
              onClick={generisiRaspored}
              style={{
                margin: "20px",
                padding: "10px 15px",
                fontSize: "16px",
                cursor: "pointer",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Assign professors to classes and subjects
            </button>
          </div>
        </div>
      ) : (
        <FinalizeInputView {...currentScreen.props} />
      )}
    </div>
  );
}
