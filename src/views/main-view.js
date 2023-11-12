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
  for (const professor of professors) {
    const professorIndex = professors.indexOf(professor);
    const timesForProfessor = new Array(time.length).fill(false);
    
    for (const s of solution) {
      if (s.professorIdx === professorIndex) {
        if (timesForProfessor[s.timeIdx]) {
          // Found a time conflict for the professor
          return false;
        }
        timesForProfessor[s.timeIdx] = true;
      }
    }
  }
  // No time conflicts found for any professor
  return true;
};


const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto', 
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  },

});

export default function MainView() {
  const renderCell = (timeslotIndex, row) => {
    const cellStyles = {
      bgcolor: timeslotIndex === row.timeIdx ? 'secondary.main' : 'background.paper',
      color: timeslotIndex === row.timeIdx ? 'common.white' : 'text.primary',
      textAlign: 'center',
      borderRight: timeslotIndex < time.length - 1 ? '1px solid rgba(224, 224, 224, 1)' : '',
    };

    return (
      <TableCell key={`cell-${timeslotIndex}`} sx={cellStyles}>
        {timeslotIndex === row.timeIdx && (
          <>
            {classes[row.classIdx]}
            <br />
            {classrooms[row.classroomIdx]}
            <br />
            {subjects[row.subjectIdx]}
          </>
        )}
      </TableCell>
    );
  };

  const tableCellStyle = {
    fontWeight: 'bold',
    bgcolor: 'primary.dark',
    color: 'common.white',
    textAlign: 'center',
  };

  const tableHeaderStyle = {
    bgcolor: 'primary.main',
    color: 'common.white',
    textAlign: 'center',
  };

        
  return (
    <ThemeProvider theme={theme}>
    <Container sx={{ mt: '70px', pl: 0, width: '100%' }}>
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
              {tempSolution.map((row, index) => (
                <TableRow key={`row-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={tableCellStyle}>
                    {professors[row.professorIdx]}
                  </TableCell>
                  {time.map((_, timeslotIndex) => renderCell(timeslotIndex, row))}
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