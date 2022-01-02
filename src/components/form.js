import * as React from 'react';
import TextField from '@mui/material/TextField';
import './form.css';
import UnstyledButtonCustom from './submitButton';
import LinearIndeterminate from './loader';
import Animations from './skeleton';
import Snackbars from './snackbar';
import { useState } from 'react';
import base64 from 'react-native-base64';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { grey } from '@mui/material/colors';


export default function FullWidthTextField() {

  const [values, setValues] = useState({
    impact: "",
    urgency: "",
    shortDesc: "",
    category: ""
  });
  const [responseData, setResponse] = useState({});
  const [animation, setAnimation] = useState(false);
  const [clearData, setClearFlag] = useState(false);
  const [showSnackbar, setSnackbar] = useState(false);


  const handleChange = (e) => {
    setValues({ ...values, category: e.target.value })
  };
  const handleChange2 = (e) => {
    setValues({ ...values, urgency: e.target.value })
  };
  const handleChange1 = (e) => {
    setValues({ ...values, impact: e.target.value })
  };
  let fields = [{ name: "number", label: "Number" }, { name: "short_description", label: "Short Description" }, { name: "category", label: "Category" }, { name: "priority", label: "Priority" }];


  // onsubmit function
  const createInc = (data) => {
    console.log('data - ' + JSON.stringify(data));
    for (let key in data) {
      if (!data[key]) {
        setSnackbar(false);
        setSnackbar(true);
        return;
      }
    }
    const { impact, urgency, category, shortDesc } = data;
    setAnimation(true);
    let req_Body = {
      impact,
      urgency,
      category,
      "short_description": shortDesc
    }
    let REQUEST_BODY = JSON.stringify(req_Body);
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("<USER_ID>:<PASSWORD>"));
    headers.set('Content-type', "application/json; charset=UTF-8");
    fetch("https://<INSTANCE>.service-now.com/api/now/table/incident", {
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
        setAnimation(false);
        setResponse(json.result);
      })
      .catch(err => {
        throw new Error(err)
      });
  }

  if (animation) {
    return <div id="wrapper">
      <div className="outerdiv" body={{ backgroundColor: grey }}> {<Animations />} </div>
    </div>
  }
  if (responseData.number) {
    return <div id="wrapper">
      <div className="outerdiv">
        <h1>Your Incident has been created</h1>
        {responseData.number ? <span>{fields.map(field => <p key={field.name}>{field.label} - {responseData[field.name]}</p>)}</span> : null}
        <button onClick={x => alert('clear')}>Clear</button>
      </div>
    </div>
  }
  return <div id="wrapper">
    <div className="outerdiv">
      <div>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label-category"
            id="category"
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
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Impact</InputLabel>
          <Select
            labelId="demo-simple-select-label-impact"
            id="impact"
            value={values.impact}
            label="Impact"
            onChange={handleChange1}
            required
          >
            <MenuItem value={'1'}>High</MenuItem>
            <MenuItem value={'2'}>Medium</MenuItem>
            <MenuItem value={'3'}>Low</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Urgency</InputLabel>
          <Select
            labelId="demo-simple-select-label-urgency"
            id="urgency"
            value={values.urgency}
            label="Urgency"
            onChange={handleChange2}
          >
            <MenuItem value={'1'}>High</MenuItem>
            <MenuItem value={'2'}>Medium</MenuItem>
            <MenuItem value={'3'}>Low</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <TextField id="outlined-multiline-flexible"
          label="Short Description"
          multiline
          fullWidth
          maxRows={4} value={values.shortDesc} onInput={e => setValues({ ...values, shortDesc: e.target.value })} id="fullWidth" />
      </div>
      <div className="submitButton" onClick={e => createInc(values)}> <UnstyledButtonCustom /> </div>
    </div>
    {showSnackbar ? <Snackbars /> : null}
  </div>
  
}
