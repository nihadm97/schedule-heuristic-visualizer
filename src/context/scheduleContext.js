"use client";
import { createContext, useState } from "react";

const ScheduleContext = createContext({
  selectedClass: null,
  schedule: null,
});

export const ClassScheduleContextProvider = ({ children }) => {
  const [schedule, setSchedule] = useState([{ 1: "2", 2: "3" }]);
  const [selectedClassIdx, setSelectedClassIdx] = useState(0);

  return (
    <ScheduleContext.Provider
      value={{ selectedClassIdx, setSelectedClassIdx, setSchedule, schedule }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleContext;
