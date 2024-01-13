"use client";
import React, { useState, useEffect } from 'react';

export default function InputView() {
  const [professors, setProfessors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [times, setTimes] = useState([]);

  const [input, setInput] = useState({
    professor: '',
    subject: '',
    class: '',
    classroom: '',
    time: ''
  });

  // Log when professors change
  useEffect(() => {
    console.log('Updated professors:', professors);
  }, [professors]);

  // Log when subjects change
  useEffect(() => {
    console.log('Updated subjects:', subjects);
  }, [subjects]);

  // Log when classes change
  useEffect(() => {
    console.log('Updated classes:', classes);
  }, [classes]);

  // Log when classrooms change
  useEffect(() => {
    console.log('Updated classrooms:', classrooms);
  }, [classrooms]);

  // Log when times change
  useEffect(() => {
    console.log('Updated times:', times);
  }, [times]);

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
          setTimes(addValue);
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
    history.push('/finalizeInput',  { professors, subjects, classes, classrooms, times});
  };

  return (
    <div>
        <div style={{
        display: 'flex',
        justifyContent: 'center'}}> 

            <button onClick={generisiRaspored} style={{ margin: '20px', padding: '10px 15px', fontSize: '16px', 
        cursor: 'pointer', background: 'black', color: 'white', border: 'none', borderRadius: '5px' ,}}>
            Generate 
            </button>
        </div>
       
        <div style={containerStyle}>
        {['professor', 'subject', 'class', 'classroom', 'time'].map((category) => (
            <div key={category} style={columnStyle}>
            <div>
                <input
                type="text"
                name={category}
                value={input[category]}
                onChange={handleInputChange}
                placeholder={`Enter ${category}`}
                />
                <button onClick={() => handleSubmit(category, input[category])}>
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
        </div>
    </div>
  );
}

