import React from "react";
import { Button, Input, Select } from "antd";
import worker from "./worker.js";
import WebWorker from "./workerSetup";
// import "antd/dist/antd.css";
import { littleEndianFunctionalMap } from "./helpers";

const { Option } = Select;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.fileReader = null;
    this.state = {
      filecontent: [],
      decodingSection: [
        { type: "BigUint64", startIndex: "0", endIndex: "0" },
        { type: "BigUint64", startIndex: "0", endIndex: "0" }
      ]
    };
  }

  addDecodingSection = () => {
    this.setState({
      decodingSection: [
        ...this.state.decodingSection,
        { type: "Uint8", startIndex: "0", endIndex: "0" }
      ]
    });
  };

  updateEditedField = i => key => e => {
    const currentState = this.state;
    currentState.decodingSection[i][key] = e.target.value;
    this.setState({ ...currentState });
  };
  updateSelectField = i => key => value => {
    const currentState = this.state;
    currentState.decodingSection[i][key] = value;
    this.setState({ ...currentState });
  };

  handleFileRead = () => {
    this.worker.postMessage(this.fileReader.result);

    this.worker.addEventListener("message", event => {
      this.setState({
        filecontentString: event.data.untypedArrray,
        processLevel: event.data.processLevel
      });
    });
  };

  handleFileChosen = file => {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsArrayBuffer(file);
  };

  componentDidMount() {
    this.worker = new WebWorker(worker);
  }

  render() {
    console.log("Re Render");
    return (
      <div>
        <input
          type={"file"}
          id={"file"}
          onChange={e => this.handleFileChosen(e.target.files[0])}
        />
        <br />
        {this.state.filecontent.length > 0 && (
          <div>No Bytes present {this.state.filecontent.length}</div>
        )}
        {this.state.filecontent.length > 0 && (
          <div>
            <br />
            <Button
              type="primary"
              icon="poweroff"
              // loading={this.state.iconLoading}
              onClick={this.addDecodingSection}
            >
              Click me!
            </Button>
          </div>
        )}
        Process Level <br />
        {this.state.processLevel}
        <br />
        Content
        <br />
        {this.state.filecontentString}
        <br />
        <b>Decoding Section</b>
        {this.state.decodingSection.length > 0 && (
          <div>
            {this.state.decodingSection.map((eachSection, index) => {
              const { type, startIndex, endIndex } = eachSection;

              return (
                <div key={index}>
                  <select
                    value={type}
                    onChange={this.updateSelectField(index)("type")}
                  >
                    {Object.keys(littleEndianFunctionalMap).map(
                      eachFunction => (
                        <option value={`${eachFunction}`}>
                          {eachFunction}
                        </option>
                      )
                    )}
                  </select>
                  <Input
                    placeholder="Start Index"
                    size="large"
                    value={startIndex || ""}
                    onChange={this.updateEditedField(index)("startIndex")}
                  />
                  <Input
                    placeholder="End Index"
                    size="large"
                    value={endIndex || ""}
                    onChange={this.updateEditedField(index)("endIndex")}
                  />
                  {this.state.filecontent
                    .slice(parseInt(startIndex, 10), parseInt(endIndex, 10))
                    .map(each => `${each} `)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default App;
