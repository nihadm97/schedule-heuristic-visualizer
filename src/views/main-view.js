"use client"
import { Box, Container, Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

const oneCellInSolution = {
  professorIdx: 0,
  timeIdx: 0,
  subjectIdx: 0,
  classroomIdx: 0,
  classIdx: 0,
};
const oneCellInSolution2 = {
  professorIdx: 1,
  timeIdx: 15,
  subjectIdx: 1,
  classroomIdx: 1,
  classIdx: 1,
};
const oneCellInSolution3 = {
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
// Solution is made of 'solutionCells', we have to check if some two cells have the
// the same attributes professorIdx and timeIdx which would mean that the same professor
// is asigned to different class at the same time
const checkForSameProfessorDifferentClass = (solution) => {
  // we will iterate through the solution(all cells) for all professors and check if the times collide
  for (let i = 0; i < professors.length; i++) {
    let timesForProfessor = new Array(time.length).fill(false);
    for (s in solution) {
      if (s.professorIdx === i && timesForProfessor[s.timeIdx] === true) {
        return false; // We found a cell in which is professor assigned to a time in which he is already assigned
      } else if (
        s.professorIdx === i &&
        timesForProfessor[s.timeIdx] === false
      ) {
        timesForProfessor[s.timeIdx] = true;
      } else {
        continue;
      }
    }
  }
  return true; // We didnt find double times for the same professor
};


export default function MainView() {

  return (
    <Container>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
      ></Box>
    <TableContainer component={Paper} style={{ paddingLeft: 0, paddingRight: 0, marginLeft:0, marginRight:0, width: '100%' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Professor</TableCell>
          {time.map((timeslot) => (
            <TableCell>{timeslot}</TableCell> // write all timeslot labels
          ))}
            
          </TableRow>
        </TableHead>
        <TableBody>
        {tempSolution.map((row) => (
          <TableRow
            key={row.professorIdx} 
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
          <TableCell component="th" scope="row">
            {professors[row.professorIdx]}
          </TableCell>
          {time.map((index) => {
            if (index === time[row.timeIdx]) { // when professor has a lecture in that timeslot visualize it 
              return (
                <TableCell align="center">
                  {classes[row.classIdx]}
                  {"\n"}
                  {classrooms[row.classroomIdx]}
                  {"\n"}
                  {subjects[row.subjectIdx]}
                </TableCell>
        );
      }
      return <TableCell align="right"></TableCell>; // when professor does not have a lecture in that timeslot just create empty cell (necessary for correct visualization of lectures)
          })}
        </TableRow>
        ))}

        </TableBody>
      </Table>
      </TableContainer>
    </Container>
  );
}
