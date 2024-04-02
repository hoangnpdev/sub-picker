import { useState } from 'react'
import './App.css'
import srtParser2 from "srt-parser-2";

function App() {
  const [imSub, setImSub] = useState([])
  const [exSub, setExSub] = useState([])

  const load = (e) => {
    var parser = new srtParser2();
    var f = e.target.files[0]
    var reader = new FileReader();
    reader.onload = function (event) {
      // NOTE: event.target point to FileReader
      var contents = event.target.result;
      var subs = parser.fromSrt(contents);
      //////
      setImSub(subs)
    };

    reader.readAsText(f);
  }

  const save = () => {
    for (let i = 0; i < exSub.length; i++) {
      exSub[i].id = i + 1;
      exSub[i].text = exSub[i].text.replace(/\s/g, " ");
    }
    console.log("save work")
    var parser = new srtParser2();
    var content = parser.toSrt(exSub);
    var a = document.createElement("a");
    var file = new Blob([content], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = "export.srt";
    a.click();
  }
  const add = (sub0) => {
    // not yet checked duplicate
    let sub = structuredClone(sub0);
    console.log("work")
    let newSub = [];
    if (exSub.length == 0) {
      newSub.push(sub)
      setExSub(newSub);
      return;
    }
    let index = 0;
    for (let i = 0; i < exSub.length; i++) {
      newSub.push(exSub[i]);
      if (parseInt(sub.id, 10) > parseInt(exSub[i].id, 10) && index != -1) {
        index = i + 1
      }
      if (parseInt(sub.id, 10) == parseInt(exSub[i].id, 10)) {
        index = -1;
      }
    }
    if (index != -1) {
      newSub.splice(index, 0, sub);
    }
    setExSub(newSub);
  }
  const remove = (id) => {
    console.log("remove work")
    var newSub = exSub.filter(item => item.id !== id)
    console.log(newSub);
    setExSub(newSub);
  }

  const merge = (arrayIndex) => {
    let newSub = [];
    for (let i = 0; i < exSub.length; i++) {
      if (i == arrayIndex && i + 1 < exSub.length) {
        exSub[i].endTime = exSub[i + 1].endTime;
        exSub[i].text = exSub[i].text + " " + exSub[i + 1].text;
        newSub.push(exSub[i]);
        i++;
      } else {
        newSub.push(exSub[i]);
      }
    }
    setExSub(newSub);
  }

  return (
    <>
      <input type="file" id="myFile" name="filename" onChange={load} /> 
      <button onClick={save}>Save</button> 
      <div> {imSub.length} -- {exSub.length} </div>
      <div class="row">
        <div class="col overflow-auto" style={{ maxHeight: "80vh", overflow: scroll }}>
          {imSub.map((sub) =>
            <div class="row border" key={sub.id}>
              <div class="col">
                <div style={{ textAlign: 'left' }}>{sub.id}: {sub.startTime} -- {sub.endTime}</div>
                <div style={{ textAlign: 'left' }}>{sub.text}</div>
              </div>
              <div class="col">
                <div onClick={() => add(sub)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg></div>
              </div>
            </div>
          )}
        </div>
        <div class="col overflow-auto" style={{ maxHeight: "80vh", overflow: scroll }}>
          {exSub.map((sub, index) =>
            <div class="row border" key={sub.id}>
              <div class="col">
                <div style={{ textAlign: 'left' }}>{sub.id}: {sub.startTime} -- {sub.endTime}</div>
                <div style={{ textAlign: 'left' }}>{sub.text}</div>
              </div>
              <div class="col">
                <div onClick={() => remove(sub.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg></div>
                <div onClick={() => merge(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                </svg></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
