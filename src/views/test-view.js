"use client";
import { Box, Container, Table, Button } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  checkIfClassDayIsContinous,
  checkIfProfessorDayIsContinousOrWithOneBreak,
  checkForSameProfessorDifferentClass,
  checkClassGapsAndNumOfLessons,
  checkProfessorBreakAndNumOfLessons,
  checkForSameClassDifferentSubject,
  getRdn,
  checkBound,
  average,
} from "../utils/helper-functions";
import {
  professors,
  subjects,
  time,
  classrooms,
  classes,
  cell1,
  cell2,
  cell3,
  cell4,
  cell5,
  cell6,
  cell7,
  cell8,
  cell9,
  cell10,
  cell11,
  cell12,
  cell13,
  cell14,
  cell15,
  cell16,
  cell17,
  cell18,
  cell19,
  cell20,
  cell21,
  cell22,
  cell23,
  cell24,
  cell25,
  cell26,
  cell27,
  cell28,
  cell29,
  cell30,
  cell31,
  cell32,
  cell33,
  cell34,
  cell35,
  cell36,
  cell37,
  cell38,
  cell39,
  cell40,
  cell41,
  cell42,
  cell43,
  cell44,
  cell45,
  cell46,
  cell47,
  cell48,
  cell49,
  cell50,
  cell51,
  cell52,
  cell53,
  cell54,
  cell55,
  cell56,
  cell57,
  cell58,
  cell59,
  cell60,
  cell61,
  cell62,
  cell63,
  cell64,
  cell65,
  cell66,
  cell67,
  cell68,
  cell69,
  cell70,
  cell71,
  cell72,
  cell73,
  cell74,
  cell75,
  cell76,
  cell77,
  cell78,
  cell79,
  cell80,
  cell81,
  cell82,
  cell83,
  cell84,
  cell85,
  cell86,
  cell87,
  cell88,
  cell89,
  cell90,
  cell91,
  cell92,
  cell93,
  cell94,
  cell95,
  cell96,
  cell97,
  cell98,
  cell99,
  cell100,
  cell101,
  cell102,
  cell103,
  cell104,
} from "../utils/data";
import React, { useState, useEffect, useContext } from "react";
import ScheduleContext from "@/context/scheduleContext";
import Link from "next/link";

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    ADELISA POKUSAJI    /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

function calculate_loss(schedule) {
  let studentOverlapPenalty = 100; // brojeve sam totalno random izabrala
  let teacherOverlapPenalty = 50;
  let studentBreakPenalty = 10;
  let classCountPenalty = 30;

  let totalLoss = 0;
  let studentTimeSlots = {};
  let teacherTimeSlots = {};

  // Inicijalizacija struktura za praćenje vremenskih slotova
  schedule.forEach((cell) => {
    if (!studentTimeSlots[cell.classIdx]) {
      studentTimeSlots[cell.classIdx] = new Set();
    }
    if (!teacherTimeSlots[cell.professorIdx]) {
      teacherTimeSlots[cell.professorIdx] = new Set();
    }
  });

  // Računanje kazni za preklapanje i praćenje broja časova
  schedule.forEach((cell) => {
    if (studentTimeSlots[cell.classIdx].has(cell.timeIdx)) {
      totalLoss += studentOverlapPenalty;
    } else {
      studentTimeSlots[cell.classIdx].add(cell.timeIdx);
    }

    if (teacherTimeSlots[cell.professorIdx].has(cell.timeIdx)) {
      totalLoss += teacherOverlapPenalty;
    } else {
      teacherTimeSlots[cell.professorIdx].add(cell.timeIdx);
    }
  });

  // Računanje kazni za pauze i broj časova
  for (let classIdx in studentTimeSlots) {
    let classHours = studentTimeSlots[classIdx].size;
    if (classHours < 4 || classHours > 7) {
      totalLoss += classCountPenalty;
    }
  }

  for (let professorIdx in teacherTimeSlots) {
    let professorHours = teacherTimeSlots[professorIdx].size;
    if (professorHours > 0 && (professorHours < 2 || professorHours > 7)) {
      totalLoss += classCountPenalty;
    }
  }

  return totalLoss;
}

function generate_new_schedule(schedule, numberOfChanges) {
  // Kopiramo raspored kako ne bismo mijenjali original
  let newSchedule = JSON.parse(JSON.stringify(schedule));

  for (let i = 0; i < numberOfChanges; i++) {
    // Nasumično odabiremo dva indeksa iz rasporeda za zamjenu
    let idx1 = Math.floor(Math.random() * newSchedule.length);
    let idx2 = Math.floor(Math.random() * newSchedule.length);

    // Zamjenjujemo samo timeIdx
    let tempTimeIdx = newSchedule[idx1].timeIdx;
    newSchedule[idx1].timeIdx = newSchedule[idx2].timeIdx;
    newSchedule[idx2].timeIdx = tempTimeIdx;
  }

  return newSchedule;
}

function update_schedule(schedule, number_of_iterations) {
  let current_loss = calculate_loss(schedule);

  for (let i = 0; i < number_of_iterations; i++) {
    // Generišite novi raspored na osnovu neke strategije
    // Ovdje pretpostavljamo da generate_new_schedule vraća novi raspored sa određenim brojem promjena
    let new_schedule = generate_new_schedule(schedule, 5); // Broj izmjena može biti prilagođen

    // Izračunajte loss za novi raspored
    let new_loss = calculate_loss(new_schedule);

    // Ako je novi raspored bolji, ažurirajte trenutni raspored
    if (new_loss < current_loss) {
      schedule = new_schedule;
      current_loss = new_loss;
    }
  }

  return schedule;
}

// Define the cost function
function cost(x) {
  // temporaly cost function
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += x[i].timeIdx * x[i].timeIdx;
  }
  return sum;
}

function cost_2(x) {
  let sum = 0;
  sum += checkProfessorBreakAndNumOfLessons(x);
  sum += checkForSameProfessorDifferentClass(x);
  sum += checkClassGapsAndNumOfLessons(x); // commented to make professor conditions work first
  sum += checkForSameClassDifferentSubject(x);
  return sum;
}

const cell1Test = {
  professorIdx: 0,
  timeIdx: 0,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 0,
};
const cell2Test = {
  professorIdx: 0,
  timeIdx: 1,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 1,
};
const cell3Test = {
  professorIdx: 0,
  timeIdx: 2,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 2,
};
const cell4Test = {
  professorIdx: 0,
  timeIdx: 3,
  subjectIdx: 0,
  classroomIdx: 15,
  classIdx: 3,
};

const tempSolution3 = [cell1Test, cell2Test, cell3Test, cell4Test];

const initialSolutionTest = JSON.parse(
  JSON.stringify([
    cell1,
    cell2,
    cell3,
    cell4,
    cell5,
    cell6,
    cell7,
    cell8,
    cell9,
    cell10,
    cell11,
    cell12,
    cell13,
    cell14,
    cell15,
    cell16,
    cell17,
    cell18,
    cell19,
    cell20,
    cell21,
    cell22,
    cell23,
    cell24,
    cell25,
    cell26,
    cell27,
    cell28,
    cell29,
    cell30,
    cell31,
    cell32,
    cell33,
    cell34,
    cell35,
    cell36,
    cell37,
    cell38,
    cell39,
    cell40,
    cell41,
    cell42,
    cell43,
    cell44,
    cell45,
    cell46,
    cell47,
    cell48,
    cell49,
    cell50,
    cell51,
    cell52,
    cell53,
    cell54,
    cell55,
    cell56,
    cell57,
    cell58,
    cell59,
    cell60,
    cell61,
    cell62,
    cell63,
    cell64,
    cell65,
    cell66,
    cell67,
    cell68,
    cell69,
    cell70,
    cell71,
    cell72,
    cell73,
    cell74,
    cell75,
    cell76,
    cell77,
    cell78,
    cell79,
    cell80,
    cell81,
    cell82,
    cell83,
    cell84,
    cell85,
    cell86,
    cell87,
    cell88,
    cell89,
    cell90,
    cell91,
    cell92,
    cell93,
    cell94,
    cell95,
    cell96,
    cell97,
    cell98,
    cell99,
    cell100,
    cell101,
    cell102,
    cell103,
    cell104,
  ])
);
//console.log(cost_2(initialSolution1)); // hardcoded solution has no gaps and 4 lessons every day but checkIfProfessorDayIsContinousOrWithOneBreak returns -5020

console.log(cost_2(initialSolutionTest));

function switchTimes(arrayTimes, arraySolution) {
  let arrayTemp = arraySolution;
  // switch old timeslots with new timeslots
  for (let i = 0; i < arrayTimes.length; i++) {
    arrayTemp[i].timeIdx = arrayTimes[i];
  }
  return arrayTemp;
}

// bat algorithm for finding best timeslots for tempSolution, rewrites the tempSolution with new timeslots
// bestBat variable includes best timeslots for tempSolution
function batAlgorithm(
  costFunc,
  saveRate = 100,
  maxGen = 1000,
  popSize = 50,
  solution = tempSolution2,
  maxLoudness = 2,
  maxPulseRate = 1,
  fMin = 0,
  fMax = 10,
  lowerBound = 0,
  upperBound = time.length - 1,
  tempSolution,
  setTempSolution
) {
  if (!costFunc)
    throw new Error(
      "Please pass a valid cost function for your optimization problems"
    );
  const ALPHA = 0.9;
  const GAMMA = 0.9;

  // parameters initialization using uniform distribution
  let position = [];
  let velocity = [];
  let loudness = [];
  let pulseRate = [];
  let frequency = [];
  let newPosition = []; // bats local array used to calculate bats new position at each generation, before acceptation

  for (let i = 0; i < popSize; i++) {
    loudness[i] = getRdn(1, maxLoudness);
    pulseRate[i] = getRdn(0, maxPulseRate);
    frequency[i] = getRdn(fMin, fMax);
    position[i] = [];
    velocity[i] = [];
    newPosition[i] = [];

    for (let j = 0; j < solution.length; j++) {
      position[i][j] = Math.round(getRdn(lowerBound, upperBound));
      velocity[i][j] = getRdn(-3, 3);
    }
  }

  // evaluate the bats after initialization
  let cost = [];
  for (let i = 0; i < popSize; i++) {
    cost[i] = costFunc(switchTimes(position[i], solution));
  }

  let bestBat;
  // cycle through each generation

  for (let gen = 1; gen <= maxGen; gen++) {
    let indexMax = cost.indexOf(Math.max(...cost)); // best bat index so far
    bestBat = position[indexMax]; // best bat so far

    if (gen % saveRate === 0 || gen === 1) {
      let data = {};

      data.gen = gen;
      data.loudness = loudness;
      data.pulseRate = pulseRate;
      data.frequency = frequency;
      data.position = position;
      data.velocity = velocity;
      data.bestBat = bestBat;
    }

    // cycle through the population
    for (let i = 0; i < popSize; i++) {
      // getRdn(0,1) = beta
      frequency[i] = fMin + (fMax - fMin) * getRdn(0, 1); // assign new frequency to each bat (2)
      for (let j = 0; j < solution.length; j++) {
        velocity[i][j] =
          velocity[i][j] + (position[i][j] - bestBat[j]) * frequency[i]; // assign new velocity to each bat (3)
        newPosition[i][j] = Math.round(position[i][j] + velocity[i][j]); // creating a new position that is not yet assigned to the bat (4)
        newPosition[i][j] = checkBound(
          newPosition[i][j],
          lowerBound,
          upperBound
        );
      }

      // generate a local solution around the best solution
      if (getRdn(0, 1) > pulseRate[i]) {
        for (let j = 0; j < solution.length; j++) {
          // getRdn(-1, 1) = epsilon
          newPosition[i][j] = Math.round(
            bestBat[j] + getRdn(-1, 1) * average(loudness)
          ); // random walk (5)
          newPosition[i][j] = checkBound(
            newPosition[i][j],
            lowerBound,
            upperBound
          );
        }
      }

      let newCost = costFunc(switchTimes(newPosition[i], solution)); // bat 'newPosition's cost

      // tr y to accept the new solution
      if (getRdn(0, 1) < loudness[i] || newCost >= cost[i]) {
        // new solution accepted, assigning new position to each bat
        for (let j = 0; j < solution.length; j++) {
          position[i][j] = newPosition[i][j];
        }
        cost[i] = newCost;
        loudness[i] = loudness[i] * ALPHA; // loudness update (6)
        pulseRate[i] = pulseRate[i] * (1 - Math.exp(-GAMMA * gen)); // pulse rate update (6)
      }
    }
  }

  let newSolution = solution;
  setTempSolution(newSolution);
  solution = switchTimes(bestBat, solution);
  return solution;
}

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

const initialSolution1 = [
  cell1,
  cell2,
  cell3,
  cell4,
  cell5,
  cell6,
  cell7,
  cell8,
  cell9,
  cell10,
  cell11,
  cell12,
  cell13,
  cell14,
  cell15,
  cell16,
  cell17,
  cell18,
  cell19,
  cell20,
  cell21,
  cell22,
  cell23,
  cell24,
  cell25,
  cell26,
  cell27,
  cell28,
  cell29,
  cell30,
  cell31,
  cell32,
  cell33,
  cell34,
  cell35,
  cell36,
  cell37,
  cell38,
  cell39,
  cell40,
  cell41,
  cell42,
  cell43,
  cell44,
  cell45,
  cell46,
  cell47,
  cell48,
  cell49,
  cell50,
  cell51,
  cell52,
  cell53,
  cell54,
  cell55,
  cell56,
  cell57,
  cell58,
  cell59,
  cell60,
  cell61,
  cell62,
  cell63,
  cell64,
  cell65,
  cell66,
  cell67,
  cell68,
  cell69,
  cell70,
  cell71,
  cell72,
  cell73,
  cell74,
  cell75,
  cell76,
  cell77,
  cell78,
  cell79,
  cell80,
  cell81,
  cell82,
  cell83,
  cell84,
  cell85,
  cell86,
  cell87,
  cell88,
  cell89,
  cell90,
  cell91,
  cell92,
  cell93,
  cell94,
  cell95,
  cell96,
  cell97,
  cell98,
  cell99,
  cell100,
  cell101,
  cell102,
  cell103,
  cell104,
];
//console.log(cost_2(initialSolution1)); // hardcoded solution has no gaps and 4 lessons every day but checkIfProfessorDayIsContinousOrWithOneBreak returns -5020

function getAllProfessors(schedule) {
  const professorIndices = new Set();

  for (let cell of schedule) {
    professorIndices.add(cell.professorIdx);
  }

  return Array.from(professorIndices);
}

function canMoveClass(schedule, classToMove, newTimeIdx) {
  // Ovdje provjeravamo da li se trazeni cas moze pomjeriti unazad
  // na novi vremenski indeks/termin
  for (let otherClass of schedule) {
    if (otherClass !== classToMove && otherClass.timeIdx === newTimeIdx) {
      if (
        otherClass.classroomIdx === classToMove.classroomIdx ||
        otherClass.classIdx === classToMove.classIdx
      ) {
        return false;
      }
    }
  }
  return true;
}

function isScheduleValid(schedule) {
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      const class1 = schedule[i];
      const class2 = schedule[j];

      if (class1.timeIdx === class2.timeIdx) {
        if (
          class1.professorIdx === class2.professorIdx ||
          class1.classroomIdx === class2.classroomIdx ||
          class1.classIdx === class2.classIdx
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function optimizeScheduleByProfessor(initialSolution, setTempSolution) {
  const professors = getAllProfessors(initialSolution);
  let schedule = [...initialSolution];

  for (let professor of professors) {
    let professorsClasses = schedule.filter(
      (c) => c.professorIdx === professor
    );
    // Sortiranje časova po  terminu
    professorsClasses.sort((a, b) => a.timeIdx - b.timeIdx);

    let earliestAvailableTime = 0;
    for (let classToMove of professorsClasses) {
      while (earliestAvailableTime < classToMove.timeIdx) {
        // Pokusavamo vratiti cas unazad na ustrb profesora
        // Ako je dat neki termin daleko, a studentima se moze ubaciti taj termin
        // onda ga ubacimo u najraniji moguci
        // Ovim smo osigurali da je raspored studentima prepunjen
        if (canMoveClass(schedule, classToMove, earliestAvailableTime)) {
          classToMove.timeIdx = earliestAvailableTime;
          break;
        }
        earliestAvailableTime++;
      }
      // Updateovanje najranijeg slobodnog vremena za sljedeći čas
      earliestAvailableTime = classToMove.timeIdx + 1;
    }
  }
  setTempSolution(schedule);

  return schedule;
}

export default function MainView() {
  const { selectedClassIdx, setSelectedClassIdx, schedule, setSchedule } =
    useContext(ScheduleContext);
  console.log(selectedClassIdx, schedule);

  let initialSolution = [
    cell1,
    cell2,
    cell3,
    cell4,
    cell5,
    cell6,
    cell7,
    cell8,
    cell9,
    cell10,
    cell11,
    cell12,
    cell13,
    cell14,
    cell15,
    cell16,
    cell17,
    cell18,
    cell19,
    cell20,
    cell21,
    cell22,
    cell23,
    cell24,
    cell25,
    cell26,
    cell27,
    cell28,
    cell29,
    cell30,
    cell31,
    cell32,
    cell33,
    cell34,
    cell35,
    cell36,
    cell37,
    cell38,
    cell39,
    cell40,
    cell41,
    cell42,
    cell43,
    cell44,
    cell45,
    cell46,
    cell47,
    cell48,
    cell49,
    cell50,
    cell51,
    cell52,
    cell53,
    cell54,
    cell55,
    cell56,
    cell57,
    cell58,
    cell59,
    cell60,
    cell61,
    cell62,
    cell63,
    cell64,
    cell65,
    cell66,
    cell67,
    cell68,
    cell69,
    cell70,
    cell71,
    cell72,
    cell73,
    cell74,
    cell75,
    cell76,
    cell77,
    cell78,
    cell79,
    cell80,
    cell81,
    cell82,
    cell83,
    cell84,
    cell85,
    cell86,
    cell87,
    cell88,
    cell89,
    cell90,
    cell91,
    cell92,
    cell93,
    cell94,
    cell95,
    cell96,
    cell97,
    cell98,
    cell99,
    cell100,
    cell101,
    cell102,
    cell103,
    cell104,
  ];
  const [tempSolution, setTempSolution] = useState(initialSolution);
  const groupedLessons = {};
  tempSolution.forEach((lesson) => {
    const professorName = professors[lesson.professorIdx];
    if (!groupedLessons[professorName]) {
      groupedLessons[professorName] = [];
    }
    groupedLessons[professorName].push(lesson);
  });

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

  /* Commented just to show solution made by hand */
  useEffect(() => {
    optimizeScheduleByProfessor(initialSolution, setTempSolution);
    /*
    batAlgorithm(
      cost_2,
      150,
      10000,
      100,
      initialSolution,
      2,
      1,
      -10,
      10,
      0,
      time.length - 1,
      tempSolution,
      setTempSolution
    ); 
    */
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: "70px", pl: 0, width: "100%" }}>
        <Box display="flex" justifyContent="center">
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="schedule table">
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle}>Professor</TableCell>
                  {time.map((timeslot, index) => (
                    <TableCell key={`head-cell-${index}`} sx={tableHeaderStyle}>
                      {timeslot}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(groupedLessons).map((professorName, index) => (
                  <TableRow key={`row-${index}`}>
                    <TableCell component="th" scope="row" sx={tableCellStyle}>
                      {professorName}
                    </TableCell>
                    {time.map((_, timeslotIndex) =>
                      renderCell(timeslotIndex, groupedLessons[professorName])
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box>
          {classes.map((className, index) => (
            <Link href={"/class"}>
              <Button
                id={className}
                onClick={() => {
                  console.log("clicked ", index);
                  setSelectedClassIdx(index);
                  setSchedule(initialSolutionTest);
                }}
              >
                {className}
              </Button>
            </Link>
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
