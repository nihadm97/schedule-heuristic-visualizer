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
import jstat from "jstat";

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    TABU SEACH    ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

const generateRandomGammaInteger = (shape, scale, minValue, maxValue) => {
  // Generate a random number from the gamma distribution
  let randomNumber = jstat.gamma.sample(shape, scale) + 1;
  randomNumber = randomNumber * (Math.floor(Math.random() * 5) + 1);

  // Round to the nearest integer
  const roundedNumber = Math.round(randomNumber);

  // Ensure the value is within the specified range
  const finalNumber = Math.min(Math.max(roundedNumber, minValue), maxValue);

  return finalNumber;
};

function cost_2(x) {
  let sum = 0;
  sum += checkProfessorBreakAndNumOfLessons(x);
  sum += checkForSameProfessorDifferentClass(x);
  sum += checkClassGapsAndNumOfLessons(x); // commented to make professor conditions work first
  sum += checkForSameClassDifferentSubject(x);
  return sum;
}

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

function switchTimes(arrayTimes, arraySolution) {
  let arrayTemp = JSON.parse(JSON.stringify(arraySolution));
  // switch old timeslots with new timeslots
  for (let i = 0; i < arrayTimes.length; i++) {
    arrayTemp[i].timeIdx = arrayTimes[i];
  }
  return arrayTemp;
}

// tabu search
function generateNeighbors(schedule) {
  let neighbors = [];
  const numberOfChanges = Math.floor(schedule.length / 2);

  for (let i = 0; i < numberOfChanges; i++) {
    let newSchedule = JSON.parse(JSON.stringify(schedule));
    let randomIndex = Math.floor(Math.random() * newSchedule.length);
    let randomChange = Math.random() > 0.5 ? "timeIdx" : "classroomIdx";

    if (randomChange === "timeIdx") {
      newSchedule[randomIndex].timeIdx = Math.floor(
        Math.random() * time.length
      );
    } else {
      newSchedule[randomIndex].classroomIdx = Math.floor(
        Math.random() * classrooms.length
      );
    }

    neighbors.push(newSchedule);
  }

  return neighbors;
}

function isInTabuList(schedule, tabuList) {
  let scheduleString = JSON.stringify(schedule);
  return tabuList.includes(scheduleString);
}

function updateTabuList(tabuList, schedule, maxSize = 100) {
  let scheduleString = JSON.stringify(schedule);
  if (!tabuList.includes(scheduleString)) {
    tabuList.push(scheduleString);
  }

  if (tabuList.length > maxSize) {
    tabuList.shift();
  }
}

function tabuSearchOptimization(initialSchedule, number_of_iterations) {
  let currentSchedule = initialSchedule;
  let position = [];
  let lowerBound = 0;
  let upperBound = time.length - 1;
  for (let i = 0; i < currentSchedule.length; i++) {
    position[i] = generateRandomGammaInteger(9, 0.25, 0, time.length - 1); // Treshold -600000 for this distribution
    //position[i] = generateRandomGammaInteger(5, 0.45, 0, time.length - 1); // Treshold -700000 for this distribution
    //position[i] = Math.round(getRdn(lowerBound, upperBound)); // Treshold -450000 for this distribution
  }
  console.log("Pretražujemo inicijalno rješenje...");
  while (cost_2(switchTimes(position, currentSchedule)) < -600000) {
    //console.log(cost_2(switchTimes(position, currentSchedule)));
    for (let i = 0; i < currentSchedule.length; i++) {
      position[i] = generateRandomGammaInteger(9, 0.25, 0, time.length - 1); // Treshold -600000 for this distribution
      //position[i] = generateRandomGammaInteger(5, 0.45, 0, time.length - 1); // Treshold -700000 for this distribution
      //position[i] = Math.round(getRdn(lowerBound, upperBound)); // Treshold -450000 for this distribution
    }
  }
  console.log(
    "Trošak inicijalnog rješenja: ",
    cost_2(switchTimes(position, currentSchedule))
  );
  currentSchedule = switchTimes(position, currentSchedule);
  let currentCost = cost_2(currentSchedule);
  let tabuList = [];
  let bestSchedule = currentSchedule;
  let bestCost = currentCost;

  for (let i = 0; i < number_of_iterations; i++) {
    // Generisanje susjednih rasporeda
    let neighbors = generateNeighbors(currentSchedule);

    // Filtriranje onih koji su već na tabu listi
    neighbors = neighbors.filter(
      (schedule) => !isInTabuList(schedule, tabuList)
    );

    let bestNeighbor = null;
    let bestNeighborCost = -Infinity;

    // Pronalaženje najboljeg susjeda koji nije na tabu listi
    for (let neighbor of neighbors) {
      let cost = cost_2(neighbor);
      if (cost > bestNeighborCost && !isInTabuList(neighbor, tabuList)) {
        bestNeighbor = neighbor;
        bestNeighborCost = cost;
      }
    }

    // Ažuriranje trenutnog rasporeda i tabu liste
    if (bestNeighbor) {
      currentSchedule = bestNeighbor;
      currentCost = bestNeighborCost;
      updateTabuList(tabuList, bestNeighbor);

      // Ažuriranje najboljeg pronađenog rasporeda
      if (currentCost > bestCost) {
        console.log(currentCost);
        bestSchedule = currentSchedule;
        bestCost = currentCost;
      }
    }
  }

  // Vraćanje najboljeg rasporeda pronađenog tokom pretrage
  console.log("Trošak rješenja", cost_2(bestSchedule));
  return bestSchedule;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    BAT ALGORITHM    /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// bat algorithm for finding best timeslots for tempSolution, rewrites the tempSolution with new timeslots
// bestBat variable includes best timeslots for tempSolution
function batAlgorithm(
  costFunc,
  saveRate = 100,
  maxGen = 1000,
  popSize = 50,
  solutionInput = tempSolution2,
  maxLoudness = 0.5,
  maxPulseRate = 1,
  fMin = 0,
  fMax = 10,
  lowerBound = 0,
  upperBound = time.length - 1
  // tempSolution,
  // setTempSolution
) {
  if (!costFunc)
    throw new Error(
      "Please pass a valid cost function for your optimization problems"
    );
  const ALPHA = 0.99999;
  const GAMMA = 0.2;

  // parameters initialization using uniform distribution
  let position = [];
  let velocity = [];
  let loudness = [];
  let pulseRate = [];
  let frequency = [];
  let newPosition = []; // bats local array used to calculate bats new position at each generation, before acceptation

  let random = [];
  console.log("Pretražujemo inicijalno rješenje...");
  for (let i = 0; i < solutionInput.length; i++) {
    //random[i] = generateRandomGammaInteger(9, 0.25, 0, time.length - 1); // Treshold -600000 for this distribution
    //random[i] = generateRandomGammaInteger(5, 0.45, 0, time.length - 1); // Treshold -700000 for this distribution
    random[i] = Math.round(getRdn(lowerBound, upperBound)); // Treshold -450000 for this distribution
  }
  while (costFunc(switchTimes(random, solutionInput)) < -450000) {
    //console.log(costFunc(switchTimes(random, solutionInput)));
    for (let i = 0; i < solutionInput.length; i++) {
      //random[i] = generateRandomGammaInteger(9, 0.25, 0, time.length - 1); // Treshold -600000 for this distribution
      //random[i] = generateRandomGammaInteger(5, 0.45, 0, time.length - 1); // Treshold -700000 for this distribution
      random[i] = Math.round(getRdn(lowerBound, upperBound)); // Treshold -450000 for this distribution
    }
  }
  console.log(
    "Trošak inicijalnog rješenja: ",
    costFunc(switchTimes(random, solutionInput))
  );
  for (let i = 0; i < popSize; i++) {
    loudness[i] = getRdn(0, maxLoudness);
    pulseRate[i] = getRdn(0, maxPulseRate);
    frequency[i] = getRdn(fMin, fMax);
    position[i] = [];
    velocity[i] = [];
    newPosition[i] = [];

    for (let j = 0; j < solutionInput.length; j++) {
      //position[i][j] = generateRandomGammaInteger(9, 0.25, 0, time.length - 1); // Treshold -600000 for this distribution
      position[i][j] = Math.round(getRdn(lowerBound, upperBound)); // Treshold -450000 for this distribution
      //position[i][j] = generateRandomGammaInteger(5, 0.45, 0, time.length - 1); // Treshold -700000 for this distribution
      velocity[i][j] = getRdn(-1, 1);
    }
    while (costFunc(switchTimes(position[i], solutionInput)) < -450000) {
      //console.log(costFunc(switchTimes(position[i], solutionInput)));
      for (let j = 0; j < solutionInput.length; j++) {
        //position[i][j] = generateRandomGammaInteger(9, 0.25, 0, time.length - 1); // Treshold -700000 for this distribution
        position[i][j] = Math.round(getRdn(lowerBound, upperBound)); // Treshold -450000 for this distribution
        //position[i][j] = generateRandomGammaInteger(5, 0.45, 0, time.length - 1); // Treshold -800000 for this distribution
      }
    }
  }

  let solution = JSON.parse(JSON.stringify(switchTimes(random, solutionInput)));

  // evaluate the bats after initialization
  let cost = [];

  for (let i = 0; i < popSize; i++) {
    cost[i] = costFunc(switchTimes(position[i], solution));
  }

  let bestBat;
  let lastBat = position[0];
  let counter = 0;

  // cycle through each generation
  for (let gen = 1; gen <= maxGen; gen++) {
    let indexMax = cost.indexOf(Math.max(...cost)); // best bat index so far
    console.log(cost[indexMax]);

    bestBat = position[indexMax]; // best bat so far
    solution = JSON.parse(JSON.stringify(switchTimes(bestBat, solution)));

    if (
      costFunc(switchTimes(lastBat, solution)) <
      costFunc(switchTimes(bestBat, solution))
    ) {
      lastBat = bestBat;
      counter = 0;
    } else {
      counter = counter + 1;
    }

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

      // try to accept the new solution
      if (
        (getRdn(0, 1) < loudness[i] || newCost >= cost[i]) &&
        cost[i] != newCost
      ) {
        // new solution accepted, assigning new position to each bat
        for (let j = 0; j < solution.length; j++) {
          position[i][j] = newPosition[i][j];
        }
        cost[i] = newCost;
        loudness[i] = loudness[i] * ALPHA; // loudness update (6)
        pulseRate[i] = pulseRate[i] * (1 - Math.exp(-GAMMA * gen)); // pulse rate update (6)
      }
    }

    if (counter >= 50) {
      let indexMax = cost.indexOf(Math.max(...cost)); // best bat index so far
      for (let i = 0; i < popSize; i++) {
        if (
          costFunc(switchTimes(indexMax, solution)) !=
          costFunc(switchTimes(position[i], solution))
        ) {
          position[i] = [];

          for (let j = 0; j < solutionInput.length; j++) {
            // position[i][j] = generateRandomGammaInteger(
            //   10,
            //   2,
            //   0,
            //   time.length - 1
            // );
            // position[i][j] = generateRandomGammaInteger(
            //   5,
            //   0.45,
            //   0,
            //   time.length - 1
            // );
            position[i][j] = Math.round(getRdn(lowerBound, upperBound));
          }
        }
      }
      counter = 0;
    }
  }

  solution = JSON.parse(JSON.stringify(switchTimes(bestBat, solution)));
  let indexMax = cost.indexOf(Math.max(...cost)); // best bat index so far
  console.log(cost[indexMax]);
  console.log("Trošak rješenja:", costFunc(solution));
  let newSolution = JSON.parse(JSON.stringify(solution));
  // setTempSolution(newSolution);
  return solution;
}

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
});

// const renderCell = (timeslotIndex, professorLessons) => {
//   const lessonsInThisTimeslot = professorLessons.filter(
//     (lesson) => lesson.timeIdx === timeslotIndex
//   );

//   const cellStyles = {
//     bgcolor:
//       lessonsInThisTimeslot.length > 0 ? "secondary.main" : "background.paper",
//     color: lessonsInThisTimeslot.length > 0 ? "common.white" : "text.primary",
//     textAlign: "center",
//     borderRight:
//       timeslotIndex < time.length - 1 ? "1px solid rgba(224, 224, 224, 1)" : "",
//   };

//   return (
//     <TableCell key={`cell-${timeslotIndex}`} sx={cellStyles}>
//       {lessonsInThisTimeslot.map((lesson, idx) => (
//         <div key={idx}>
//           {classes[lesson.classIdx]}
//           <br />
//           {classrooms[lesson.classroomIdx]}
//           <br />
//           {subjects[lesson.subjectIdx]}
//         </div>
//       ))}
//     </TableCell>
//   );
// };

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

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    2-OPT ALGORITHM    /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

function generateImprovedSchedule(currentSchedule) {
  let bestSchedule = currentSchedule;
  let bestCost = cost_2(currentSchedule);

  for (let i = 0; i < currentSchedule.length; i++) {
    for (let j = 0; j < currentSchedule.length; j++) {
      let modifiedSchedule = modifyScheduleTime(bestSchedule, i, j);
      let modifiedCost = cost_2(modifiedSchedule);

      if (modifiedCost > bestCost) {
        bestSchedule = modifiedSchedule;
        bestCost = modifiedCost;
      }
    }
  }

  return bestSchedule;
}

// S ovom mijenjamo vremena
function modifyScheduleTime(schedule, index1, index2) {
  let newSchedule = JSON.parse(JSON.stringify(schedule));
  // Vršenje zamjene vremenskih indeksa između i-tog i j-tog časa
  let tempTimeIdx = newSchedule[index1].timeIdx;
  newSchedule[index1].timeIdx = newSchedule[index2].timeIdx;
  newSchedule[index2].timeIdx = tempTimeIdx;

  return newSchedule;
}

// S ovom mijenjamo ucionice
function modifyScheduleClass(schedule, index1, index2) {
  let newSchedule = JSON.parse(JSON.stringify(schedule));
  // Vršenje zamjene ucionica između i-tog i j-tog časa
  let tempClassroomIdx = newSchedule[index1].classroomIdx;
  newSchedule[index1].classroomIdx = newSchedule[index2].classroomIdx;
  newSchedule[index2].classroomIdx = tempClassroomIdx;

  return newSchedule;
}

function optimizeScheduleWith2Opt(initialSchedule, setTempSolution) {
  let bestSchedule = initialSchedule;
  let position = [];
  let lowerBound = 0;
  let upperBound = time.length - 1;
  for (let i = 0; i < bestSchedule.length; i++) {
    position[i] = Math.round(getRdn(lowerBound, upperBound));
  }
  switchTimes(position, bestSchedule);

  let bestCost = cost_2(bestSchedule);

  while (true) {
    let two_opt_solution = generateImprovedSchedule(bestSchedule);
    console.log(bestCost);
    if (cost_2(two_opt_solution) > bestCost) {
      bestCost = cost_2(two_opt_solution);
      bestSchedule = two_opt_solution;
    } else {
      break;
    }
  }

  setTempSolution(bestSchedule);
  return bestSchedule;
}

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

export default function MainView() {
  const {
    selectedClassIdx,
    setSelectedClassIdx,
    setSelectedClassroomIdx,
    setSelectedProfessorIdx,
    schedule,
    setSchedule,
    professors,
    classes,
    classrooms,
    subjects,
    times,
  } = useContext(ScheduleContext);
  console.log(
    "Context: ",
    schedule,
    professors,
    subjects,
    times,
    classes,
    classrooms
  );
  const renderCell = (timeslotIndex, professorLessons) => {
    const lessonsInThisTimeslot = professorLessons.filter(
      (lesson) => lesson.timeIdx === timeslotIndex
    );

    const cellStyles = {
      bgcolor:
        lessonsInThisTimeslot.length > 0
          ? "secondary.main"
          : "background.paper",
      color: lessonsInThisTimeslot.length > 0 ? "common.white" : "text.primary",
      textAlign: "center",
      borderRight:
        timeslotIndex < time.length - 1
          ? "1px solid rgba(224, 224, 224, 1)"
          : "",
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
  useEffect(() => {
    const groupedLessons = {};
    schedule.forEach((lesson) => {
      const professorName = professors[lesson.professorIdx];
      if (!groupedLessons[professorName]) {
        groupedLessons[professorName] = [];
      }
      groupedLessons[professorName].push(lesson);
    });
    setGroupedLessons(groupedLessons);
    //optimizeScheduleWith2Opt(initialSolution, setTempSolution);
  }, [schedule]);

  const [tempSolution, setTempSolution] = useState(initialSolution);
  const [groupedLessons, setGroupedLessons] = useState({});
  // const groupedLessons = {};
  // tempSolution.forEach((lesson) => {
  //   const professorName = professors[lesson.professorIdx];
  //   if (!groupedLessons[professorName]) {
  //     groupedLessons[professorName] = [];
  //   }
  //   groupedLessons[professorName].push(lesson);
  // });

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

  const handleBatClicked = () => {
    const batSolution = batAlgorithm(
      cost_2,
      100,
      1000,
      100,
      schedule,
      1.0,
      0.4,
      0,
      29,
      0,
      time.length - 1
    );
    const groupedLessons = {};
    batSolution.forEach((lesson) => {
      const professorName = professors[lesson.professorIdx];
      if (!groupedLessons[professorName]) {
        groupedLessons[professorName] = [];
      }
      groupedLessons[professorName].push(lesson);
    });
    setTempSolution(batSolution);
    setGroupedLessons(groupedLessons);
  };
  const handleTabuClicked = () => {
    const tabuSolution = tabuSearchOptimization(schedule, 10000);
    const groupedLessons = {};
    tabuSolution.forEach((lesson) => {
      const professorName = professors[lesson.professorIdx];
      if (!groupedLessons[professorName]) {
        groupedLessons[professorName] = [];
      }
      groupedLessons[professorName].push(lesson);
    });
    setTempSolution(tabuSolution);
    setGroupedLessons(groupedLessons);
  };
  /* Commented just to show solution made by hand */

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: "70px", pl: 0, width: "100%" }}>
        <Box>
          <Button onClick={() => handleBatClicked()}>Run Bat algorithm</Button>
          <Button onClick={() => handleTabuClicked()}>
            Run Tabu seach algorithm
          </Button>
        </Box>
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
        <Box sx={{ display: "flex", marginTop: "20px", fontSize: 20 }}>
          <Box>Rasporedi za razrede:</Box>
          {classes.map((className, index) => (
            <Link href={"/class"}>
              <Button
                id={className}
                onClick={() => {
                  //console.log("clicked ", index);
                  setSelectedClassIdx(index);
                  // console.log(schedule);
                  // setSchedule(initialSolutionTest);
                }}
              >
                {className}
              </Button>
            </Link>
          ))}
        </Box>
        <Box sx={{ display: "flex", marginTop: "20px", fontSize: 20 }}>
          <Box>Rasporedi za kabinete:</Box>
          {classrooms.map((classroom, index) => (
            <Link href={"/classroom"}>
              <Button
                id={classroom}
                onClick={() => {
                  //console.log("clicked ", index);
                  setSelectedClassroomIdx(index);
                  // setSchedule(initialSolutionTest);
                }}
              >
                {classroom}
              </Button>
            </Link>
          ))}
        </Box>
        <Box sx={{ display: "flex", marginTop: "20px", fontSize: 20 }}>
          <Box>Rasporedi za profesore:</Box>
          {professors.map((professor, index) => (
            <Link href={"/professor"}>
              <Button
                id={professor}
                onClick={() => {
                  //console.log("clicked ", index);
                  setSelectedClassIdx(index);
                  // setSchedule(initialSolutionTest);
                }}
              >
                {professor}
              </Button>
            </Link>
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
