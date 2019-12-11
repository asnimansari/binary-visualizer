import React from 'react';

import './App.css';

function Appp() {

  let fileReader;

  const handleFileRead = e => {
    console.log(fileReader.result)
  }


  const handleFileChosen = file=>{
    fileReader = new FileReader()
    fileReader.onloadend = handleFileRead;
    fileReader.readAsArrayBuffer(file);
  }

  return <div>
    <input type={"file"} id={"file"}  accept={".bin"} onChange={e=>handleFileChosen(e.target.files[0])}/>
  </div>
}

// class Appp extends React.Component{
//
//   constructor(){
//     super();
//     this.state = {color:"red"}
//
//   }
//   handleFileRead  = e => {
//     co
//   }
//
//
//   handleChosenfile = (file)=> {
//   const  fileReader = new FileReader();
//   fileReader.onloadend = handel
//
//
//   }
//
//
//
//   render() {
//     return (
//         <div>
//           <input type={"file"} id={"files"} name={"files[]" } multiple onChange={this.handleFileSelect} />
//         </div>
//     );
//   }
// }
//


export default Appp;
