"use client";
import React, { useState, useEffect } from 'react';

export default function FinalizeInputView({ professors, subjects, classes, classrooms, times }) {

  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [repeatCount, setRepeatCount] = useState(1);
  const [schedule, setSchedule] = useState([]);

  const handleDropdownChange = (event, setState) => {
    setState(event.target.value);
  };
  professors = [1,2,3,4]
  subjects = [1,2,3,4]
  classes = [1,2,3,4]
  classrooms = [1,2,3,4]
  times  = [1,2,3,4]
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
    setSchedule(prevSchedule => [...prevSchedule, ...newEntries]);
  };

  useEffect(() => {
    console.log("Raspored ažuriran:", schedule);
  }, [schedule]);

  return (
    <form onSubmit={handleSubmit}>
      <select value={selectedProfessor} onChange={(e) => handleDropdownChange(e, setSelectedProfessor)}>
        {professors.map((professor, idx) => (
          <option key={idx} value={idx}>{professor}</option>
        ))}
      </select>

      <select value={selectedSubject} onChange={(e) => handleDropdownChange(e, setSelectedSubject)}>
        {subjects.map((subject, idx) => (
          <option key={idx} value={idx}>{subject}</option>
        ))}
      </select>

      <select value={selectedClass} onChange={(e) => handleDropdownChange(e, setSelectedClass)}>
        {classes.map((classItem, idx) => (
          <option key={idx} value={idx}>{classItem}</option>
        ))}
      </select>

      <select value={selectedClassroom} onChange={(e) => handleDropdownChange(e, setSelectedClassroom)}>
        {classrooms.map((classroom, idx) => (
          <option key={idx} value={idx}>{classroom}</option>
        ))}
      </select>

      <input type="number" value={repeatCount} onChange={handleRepeatCountChange} />

      <button type="submit">Kreiraj Raspored</button>
    </form>
  );
}
