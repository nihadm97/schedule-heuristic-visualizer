"use client";
import React, { useState, useEffect } from 'react';
import FinalizeInputView from './finalizeInput-view';
import TextField from '@mui/material/TextField';

export default function InputView() {
  const [professors, setProfessors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [times, setTimes] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('main');

  const [input, setInput] = useState({
    professor: '',
    subject: '',
    class: '',
    classroom: '',
    time: ''
  });

  /*
  useEffect(() => {
    console.log('Updated professors:', professors);
  }, [professors]);

  
  useEffect(() => {
    console.log('Updated subjects:', subjects);
  }, [subjects]);

  
  useEffect(() => {
    console.log('Updated classes:', classes);
  }, [classes]);


  useEffect(() => {
    console.log('Updated classrooms:', classrooms);
  }, [classrooms]);


  useEffect(() => {
    console.log('Updated times:', times);
  }, [times]);
  */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (category, value) => {
    if (value.trim() !== '') {
      const addValue = (prev) => [...prev, value];
      switch (category) {
        case 'professor':
          setProfessors(addValue);
          break;
        case 'subject':
          setSubjects(addValue);
          break;
        case 'class':
          setClasses(addValue);
          break;
        case 'classroom':
          setClassrooms(addValue);
          break;
        case 'time':

          const list = [];
          for (let index = 1; index <= value; index++) {
            list.push(`M${index}`);
          }
          for (let index = 1; index <= value; index++) {
            list.push(`TU${index}`);
          }
          for (let index = 1; index <= value; index++) {
            list.push(`W${index}`); 
          }
          for (let index = 1; index <= value; index++) {
            list.push(`TH${index}`); 
          }
          for (let index = 1; index <= value; index++) {
            list.push(`F${index}`); 
          }
          
          setTimes(list);
          console.log(list);
          break;
        default:
          
      }
    }
    setInput({ ...input, [name]: '' });
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px',
    maxHeight: '500px',
  };

  const columnStyle = {
    width: '250px', 
    maxHeight: '400px', 
    overflowY: 'auto'
  }
  
  
  const generisiRaspored = () => {

    const propsToSend = {
      professors,
      subjects,
      classes,
      classrooms,
      times,
    }
    setCurrentScreen({ screen: 'finalizeInput', props: propsToSend });
  };

  return (
    <div style={{backgroundColor:'lightblue', height: '900px'}}>
        {currentScreen === 'main' ? (<div><div style={{
        display: 'flex',
        justifyContent: 'center'}}> 

        <button onClick={generisiRaspored} style={{ margin: '20px', padding: '10px 15px', fontSize: '16px', 
        cursor: 'pointer', background: 'red', color: 'white', border: 'none', borderRadius: '5px' ,}}>
            Enter class distribution  
            </button>
        </div>
        <div style={containerStyle}>
        <TextField 
                type="text"
                name={times}
                value={input[times]}
                onChange={handleInputChange}
                sx={{ width: '30%' }}
                placeholder={`Enter number of timeslots a day`}
                />
                <button style={{ margin: '10px', padding: '5px 10px', fontSize: '16px', 
        cursor: 'pointer', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }} onClick={() => handleSubmit('time', input[times])}>
                Add
                </button>
                <div>
                {/* Display values based on category */}
                <div>Number of timeslots a day: {times.length/5}</div>
            </div>
        </div>
        <div style={containerStyle}>
        {['professor', 'subject', 'class', 'classroom'].map((category) => (
            <div key={category} style={columnStyle}>
            <div>
                <TextField 
                type="text"
                name={category}
                value={input[category]}
                onChange={handleInputChange}
                placeholder={`Enter ${category}`}
                />
                <button style={{ margin: '10px', padding: '5px 10px', fontSize: '16px', 
        cursor: 'pointer', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }} onClick={() => handleSubmit(category, input[category])}>
                Add
                </button>
            </div>
            <div>
                {/* Display values based on category */}
                {category === 'professor' && professors.map((item, index) => <div key={index}>{item}</div>)}
                {category === 'subject' && subjects.map((item, index) => <div key={index}>{item}</div>)}
                {category === 'class' && classes.map((item, index) => <div key={index}>{item}</div>)}
                {category === 'classroom' && classrooms.map((item, index) => <div key={index}>{item}</div>)}
                {category === 'time' && times.map((item, index) => <div key={index}>{item}</div>)}
            </div>
            </div>
        ))}
        </div></div>)  : (
                <FinalizeInputView {...currentScreen.props} />
            )}
    </div>
  );
}

