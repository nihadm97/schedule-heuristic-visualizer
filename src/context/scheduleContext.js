"use client";
import { createContext, useState } from "react";
import {
  initialSolution,
  professors as profs,
  subjects as subs,
  classes as cls,
  classrooms as clrms,
  time,
} from "@/utils/data";

const ScheduleContext = createContext({
  selectedClass: null,
  schedule: null,
});

export const ClassScheduleContextProvider = ({ children }) => {
  const [schedule, setSchedule] = useState(initialSolution);
  const [selectedClassIdx, setSelectedClassIdx] = useState(0);
  const [selectedClassroomIdx, setSelectedClassroomIdx] = useState(0);
  const [selectedProfessorIdx, setSelectedProfessorIdx] = useState(0);
  const [professors, setProfessors] = useState(profs);
  const [classes, setClasses] = useState(cls);
  const [classrooms, setClassrooms] = useState(clrms);
  const [subjects, setSubjects] = useState(subs);
  const [times, setTimes] = useState(time);

  return (
    <ScheduleContext.Provider
      value={{
        selectedClassIdx,
        selectedClassroomIdx,
        selectedProfessorIdx,
        setSelectedClassIdx,
        setSelectedClassroomIdx,
        setSelectedProfessorIdx,
        setSchedule,
        schedule,
        professors,
        setProfessors,
        classes,
        setClasses,
        classrooms,
        setClassrooms,
        subjects,
        setSubjects,
        times,
        setTimes,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleContext;
