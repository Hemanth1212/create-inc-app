import * as React from 'react';
import TextField from '@mui/material/TextField';
import './form.css';
import UnstyledButtonCustom from './submitButton';
import LinearIndeterminate from './loader';
import { useState } from 'react';
import base64 from 'react-native-base64';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export default function FullWidthTextField() {

  const [values, setValues] = useState({
    priority: "",
    shortDesc: "",
    category: ""
  });
  const [responseData, setResponse] = useState({});
  const [isLoading, setIsLaoding] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, category: e.target.value })
  };
  let fields = [{ name: "number", label: "Number" }, { name: "short_description", label: "Short Description" }, { name: "category", label: "Category" }, { name: "priority", label: "Priority" }];

  const createInc = (data) => {
    const { priority, category, shortDesc } = data;
    setIsLaoding(true);
    let req_Body = {
      priority,
      category,
      "short_description": shortDesc
    }
    let REQUEST_BODY = JSON.stringify(req_Body);
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("admin:Admin@123"));
    headers.set('Content-type', "application/json; charset=UTF-8");
    fetch("https://ihubft.service-now.com/api/now/table/incident", {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      body: REQUEST_BODY,
      // Adding headers to the request
      headers: headers
    })
      // Converting to JSON
      .then(response => response.json())
      // Displaying results to console
      .then(json => {
        setIsLaoding(false);
        setResponse(json.result);
      })
      .catch(err => {
        throw new Error(err)
      });
  }


  if (responseData.number) {
    return <div className="outerdiv">{responseData.number ? <span>{fields.map(field => <p key={field.name}>{field.label} - {responseData[field.name]}</p>)}</span> : null} </div>
  }

  return (

    <div className="outerdiv">
      <div>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.category}
            label="Category"
            onChange={handleChange}
          >
            <MenuItem value={'inquiry'}>Inquiry</MenuItem>
            <MenuItem value={'software'}>Software</MenuItem>
            <MenuItem value={'hardware'}>Hardware</MenuItem>
            <MenuItem value={'database'}>Database</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <TextField fullWidth label="Priority" value={values.priority} onInput={e => setValues({ ...values, priority: e.target.value })} id="fullWidth" />
      </div>
      <div>
        <TextField fullWidth label="Short Description" value={values.shortDesc} onInput={e => setValues({ ...values, shortDesc: e.target.value })} id="fullWidth" />
      </div>
      <div className="submitButton" onClick={e => createInc(values)}> <UnstyledButtonCustom /> </div>
      <div>{isLoading ? <LinearIndeterminate /> : null}</div>
    </div>
  );
}