import React from "react";
import { Button, Input, Select } from "antd";
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
