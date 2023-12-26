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

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    HELPER FUNCTIONS    /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//  Function that checks if array has breaks between class times

//  checkForBreakBetweenClasses
// Returns 1 if theres a break
// returns -1 if there is no break
// return 0 if its different day

export const checkIfClassDayIsContinous = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    let hasBreak = checkForBreakBetweenClasses(arr[i + 1], arr[i]);
    if (hasBreak == 1) {
      if (hasBreak) return false; // we found a break
    } else if (hasBreak == -1 || hasBreak == 0) {
      continue;
    }
  }
  return true;
};

// export const checkIfProfessorDayIsContinousOrWithOneBreak = (arr) => {
//   let foundOneBreakInOneDay = false;
//   for (let i = 0; i < arr.length - 1; i++) {
//     if (arr[i + 1][0] == arr[i][0]) {
//       // If its still the same day m == m for example (monday == monday)
//       if (arr[i + 1][1] - arr[i][1] > 1) {
//         return false;
//       } else if (arr[i + 1][1] - arr[i][1] == 1) {
//         if (foundOneBreakInOneDay === true) {
//           //  We found another break in one day
//           return false;
//         }
//         foundOneBreakInOneDay = true;
//         continue;
//       } else {
//         continue;
//       }
//     } else {
//       foundOneBreakInOneDay = false; // We switched from one day to another so we need to restart the variable for checking one break a day
//       continue;
//     }
//   }
// };

//  checkForBreakBetweenClasses
// Returns 1 if theres a break
// returns -1 if there is no break
// return 0 if its different day

export const checkIfProfessorDayIsContinousOrWithOneBreak = (arr) => {
  let numOfBreaks = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    let hasBreak = checkForBreakBetweenClasses(arr[i + 1], arr[i]);
    if (hasBreak == -1) continue;
    if (hasBreak == 0) continue;
    numOfBreaks += hasBreak;
  }
  return numOfBreaks;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//  Function to check if some professor is in different classes at the same time
//  Solution is made of 'solutionCells', we have to check if some two cells have the
//  the same attributes professorIdx and timeIdx which would mean that the same professor
//  is asigned to different class at the same time
export const checkForSameProfessorDifferentClass = (solution) => {
  //  we will accumulate penalties in this variable
  let sum = 0;

  //    we will iterate through the solution(all cells) for all professors and check if the times collide
  for (let i = 0; i < professors.length; i++) {
    let timesForProfessor = new Array(time.length).fill(false);
    for (let j = 0; j < solution.length; j++) {
      // console.log("s", solution[j]);
      if (
        solution[j].professorIdx === i &&
        timesForProfessor[solution[j].timeIdx] === true
      ) {
        sum -= 10000; //    We found a cell in which is professor assigned to a time in which he is already assigned
      } else if (
        solution[j].professorIdx === i &&
        timesForProfessor[solution[j].timeIdx] === false
      ) {
        timesForProfessor[solution[j].timeIdx] = true;
      } else {
        continue;
      }
    }
    // console.log("times for proff", timesForProfessor);
  }
  return sum; //   We didnt find double times for the same professor
};

export const checkForSameClassDifferentSubject = (solution) => {
  //  we will accumulate penalties in this variable
  let sum = 0;

  //    we will iterate through the solution(all cells) for all classes and check if the times collide
  for (let i = 0; i < classes.length; i++) {
    let timesForClass = new Array(time.length).fill(false);
    for (let j = 0; j < solution.length; j++) {
      // console.log("s", solution[j]);
      if (
        solution[j].classIdx === i &&
        timesForClass[solution[j].timeIdx] === true
      ) {
        //console.log(solution[j].classIdx, solution[j].timeIdx, j);
        sum -= 10000; //    We found a cell in which is class assigned to a time in which they are already assigned
      } else if (
        solution[j].classIdx === i &&
        timesForClass[solution[j].timeIdx] === false
      ) {
        timesForClass[solution[j].timeIdx] = true;
      } else {
        continue;
      }
    }
    //console.log("times for class", timesForClass);
  }
  return sum; //   We didnt find double times for the same calss
};

//  Function checks if some class has all their subjects one after another,
//  without time gaps of 45mins or more and have between 4 and 7 classes a day
export const checkClassGapsAndNumOfLessons = (solution) => {
  //  we will accumulate penalties in this variable
  let sum = 0;

  //    we will iterate through the solution(all cells) for all classes and check if one class has continous lessons in a day
  for (let i = 0; i < classes.length; i++) {
    let classesPerDay = new Array(5).fill(0); //    Array of zeros for each day from monday to friday, when we find a solution cell for we increment that index in an array
    let allClassTimesFound = new Array(); // We will fill this array with all times found for current class in current solution, then sort it and check if the times for each day are continous
    //  Could optimize this to make it instead of going through the solution for each class, check for all classes in one going by putting
    //  variables 'classesPerDay and allClassTimesFound in an array, where array is slot for each class to check
    for (let j = 0; j < solution.length; j++) {
      if (solution[j].classIdx === i) {
        if (time[solution[j].timeIdx][0] == "M") {
          classesPerDay[0]++;
          allClassTimesFound.push(time[solution[j].timeIdx]);
        } else if (time[solution[j].timeIdx][0] == "T") {
          if (time[solution[j].timeIdx][1] != "H") {
            classesPerDay[1]++;
            allClassTimesFound.push(time[solution[j].timeIdx]);
          } else {
            classesPerDay[3]++;
            allClassTimesFound.push(time[solution[j].timeIdx]);
          }
        } else if (time[solution[j].timeIdx][0] == "W") {
          classesPerDay[2]++;
          allClassTimesFound.push(time[solution[j].timeIdx]);
        } else if (time[solution[j].timeIdx][0] == "F") {
          classesPerDay[4]++;
          allClassTimesFound.push(time[solution[j].timeIdx]);
        }
      } else {
        continue;
      }
    }
    for (let j = 0; j < 5; j++) {
      if (classesPerDay[j] < 4 || classesPerDay[j] > 7) {
        sum -= 5000;
        break;
      }
    }
    allClassTimesFound.sort();
    // console.log("all class times found", allClassTimesFound);
    if (checkIfClassDayIsContinous(allClassTimesFound) == false) {
      sum -= 10000;
    }
  }
  return sum; //   We didnt find double times for the same professor
};

//  Functions that checks if professor has at most one break of 45 mins,
//  a 'one lesson' gap and between 2 and 7 classes a day
export const checkProfessorBreakAndNumOfLessons = (solution) => {
  //    we will iterate through the solution(all cells) for all professors and check if one professor has at most
  //    1 break of 45 mins between classes in a day and has between 2 and 7 lessons a day

  let sum = 0; // Accumulate the penalties in this variable;
  for (let i = 0; i < professors.length; i++) {
    let classesPerDay = new Array(5).fill(0); //    Array of zeros for each day from monday to friday, when we find a solution cell for we increment that index in an array
    let allClassTimesFound = new Array(); // We will fill this array with all times found for current professor in current solution, then sort it and check if the times for each day are continous
    //  or with one break at most
    //  Could optimize this to make it instead of going through the solution for each professor, check for all professor in one going by putting
    //  variables 'classesPerDay and allClassTimesFound in an array, where array is slot for each class to check
    for (let j = 0; j < solution.length; j++) {
      if (solution[j].professorIdx === i) {
        if (time[solution[j].timeIdx][0] == "M") {
          classesPerDay[0]++;
          allClassTimesFound.push(time[solution[j].timeIdx]);
        } else if (time[solution[j].timeIdx][0] == "T") {
          if (time[solution[j].timeIdx][1] != "H") {
            classesPerDay[1]++;
            allClassTimesFound.push(time[solution[j].timeIdx]);
          } else {
            classesPerDay[3]++;
            allClassTimesFound.push(time[solution[j].timeIdx]);
          }
        } else if (time[solution[j].timeIdx][0] == "W") {
          classesPerDay[2]++;
          allClassTimesFound.push(time[solution[j].timeIdx]);
        } else if (time[solution[j].timeIdx][0] == "F") {
          classesPerDay[4]++;
          allClassTimesFound.push(time[solution[j].timeIdx]);
        }
      } else {
        continue;
      }
    }
    // console.log(classesPerDay, "cpd");
    for (let j = 0; j < 5; j++) {
      if (classesPerDay[j] == 0) continue;
      if (classesPerDay[j] < 2 || classesPerDay[j] > 7) {
        sum -= 5000;
        console.log(i);
        break;
      }
    }
    allClassTimesFound.sort();
    // console.log("all class time founds", allClassTimesFound);
    let numOfBreaks =
      checkIfProfessorDayIsContinousOrWithOneBreak(allClassTimesFound);
    if (numOfBreaks > 1) {
      sum -= 50 * (numOfBreaks - 1);
    }
  }
  return sum; //   We didnt find double times for the same professor
};

export function getRdn(min, max) {
  return Math.random() * (max - min) + min;
}

export function checkBound(val, lower, upper) {
  if (val < lower) return lower;
  if (val > upper) return upper;
  return val;
}

export function average(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum / array.length;
}

// Function to compare class times and check for breaks within the same day
// Returns 1 if theres a break
// returns -1 if there is no break
// return 0 if its different day
function checkForBreakBetweenClasses(time1, time2) {
  const daysOfWeek = ["M", "TU", "W", "TH", "F"];

  const getDayIndex = (time) => {
    const day = time.substring(0, time.length == 2 ? 1 : 2); // Consider both one and two-letter days
    return daysOfWeek.indexOf(day);
  };

  const getTimeIndex = (time) => {
    let substringIdx = time.length == 2 ? 1 : 2;
    return parseInt(time.substring(substringIdx));
  };

  const dayIndex1 = getDayIndex(time1);
  const dayIndex2 = getDayIndex(time2);

  // If times are on different days
  if (dayIndex1 !== dayIndex2) {
    return 0;
  }

  const timeIndex1 = getTimeIndex(time1);
  const timeIndex2 = getTimeIndex(time2);

  // Check if there's a break between classes on the same day

  if (Math.abs(timeIndex2 - timeIndex1) >= 2) {
    return Math.abs(timeIndex2 - timeIndex1) - 1;
  }

  return -1; // No break between classes
}
