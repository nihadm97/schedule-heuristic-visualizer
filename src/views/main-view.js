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
const time = [9, 10, 11, 12, 13, 14, 15, 16];
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
