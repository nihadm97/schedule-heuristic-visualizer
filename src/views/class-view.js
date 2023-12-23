"use client";
import { Box, Container, Table } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState, useEffect, useContext } from "react";
import ScheduleContext from "@/context/scheduleContext";

import { professors, subjects, time, classrooms, classes } from "../utils/data";
import { generateEtags } from "../../next.config";

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
});

const renderCell = (timeslotIndex, professorLessons) => {
  const lessonsInThisTimeslot = professorLessons.filter(
    (lesson) => lesson.timeIdx === timeslotIndex
  );

  const cellStyles = {
    bgcolor:
      lessonsInThisTimeslot.length > 0 ? "secondary.main" : "background.paper",
    color: lessonsInThisTimeslot.length > 0 ? "common.white" : "text.primary",
    textAlign: "center",
    borderRight:
      timeslotIndex < time.length - 1 ? "1px solid rgba(224, 224, 224, 1)" : "",
  };

  return (
    <TableCell key={`cell-${timeslotIndex}`} sx={cellStyles}>
      {lessonsInThisTimeslot.map((lesson, idx) => (
        <div key={idx}>
          {classes[lesson.classIdx]}
          <br />
          {classrooms[lesson.classroomIdx]}
          <br />
          {subjects[lesson.subjectIdx]}
        </div>
      ))}
    </TableCell>
  );
};

const extractClassSchedule = (classIdx, schedule) => {};

export default function ClassView() {
  const { selectedClassIdx, schedule } = useContext(ScheduleContext);
  const [classSchedule, setClassSchedule] = useState([]);

  useEffect(() => {
    let arr = [];
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i].classIdx == selectedClassIdx) {
        arr.push(schedule[i]);
      }
    }
    let classLessons = [];
    for (let j = 0; j < 6; j++) {
      classLessons[j] = [];
      for (let l = 0; l < 5; l++) {
        classLessons[j][l] = {
          professorIdx: null,
          timeIdx: null,
          subjectIdx: null,
          classroomIdx: null,
          classIdx: null,
        };
      }
    }

    for (let k = 0; k < arr.length; k++) {
      classLessons[parseInt(arr[k].timeIdx % 6)][parseInt(arr[k].timeIdx / 6)] =
        {
          professorIdx: arr[k].professorIdx,
          timeIdx: arr[k].timeIdx,
          subjectIdx: arr[k].subjectIdx,
          classroomIdx: arr[k].classroomIdx,
          classIdx: arr[k].classroomIdx,
        };
    }
    setClassSchedule(classLessons);
  }, []);

  const tableCellStyle = {
    fontWeight: "bold",
    bgcolor: "primary.dark",
    color: "common.white",
    textAlign: "center",
  };

  const tableHeaderStyle = {
    bgcolor: "primary.main",
    color: "common.white",
    textAlign: "center",
  };
  const times = [1, 2, 3, 4, 5, 6];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: "70px", pl: 0, width: "100%" }}>
        <Box>Schedule for class {classes[selectedClassIdx]}</Box>
        <Box display="flex" justifyContent="center">
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="schedule table">
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle}>Time of the day</TableCell>
                  {days.map((day, index) => (
                    <TableCell key={`head-cell-${index}`} sx={tableHeaderStyle}>
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {times.map((time, index) => (
                  <TableRow>
                    <TableCell sx={tableHeaderStyle}>
                      {time} time slot
                    </TableCell>
                    {classSchedule[index]?.map((lesson) => (
                      <TableCell sx={tableHeaderStyle}>
                        {subjects[lesson.subjectIdx]}
                        {"\n"}
                        {classrooms[lesson.classroomIdx]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
