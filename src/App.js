import React from "react";

function HexDecoder() {
  return <div></div>;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.fileReader = null;
    this.state = { filecontent: [] };
  }

  handleFileRead = () => {
    const typedArray = new Uint8Array(this.fileReader.result);
    const untypedArrray = [];
    const iii = typedArray.values();

    while (true) {
      const { value, done } = iii.next();

      if (done) {
        break;
      }

      const hexValue = value.toString(16);

      untypedArrray.push(hexValue.length === 1 ? `0${hexValue}` : hexValue);
    }

    this.setState({
      filecontent: untypedArrray
    });
  };

  handleFileChosen = file => {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsArrayBuffer(file);
  };

  render() {
    console.log(this.state.filecontent.map(each => each.toString()));
    return (
      <div>
        <input
          type={"file"}
          id={"file"}
          accept={".bin"}
          onChange={e => this.handleFileChosen(e.target.files[0])}
        />
        <br />

        {this.state.filecontent.length > 0 && (
          <div>No Bytes present {this.state.filecontent.length}</div>
        )}

        {this.state.filecontent.map(each => `${each} `)}

        {this.state.filecontent.length > 0 && (
          <button>Add Decoding Section</button>
        )}
      </div>
    );
  }
}

export default App;
