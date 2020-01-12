import React from "react";
import { Button, Col, Input, Row, Select } from "antd";
import worker from "./worker.js";
import WebWorker from "./workerSetup";
import "antd/dist/antd.css";
import { dataTypes, processDataAsPerType } from "./helpers";

const { Option } = Select;

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.fileReader = null;
    this.state = {
      hexStringArray: [],
      completeHexString: "",
      typedArray: new Uint8Array(0),
      decodingSection: [
        { type: "Choose Type", startIndex: "0", endIndex: "0" },
        { type: "Choose Type", startIndex: "0", endIndex: "0" }
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

    console.log(e);
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
  };

  handleFileChosen = file => {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsArrayBuffer(file);
  };

  componentDidMount() {
    this.worker = new WebWorker(worker);
    this.worker.addEventListener("message", event => {
      this.setState({
        ...this.state,
        ...event.data
      });
    });
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
        {this.state.hexStringArray.length > 0 && (
          <div>Byte Length {this.state.hexStringArray.length}</div>
        )}

        {this.state.completeHexString.length > 0 && (
          <Row>
            <Row>Content</Row>

            <Row>{this.state.completeHexString}</Row>
          </Row>
        )}
        <br />
        <b>Decoding Section</b>
        {this.state.decodingSection.length > 0 && (
          <div>
            {this.state.decodingSection.map((eachSection, index) => {
              const { type, startIndex, endIndex } = eachSection;

              return (
                <Row key={index}>
                  <Col className="gutter-row" span={2}>
                    <Select
                      value={type}
                      onChange={this.updateSelectField(index)("type")}
                    >
                      {dataTypes.map(eachFunction => (
                        <Option value={`${eachFunction}`}>
                          {eachFunction}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col className="gutter-row" span={2}>
                    <Input
                      placeholder="Start Index"
                      size="large"
                      value={startIndex || ""}
                      onChange={this.updateEditedField(index)("startIndex")}
                    />
                  </Col>
                  <Col className="gutter-row" span={2}>
                    <Input
                      placeholder="End Index"
                      size="large"
                      value={endIndex || ""}
                      onChange={this.updateEditedField(index)("endIndex")}
                    />
                  </Col>
                  <Col className="gutter-row" span={6}>
                    {this.state.hexStringArray
                      .slice(parseInt(startIndex, 10), parseInt(endIndex, 10))
                      .map(each => `${each} `)}
                  </Col>
                  <Col className="gutter-row" span={6}>
                    {processDataAsPerType(
                      this.state.typedArray.slice(
                        parseInt(startIndex, 10),
                        parseInt(endIndex, 10)
                      ).buffer,
                      type
                    )}
                  </Col>
                </Row>
              );
            })}
            <Row>
              <div>
                <Button
                  type="primary"
                  icon="plus"
                  // loading={this.state.iconLoading}
                  onClick={this.addDecodingSection}
                >
                  Add More Sections
                </Button>
              </div>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

export default Root;
