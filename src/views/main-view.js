import { Box, Button, Container } from "@mui/material";

const professors = [
  "prof 1",
  "prof 2",
  "prof 3",
  "prof 4",
  "prof 5",
  "prof 6",
  "prof 7",
  "prof 8",
  "prof 9",
  "prof 10",
];
const subjects = [
  "subj 1 1",
  "subj 1 2",
  "subj 1 3",
  "subj 1 4",
  "subj 1 5",
  "subj 1 6",
  "subj 1 7",
  "subj 1 8",
  "subj 2 1",
  "subj 2 2",
  "subj 2 3",
  "subj 2 4",
  "subj 2 5",
  "subj 2 6",
  "subj 2 7",
  "subj 2 8",
  "subj 3 1",
  "subj 3 2",
  "subj 3 3",
  "subj 3 4",
  "subj 3 5",
  "subj 3 6",
  "subj 3 7",
  "subj 3 8",
  "subj 4 1",
  "subj 4 2",
  "subj 4 3",
  "subj 4 4",
  "subj 4 5",
  "subj 4 6",
  "subj 4 7",
  "subj 4 8",
];
const time = [
  "m1",
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "t1",
  "t2",
  "t3",
  "t4",
  "t5",
  "t6",
  "w1",
  "w2",
  "w3",
  "w4",
  "w5",
  "w6",
  "th1",
  "th2",
  "th3",
  "th4",
  "th5",
  "th6",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
];
const classrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const classes = [
  "I1",
  "I2",
  "I3",
  "II4",
  "II1",
  "II2",
  "II3",
  "II4",
  "III1",
  "III2",
  "III3",
  "III4",
  "IV1",
  "IV2",
  "IV3",
  "IV4",
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
  timeIdx: 0,
  subjectIdx: 1,
  classroomIdx: 1,
  classIdx: 1,
};
const oneCellInSolution3 = {
  professorIdx: 2,
  timeIdx: 0,
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
      >
        <Button variant="contained">Test</Button>
      </Box>
    </Container>
  );
}
