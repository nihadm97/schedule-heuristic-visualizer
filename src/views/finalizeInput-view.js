"use client";
import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { MenuItem } from "@mui/material";
import ScheduleContext from "@/context/scheduleContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FinalizeInputView({
  professors,
  subjects,
  classes,
  classrooms,
  times,
}) {
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [repeatCount, setRepeatCount] = useState(1);
  const [submissionResults, setSubmissionResults] = useState([]);
  const [generatedSchedule, setGeneratedSchedule] = useState([]);
  const router = useRouter();

  const {
    selectedClassIdx,
    setSelectedClassIdx,
    schedule,
    setSchedule,
    setProfessors,
    setClassrooms,
    setClasses,
    setTimes,
    setSubjects,
  } = useContext(ScheduleContext);

  const handleDropdownChange = (event, setState) => {
    setState(event.target.value);
  };

  const handleRepeatCountChange = (event) => {
    setRepeatCount(parseInt(event.target.value) || 0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newEntries = Array.from({ length: repeatCount }, () => ({
      professorIdx: selectedProfessor,
      timeIdx: Math.floor(Math.random() * times.length),
      subjectIdx: selectedSubject,
      classroomIdx: selectedClassroom,
      classIdx: selectedClass,
    }));
    const newSubmission = {
      professor: professors[selectedProfessor],
      subject: subjects[selectedSubject],
      class: classes[selectedClass],
      classroom: classrooms[selectedClassroom],
      repeatCount: repeatCount,
    };

    setSubmissionResults([...submissionResults, newSubmission]);
    setGeneratedSchedule((prevSchedule) => [...prevSchedule, ...newEntries]);
  };

  const handleGenerateSchedule = () => {
    try {
      setClasses(classes);
      setProfessors(professors);
      setClassrooms(classrooms);
      setSchedule(generatedSchedule);
      setSubjects(subjects);
      setTimes(times);
      router.push("/test");
    } catch (error) {
      alert("Error while generating a schedule! Error: ", error);
    }
    setSchedule(generatedSchedule);
  };

  // useEffect(() => {
  //   setSchedule(generatedSchedule);
  // }, [generatedSchedule]);

  return (
    <div
      style={{
        backgroundColor: "lightblue",
        left: "30%",
        width: "100%",
        height: "100%",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ padding: "40px", textAlign: "center" }}
      >
        <FormControl>
          <Select
            style={{ margin: "5px" }}
            value={selectedProfessor}
            onChange={(e) => handleDropdownChange(e, setSelectedProfessor)}
          >
            {professors &&
              professors.map((professor, idx) => (
                <MenuItem key={idx} value={idx}>
                  {professor}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>Professors</FormHelperText>
        </FormControl>
        <FormControl>
          <Select
            style={{ margin: "5px" }}
            value={selectedSubject}
            onChange={(e) => handleDropdownChange(e, setSelectedSubject)}
          >
            {subjects &&
              subjects.map((subject, idx) => (
                <MenuItem key={idx} value={idx}>
                  {subject}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>Subjects</FormHelperText>
        </FormControl>
        <FormControl>
          <Select
            style={{ margin: "5px" }}
            value={selectedClass}
            onChange={(e) => handleDropdownChange(e, setSelectedClass)}
          >
            {classes &&
              classes.map((classItem, idx) => (
                <MenuItem key={idx} value={idx}>
                  {classItem}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>Classes</FormHelperText>
        </FormControl>
        <FormControl>
          <Select
            style={{ margin: "5px" }}
            value={selectedClassroom}
            onChange={(e) => handleDropdownChange(e, setSelectedClassroom)}
          >
            {classrooms &&
              classrooms.map((classroom, idx) => (
                <MenuItem key={idx} value={idx}>
                  {classroom}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>Classrooms</FormHelperText>
        </FormControl>
        <FormControl>
          <TextField
            style={{
              marginLeft: "10px",
              marginTop: "5px",
              marginBottom: "5px",
            }}
            type="number"
            value={repeatCount}
            onChange={handleRepeatCountChange}
          />
          <FormHelperText>Number of lessons in one week</FormHelperText>
        </FormControl>

        <button
          type="submit"
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
        >
          Add to schedule
        </button>
      </form>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {submissionResults &&
          submissionResults.map((result, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid gray",
                paddingBottom: "10px",
                marginBottom: "10px",
                width: "7%",
                marginLeft: "10px",
              }}
            >
              <p>Profesor: {result.professor}</p>
              <p>Predmet: {result.subject}</p>
              <p>Odjeljenje: {result.class}</p>
              <p>Učionica: {result.classroom}</p>
              <p>Ponavljanja: {result.repeatCount}</p>
            </div>
          ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          style={{
            margin: "15px",
            padding: "10px 15px",
            fontSize: "16px",
            cursor: "pointer",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "10%",
          }}
          onClick={() => handleGenerateSchedule()}
        >
          Generate schedule
        </button>
      </div>
    </div>
  );
}
