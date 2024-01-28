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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  scheduleExample1,
  subjectsExample,
  professorsExample,
  classExample,
  classroomsExample,
  timeExample,
} from "@/utils/data";

import React, { useState, useEffect, useContext } from "react";
import ScheduleContext from "@/context/scheduleContext";
import Link from "next/link";
import jstat from "jstat";
import { bool } from "random-js";

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    TABU SEACH    ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

const generateRandomGammaInteger = (shape, scale, minValue, maxValue) => {
  // Generate a random number from the gamma distribution
  let randomNumber = jstat.gamma.sample((shape * maxValue) / 5, scale) + 1;
  randomNumber = randomNumber * (Math.floor(Math.random() * 5) + 1);

  // Round to the nearest integer
  const roundedNumber = Math.round(randomNumber);

  // Ensure the value is within the specified range
  const finalNumber = Math.min(Math.max(roundedNumber, minValue), maxValue);

  return finalNumber;
};

function cost_2(x, professors, classes, times) {
  let sum = 0;
  sum += checkProfessorBreakAndNumOfLessons(x, professors, classes, times);
  sum += checkForSameProfessorDifferentClass(x, professors, classes, times);
  sum += checkClassGapsAndNumOfLessons(x, professors, classes, times); // commented to make professor conditions work first
  sum += checkForSameClassDifferentSubject(x, professors, classes, times);
  return sum;
}

function switchTimes(arrayTimes, arraySolution) {
  let arrayTemp = JSON.parse(JSON.stringify(arraySolution));
  // switch old timeslots with new timeslots
  for (let i = 0; i < arrayTimes.length; i++) {
    arrayTemp[i].timeIdx = arrayTimes[i];
  }
  return arrayTemp;
}

// tabu search
function generateNeighbors(schedule, number) {
  let neighbors = [];
  const numberOfChanges = Math.floor(schedule.length / 2);

  for (let i = 0; i < numberOfChanges; i++) {
    let newSchedule = JSON.parse(JSON.stringify(schedule));
    let randomIndex = Math.floor(Math.random() * newSchedule.length);
    //let randomChange = Math.random() > 0.5 ? "timeIdx" : "classroomIdx"; switching rooms not efective, especially by using a 50/50 aproach with timeslots

    //if (randomChange === "timeIdx") {
    newSchedule[randomIndex].timeIdx = Math.floor(Math.random() * number);
    /*
    } else {
      newSchedule[randomIndex].classroomIdx = Math.floor(
        Math.random() * classrooms.length
      );
    }
    */
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

function tabuSearchOptimization(
  initialSchedule,
  number_of_iterations,
  lowerBound,
  upperBound,
  professors,
  classes,
  times,
  distribution
) {
  let currentSchedule = initialSchedule;
  let position = [];

  let positionList = [];
  console.log("Pretražujemo inicijalno rješenje...");

  for (let i = 0; i < 100; i++) {
    positionList[i] = [];
    if (distribution == "random") {
      for (let j = 0; j < currentSchedule.length; j++) {
        positionList[i][j] = Math.round(getRdn(lowerBound, upperBound));
      }
    }
    if (distribution == "gamma5") {
      for (let j = 0; j < currentSchedule.length; j++) {
        positionList[i][j] = generateRandomGammaInteger(5, 0.45, 0, upperBound);
      }
    }

    if (distribution == "gamma9") {
      for (let j = 0; j < currentSchedule.length; j++) {
        positionList[i][j] = generateRandomGammaInteger(9, 0.25, 0, upperBound);
      }
    }
  }

  let costList = [];
  for (let i = 0; i < 100; i++) {
    costList[i] = cost_2(
      switchTimes(positionList[i], currentSchedule),
      professors,
      classes,
      times
    );
  }

  position = positionList[costList.indexOf(Math.max(...costList))];

  console.log(
    "Trošak inicijalnog rješenja: ",
    cost_2(switchTimes(position, currentSchedule), professors, classes, times)
  );
  currentSchedule = switchTimes(position, currentSchedule);
  let currentCost = cost_2(currentSchedule, professors, classes, times);
  let tabuList = [];
  let bestSchedule = currentSchedule;
  let bestCost = currentCost;

  for (let i = 0; i < number_of_iterations; i++) {
    // Generisanje susjednih rasporeda
    let neighbors = generateNeighbors(currentSchedule, upperBound + 1);

    // Filtriranje onih koji su već na tabu listi
    neighbors = neighbors.filter(
      (schedule) => !isInTabuList(schedule, tabuList)
    );

    let bestNeighbor = null;
    let bestNeighborCost = -Infinity;

    // Pronalaženje najboljeg susjeda koji nije na tabu listi
    for (let neighbor of neighbors) {
      let cost = cost_2(neighbor, professors, classes, times);
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
  console.log(
    "Trošak rješenja",
    cost_2(bestSchedule, professors, classes, times)
  );
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
  upperBound,
  professors,
  classes,
  times,
  distribution
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
  if (distribution == "random") {
    for (let i = 0; i < solutionInput.length; i++) {
      random[i] = Math.round(getRdn(lowerBound, upperBound));
    }
  }
  if (distribution == "gamma5") {
    for (let i = 0; i < solutionInput.length; i++) {
      random[i] = generateRandomGammaInteger(5, 0.45, 0, upperBound);
    }
  }
  if (distribution == "gamma9") {
    for (let i = 0; i < solutionInput.length; i++) {
      random[i] = generateRandomGammaInteger(9, 0.25, 0, upperBound);
    }
  }
  console.log(
    "Trošak inicijalnog rješenja: ",
    costFunc(switchTimes(random, solutionInput), professors, classes, times)
  );
  for (let i = 0; i < popSize; i++) {
    loudness[i] = getRdn(0, maxLoudness);
    pulseRate[i] = getRdn(0, maxPulseRate);
    frequency[i] = getRdn(fMin, fMax);
    position[i] = [];
    velocity[i] = [];
    newPosition[i] = [];

    if (distribution == "random") {
      for (let j = 0; j < solutionInput.length; j++) {
        position[i][j] = Math.round(getRdn(lowerBound, upperBound));
        velocity[i][j] = getRdn(-1, 1);
      }
    }
    if (distribution == "gamma5") {
      for (let j = 0; j < solutionInput.length; j++) {
        position[i][j] = generateRandomGammaInteger(5, 0.45, 0, upperBound);
        velocity[i][j] = getRdn(-1, 1);
      }
    }

    if (distribution == "gamma9") {
      for (let j = 0; j < solutionInput.length; j++) {
        position[i][j] = generateRandomGammaInteger(9, 0.25, 0, upperBound);
        velocity[i][j] = getRdn(-1, 1);
      }
    }
  }

  let solution = JSON.parse(JSON.stringify(switchTimes(random, solutionInput)));

  // evaluate the bats after initialization
  let cost = [];

  for (let i = 0; i < popSize; i++) {
    cost[i] = costFunc(
      switchTimes(position[i], solution),
      professors,
      classes,
      times
    );
  }

  let bestBat;
  let lastBat = position[0];
  let counter = 0;
  let randomized = false;
  let nextCounter = 0;

  // cycle through each generation
  for (let gen = 1; gen <= maxGen; gen++) {
    let indexMax = cost.indexOf(Math.max(...cost)); // best bat index so far
    console.log(cost[indexMax]);

    bestBat = position[indexMax]; // best bat so far
    solution = JSON.parse(JSON.stringify(switchTimes(bestBat, solution)));

    if (
      costFunc(switchTimes(lastBat, solution), professors, classes, times) <
      costFunc(switchTimes(bestBat, solution), professors, classes, times)
    ) {
      lastBat = bestBat;
      counter = 0;
    } else {
      counter = counter + 1;
      if (randomized) {
        nextCounter = nextCounter + 1;
      }
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

      let newCost = costFunc(
        switchTimes(newPosition[i], solution),
        professors,
        classes,
        times
      ); // bat 'newPosition's cost

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

    if ((counter >= 50 && randomized == false) || nextCounter >= 400) {
      nextCounter = 0;
      randomized = true;
      let indexMax = cost.indexOf(Math.max(...cost)); // best bat index so far
      for (let i = 0; i < popSize; i++) {
        if (
          costFunc(
            switchTimes(indexMax, solution),
            professors,
            classes,
            times
          ) !=
          costFunc(
            switchTimes(position[i], solution),
            professors,
            classes,
            times
          )
        ) {
          position[i] = [];

          for (let j = 0; j < solutionInput.length; j++) {
            if (distribution == "random") {
              for (let j = 0; j < solutionInput.length; j++) {
                position[i][j] = Math.round(getRdn(lowerBound, upperBound));
              }
            }
            if (distribution == "gamma5") {
              for (let j = 0; j < solutionInput.length; j++) {
                position[i][j] = generateRandomGammaInteger(
                  5,
                  0.45,
                  0,
                  upperBound
                );
              }
            }
            if (distribution == "gamma9") {
              for (let j = 0; j < solutionInput.length; j++) {
                position[i][j] = generateRandomGammaInteger(
                  9,
                  0.25,
                  0,
                  upperBound
                );
              }
            }
          }
        }
      }
      counter = 0;
    }
  }

  solution = JSON.parse(JSON.stringify(switchTimes(bestBat, solution)));
  let indexMax = cost.indexOf(Math.max(...cost)); // best bat index so far
  console.log(cost[indexMax]);
  console.log(
    "Trošak rješenja:",
    costFunc(solution, professors, classes, times)
  );
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

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    2-OPT ALGORITHM    /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

function generateImprovedSchedule(currentSchedule, professors, classes, times) {
  let bestSchedule = JSON.parse(JSON.stringify(currentSchedule));
  let bestCost = cost_2(currentSchedule, professors, classes, times);

  for (let i = 0; i < currentSchedule.length; i++) {
    for (let j = 0; j < currentSchedule.length; j++) {
      let modifiedSchedule = modifyScheduleTime(bestSchedule, i, j);
      let modifiedCost = cost_2(modifiedSchedule, professors, classes, times);

      if (modifiedCost > bestCost) {
        bestSchedule = JSON.parse(JSON.stringify(modifiedSchedule));
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

function optimizeScheduleWith2Opt(
  initialSchedule,
  lowerBound,
  upperBound,
  professors,
  classes,
  times,
  distribution
) {
  let bestSchedule = JSON.parse(JSON.stringify(initialSchedule));
  let position = [];

  let positionList = [];
  console.log("Pretražujemo inicijalno rješenje...");

  for (let i = 0; i < 100; i++) {
    positionList[i] = [];
    if (distribution == "random") {
      for (let j = 0; j < initialSchedule.length; j++) {
        positionList[i][j] = Math.round(getRdn(lowerBound, upperBound));
      }
    }
    if (distribution == "gamma5") {
      for (let j = 0; j < initialSchedule.length; j++) {
        positionList[i][j] = generateRandomGammaInteger(5, 0.45, 0, upperBound);
      }
    }

    if (distribution == "gamma9") {
      for (let j = 0; j < initialSchedule.length; j++) {
        positionList[i][j] = generateRandomGammaInteger(9, 0.25, 0, upperBound);
      }
    }
  }

  let costList = [];
  for (let i = 0; i < 100; i++) {
    costList[i] = cost_2(
      switchTimes(positionList[i], initialSchedule),
      professors,
      classes,
      times
    );
  }

  position = positionList[costList.indexOf(Math.max(...costList))];

  console.log(
    "Trošak inicijalnog rješenja: ",
    cost_2(switchTimes(position, bestSchedule), professors, classes, times)
  );
  bestSchedule = switchTimes(position, bestSchedule);

  let bestCost = cost_2(
    switchTimes(position, bestSchedule),
    professors,
    classes,
    times
  );

  while (true) {
    let two_opt_solution = generateImprovedSchedule(
      bestSchedule,
      professors,
      classes,
      times
    );
    console.log(bestCost);
    if (
      cost_2(
        switchTimes(position, two_opt_solution),
        professors,
        classes,
        times
      ) > bestCost
    ) {
      bestCost = cost_2(
        switchTimes(position, two_opt_solution),
        professors,
        classes,
        times
      );
      bestSchedule = JSON.parse(JSON.stringify(two_opt_solution));
    } else {
      break;
    }
  }

  console.log(
    "Trošak rješenja: ",
    cost_2(switchTimes(position, bestSchedule), professors, classes, times)
  );
  return bestSchedule;
}

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
    setTimes,
    setSubjects,
    setClassrooms,
    setClasses,
    setProfessors,
  } = useContext(ScheduleContext);

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
        timeslotIndex < times.length - 1
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

    // setRefresh(!refresh);
  }, [schedule]);

  const [tempSolution, setTempSolution] = useState(schedule);
  const [groupedLessons, setGroupedLessons] = useState({});
  const [refresh, setRefresh] = useState(true);
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
      times.length - 1,
      professors,
      classes,
      times,
      distribution
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
    setSchedule(batSolution);
    setGroupedLessons(groupedLessons);
  };
  const handleTabuClicked = () => {
    const tabuSolution = tabuSearchOptimization(
      schedule,
      10000,
      0,
      times.length - 1,
      professors,
      classes,
      times,
      distribution
    );
    const groupedLessons = {};
    tabuSolution.forEach((lesson) => {
      const professorName = professors[lesson.professorIdx];
      if (!groupedLessons[professorName]) {
        groupedLessons[professorName] = [];
      }
      groupedLessons[professorName].push(lesson);
    });
    setTempSolution(tabuSolution);
    setSchedule(tabuSolution);
    setGroupedLessons(groupedLessons);
  };
  const handle2OptClicked = () => {
    const TwoOptSolution = optimizeScheduleWith2Opt(
      schedule,
      0,
      times.length - 1,
      professors,
      classes,
      times,
      distribution
    );
    const groupedLessons2 = {};
    TwoOptSolution.forEach((lesson) => {
      const professorName = professors[lesson.professorIdx];
      if (!groupedLessons2[professorName]) {
        groupedLessons2[professorName] = [];
      }
      groupedLessons2[professorName].push(lesson);
    });
    setTempSolution(TwoOptSolution);
    setGroupedLessons(groupedLessons2);
    setSchedule(TwoOptSolution);
  };
  const handleExample2Clicked = () => {
    setTimes(timeExample);
    setSubjects(subjectsExample);
    setClassrooms(classroomsExample);
    setClasses(classExample);
    setProfessors(professorsExample);
    setSchedule(scheduleExample1);
    const groupedLessons = {};
    scheduleExample1.forEach((lesson) => {
      const professorName = professors[lesson.professorIdx];
      if (!groupedLessons[professorName]) {
        groupedLessons[professorName] = [];
      }
      groupedLessons[professorName].push(lesson);
    });
    setTempSolution(scheduleExample1);
    setGroupedLessons(groupedLessons);
  };
  const [distribution, setDistribution] = useState("random"); // Default value

  const handleChange = (event) => {
    setDistribution(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: "70px", pl: 0, width: "100%" }}>
        <Box>
          <Button onClick={() => handleBatClicked()}>Run Bat algorithm</Button>
          <Button onClick={() => handleTabuClicked()}>
            Run Tabu seach algorithm
          </Button>
          <Button onClick={() => handle2OptClicked()}>
            Run 2Opt seach algorithm
          </Button>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="distribution"
              name="distribution"
              value={distribution}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel
                value="random"
                control={<Radio />}
                label="Random"
              />
              <FormControlLabel
                value="gamma5"
                control={<Radio />}
                label="Gamma shape=9 scale=0.25"
              />
              <FormControlLabel
                value="gamma9"
                control={<Radio />}
                label="Gamma shape=5, scale=0.45"
              />
            </RadioGroup>
          </FormControl>
          <Button onClick={() => handleExample2Clicked()}>
            Load example 2
          </Button>
        </Box>
        <Box display="flex" justifyContent="center">
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="schedule table">
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle}>Professor</TableCell>
                  {times.map((timeslot, index) => (
                    <TableCell key={`head-cell-${index}`} sx={tableHeaderStyle}>
                      {timeslot}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedLessons &&
                  Object.keys(groupedLessons).map((professorName, index) => (
                    <TableRow key={`row-${index}`}>
                      <TableCell component="th" scope="row" sx={tableCellStyle}>
                        {professorName}
                      </TableCell>
                      {times.map((_, timeslotIndex) =>
                        renderCell(timeslotIndex, groupedLessons[professorName])
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "20px",
            fontSize: 20,
          }}
        >
          <Box>Rasporedi za razrede:</Box>
          {classes.map((className, index) => (
            <Link href={"/class"}>
              <Button
                id={className}
                onClick={() => {
                  setSelectedClassIdx(index);
                }}
              >
                {className}
              </Button>
            </Link>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "20px",
            fontSize: 20,
          }}
        >
          <Box>Rasporedi za kabinete:</Box>
          {classrooms.map((classroom, index) => (
            <Link href={"/classroom"}>
              <Button
                id={classroom}
                onClick={() => {
                  setSelectedClassroomIdx(index);
                }}
              >
                {classroom}
              </Button>
            </Link>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "20px",
            fontSize: 20,
          }}
        >
          <Box>Rasporedi za profesore:</Box>
          {professors.map((professor, index) => (
            <Link href={"/professor"}>
              <Button
                id={professor}
                onClick={() => {
                  setSelectedProfessorIdx(index);
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
