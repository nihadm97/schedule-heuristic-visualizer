"use client"
import { Box, Container, Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';



const professors = [
  "Hozo Minja",
  "Širbegović Vedina",
  "Seno Čolo",
  "Avdagić Lejla",
  "Busuladžić Nela",
  "Zulčić Ankica",
  "Čolić Adnan",
  "Softić Adelisa",
  "Mehmedović Nihad",
  "Hujdur Lejla",
];
const subjects = [
  "BHS",
  "ENG",
  "NJEM",
  "TZO",
  "MAT",
  "HIST",
  "VJE",
  "INF",
  "FIZ",
  "GEO",
  "HEM",
  "DSPK",
  "MAR",
  "BIZEKO",
  "OSEKO",
  "INFTEH",
  "MEĐEKO",
  "EUIMS",
  "TBR",
  "BAKPOS",
  "PRAVO",
  "UUPP",
  "EKOMAT",
  "PRAKSA",
  "KNJI",
  "PZV"
];

const time = [
  "M1",
  "M2",
  "M3",
  "M4",
  "M5",
  "M6",
  "TU1",
  "TU2",
  "TU3",
  "TU4",
  "TU5",
  "TU6",
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "TH1",
  "TH2",
  "TH3",
  "TH4",
  "TH5",
  "TH6",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
];

const classrooms = [
  "PR1",
  "PR2",
  "MULTI",
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "Sala"
]

const classes = [
  "I.1",
  "I.2",
  "I.3",
  "I.4",
  "II.1",
  "II.2",
  "II.3",
  "II.4",
  "III.1",
  "III.2",
  "III.3",
  "III.4",
  "IV.1",
  "IV.2",
  "IV.3",
  "IV.4",
];
//  5-tuple consisting of 5 indices, first index represents professor,
//  second index represents the time, third index is subject, fourth is classroom and
//  fifth is class

const cell1 = {
  professorIdx: 0,
  timeIdx: 0,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 0,
};
const cell2 = {
  professorIdx: 0,
  timeIdx: 1,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 1,
};
const cell3 = {
  professorIdx: 0,
  timeIdx: 2,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 2,
};
const cell4 = {
  professorIdx: 0,
  timeIdx: 3,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 3,
};
const cell5 = {
  professorIdx: 0,
  timeIdx: 7,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 0,
};
const cell6 = {
  professorIdx: 0,
  timeIdx: 8,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 1,
};
const cell7 = {
  professorIdx: 0,
  timeIdx: 9,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 2,
};
const cell8 = {
  professorIdx: 0,
  timeIdx: 10,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 3,
};
const cell9 = {
  professorIdx: 0,
  timeIdx: 14,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 0,
};
const cell10 = {
  professorIdx: 0,
  timeIdx: 15,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 1,
};
const cell11 = {
  professorIdx: 0,
  timeIdx: 16,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 2,
};
const cell12 = {
  professorIdx: 0,
  timeIdx: 17,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 3,
};
const cell13 = {
  professorIdx: 2,
  timeIdx: 1,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 0,
};
const cell14 = {
  professorIdx: 2,
  timeIdx: 2,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 1,
};
const cell15 = {
  professorIdx: 2,
  timeIdx: 3,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 2,
};
const cell16 = {
  professorIdx: 2,
  timeIdx: 4,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 3,
};
const cell17 = {
  professorIdx: 2,
  timeIdx: 8,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 0,
};
const cell18 = {
  professorIdx: 2,
  timeIdx: 9,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 1,
};
const cell19 = {
  professorIdx: 2,
  timeIdx: 10,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 2,
};
const cell20 = {
  professorIdx: 2,
  timeIdx: 11,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 3,
};
const cell21 = {
  professorIdx: 2,
  timeIdx: 15,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 0,
};
const cell22 = {
  professorIdx: 2,
  timeIdx: 16,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 1,
};
const cell23 = {
  professorIdx: 2,
  timeIdx: 17,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 2,
};
const cell24 = {
  professorIdx: 2,
  timeIdx: 18,
  subjectIdx: 1,
  classroomIdx: 17,
  classIdx: 3,
};
const cell300 = {
  professorIdx: 1,
  timeIdx: 15,
  subjectIdx: 1,
  classroomIdx: 1,
  classIdx: 1,
};
const cell301 = {
  professorIdx: 2,
  timeIdx: 2,
  subjectIdx: 2,
  classroomIdx: 2,
  classIdx: 2,
};
const tempSolution = [
  oneCellInSolution,
  oneCellInSolution2,
  oneCellInSolution3,
];

// Function to check if some professor is in different classes at the same time
const checkForSameProfessorDifferentClass = (solution) => {};

export default function MainView() {
  return (
    <Container>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
      >
        <Button variant="contained">Test</Button>
      </Box>
    </Container>
  );

                    
}