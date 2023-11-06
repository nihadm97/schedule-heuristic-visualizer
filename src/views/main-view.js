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

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    HELPER FUNCTIONS    /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//  Function that checks if array has breaks between class times

const checkIfClassDayIsContinous = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i + 1][0] == arr[i][0]) {
      // If its still the same day m == m for example (monday == monday)
      if (arr[i + 1][1] - arr[i][1] != 1) {
        return false;
      } else {
        continue;
      }
    } else {
      continue;
    }
  }
};

const checkIfProfessorDayIsContinousOrWithOneBreak = (arr) => {
  let foundOneBreakInOneDay = false;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i + 1][0] == arr[i][0]) {
      // If its still the same day m == m for example (monday == monday)
      if (arr[i + 1][1] - arr[i][1] > 1) {
        return false;
      } else if (arr[i + 1][1] - arr[i][1] == 1) {
        if (foundOneBreakInOneDay === true) {
          //  We found another break in one day
          return false;
        }
        foundOneBreakInOneDay = true;
        continue;
      } else {
        continue;
      }
    } else {
      foundOneBreakInOneDay = false; // We switched from one day to another so we need to restart the variable for checking one break a day
      continue;
    }
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//  Function to check if some professor is in different classes at the same time
//  Solution is made of 'solutionCells', we have to check if some two cells have the
//  the same attributes professorIdx and timeIdx which would mean that the same professor
//  is asigned to different class at the same time
const checkForSameProfessorDifferentClass = (solution) => {
  //    we will iterate through the solution(all cells) for all professors and check if the times collide
  for (let i = 0; i < professors.length; i++) {
    let timesForProfessor = new Array(time.length).fill(false);
    for (s in solution) {
      if (s.professorIdx === i && timesForProfessor[s.timeIdx] === true) {
        return false; //    We found a cell in which is professor assigned to a time in which he is already assigned
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
  return true; //   We didnt find double times for the same professor
};

//  Function checks if some class has all their subjects one after another,
//  without time gaps of 45mins or more and have between 4 and 7 classes a day
const checkClassGapsAndNumOfLessons = (solution) => {
  //    we will iterate through the solution(all cells) for all classes and check if one class has continous lessons in a day
  for (let i = 0; i < classes.length; i++) {
    let classesPerDay = new Array(5).fill(0); //    Array of zeros for each day from monday to friday, when we find a solution cell for we increment that index in an array
    let allClassTimesFound = new Array(); // We will fill this array with all times found for current class in current solution, then sort it and check if the times for each day are continous
    //  Could optimize this to make it instead of going through the solution for each class, check for all classes in one going by putting
    //  variables 'classesPerDay and allClassTimesFound in an array, where array is slot for each class to check
    for (s in solution) {
      if (s.classIdx === i) {
        if (time[s.timeIdx][0] == "m") {
          classesPerDay[0]++;
          allClassTimesFound.push(time[s.timeIdx]);
        } else if (time[s.timeIdx][0] == "t") {
          if (time[s.timeIdx][1] != "h") {
            classesPerDay[1]++;
            allClassTimesFound.push(time[s.timeIdx]);
          } else {
            classesPerDay[3]++;
            allClassTimesFound.push(time[s.timeIdx]);
          }
        } else if (time[s.timeIdx][0] == "w") {
          classesPerDay[2]++;
          allClassTimesFound.push(time[s.timeIdx]);
        } else if (time[s.timeIdx][0] == "f") {
          classesPerDay[4]++;
          allClassTimesFound.push(time[s.timeIdx]);
        }
      } else {
        continue;
      }
    }
    for (let j = 0; j < 5; j++) {
      if (classesPerDay < 4 || classesPerDay > 7) return false;
    }
    allClassTimesFound.sort();
    if (checkIfClassDayIsContinous(allClassTimesFound) == false) {
      return false;
    }
  }
  return true; //   We didnt find double times for the same professor
};

//  Functions that checks if professor has at most one break of 45 mins,
//  a 'one lesson' gap and between 2 and 7 classes a day
const checkProfessorBreakAndNumOfLessons = (solution) => {
  //    we will iterate through the solution(all cells) for all professors and check if one professor has at most
  //    1 break of 45 mins between classes in a day and has between 2 and 7 lessons a day
  for (let i = 0; i < professors.length; i++) {
    let classesPerDay = new Array(5).fill(0); //    Array of zeros for each day from monday to friday, when we find a solution cell for we increment that index in an array
    let allClassTimesFound = new Array(); // We will fill this array with all times found for current professor in current solution, then sort it and check if the times for each day are continous
    //  or with one break at most
    //  Could optimize this to make it instead of going through the solution for each professor, check for all professor in one going by putting
    //  variables 'classesPerDay and allClassTimesFound in an array, where array is slot for each class to check
    for (s in solution) {
      if (s.professorIdx === i) {
        if (time[s.timeIdx][0] == "m") {
          classesPerDay[0]++;
          allClassTimesFound.push(time[s.timeIdx]);
        } else if (time[s.timeIdx][0] == "t") {
          if (time[s.timeIdx][1] != "h") {
            classesPerDay[1]++;
            allClassTimesFound.push(time[s.timeIdx]);
          } else {
            classesPerDay[3]++;
            allClassTimesFound.push(time[s.timeIdx]);
          }
        } else if (time[s.timeIdx][0] == "w") {
          classesPerDay[2]++;
          allClassTimesFound.push(time[s.timeIdx]);
        } else if (time[s.timeIdx][0] == "f") {
          classesPerDay[4]++;
          allClassTimesFound.push(time[s.timeIdx]);
        }
      } else {
        continue;
      }
    }
    for (let j = 0; j < 5; j++) {
      if (classesPerDay < 2 || classesPerDay > 7) return false;
    }
    allClassTimesFound.sort();
    if (
      checkIfProfessorDayIsContinousOrWithOneBreak(allClassTimesFound) == false
    ) {
      return false;
    }
  }
  return true; //   We didnt find double times for the same professor
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
