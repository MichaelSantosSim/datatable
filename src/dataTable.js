import React from "react";
import _ from "lodash";
import {
  Table,
  Dimmer,
  Loader,
  Popup,
  Label,
  Button,
  Menu,
  Icon
} from "semantic-ui-react";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    let aux = this.props.children;
    let children = aux ? (aux instanceof Array ? aux : [aux]) : [];
    this.state = {
      children: children,
      value: this.props.value,
      column: null,
      direction: null
    };
  }
  componentDidMount() {}

  getHeaderCells() {
    let headerCells = [];
    let propHeaders = this.state.children;
    for (let i = 0; i < propHeaders.length; i++) {
      let headChild = propHeaders[i];
      let columnName = headChild.props.headerName;
      let varName = null;
      if (headChild.props.value) {
        let varName = headChild.props.value.split(".");
        varName = varName[varName.length];
      }

      headerCells.push(
        <Table.HeaderCell
          sorted={this.state.column === varName ? this.state.direction : null}
          onClick={this.handleSort()}
        >
          {" "}
          {columnName || `Column ${i}`}{" "}
        </Table.HeaderCell>
      );
    }
    return headerCells;
  }

  handleSort = clickedColumn => () => {
    const { column, value, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        value: _.sortBy(value, [clickedColumn]),
        direction: "ascending"
      });

      return;
    }

    this.setState({
      value: this.state.value.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };

  getFooter = () => {
    let buttons = [];

    let pgs = this.props.pages || 1;
    let onPageChange = this.props.onPageChange || (() => {});

    for (let i = 1; i < pgs + 1; i++) {
      buttons.push(
        <Menu.Item
          as="a"
          onClick={() => {
            onPageChange(i);
          }}
        >
          {i}
        </Menu.Item>
      );
    }
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={this.state.children.length || 0}>
            <Menu floated="right" pagination>
              {buttons}
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  };

  getRows = () => {
    let values = this.state.value;
    if (values) {
      let columns = this.state.children;
      let variable = this.props.var;
      return values.map(function(val) {
        return (
          <Table.Row>
            {columns.map(function(child) {
              let cellValue = undefined;

              if (!child.props.value) {
                if (!child.props.children) return;

                let newChilds = child.props.children;
                newChilds =
                  newChilds instanceof Array ? newChilds : [newChilds];

                cellValue = newChilds.map(ch => {
                  return (
                    <Table.Cell>
                      {" "}
                      {React.createElement(
                        ch.type,
                        Object.assign({}, ch.props, {
                          onClick: () => ch.props.onClick(val)
                        })
                      )}
                    </Table.Cell>
                  );
                });
              } else {
                let path = child.props.value.split(".");
                cellValue = val;
                if (path[0] === variable) {
                  for (let i = 1; i < path.length; i++) {
                    cellValue = cellValue[path[i]];
                    if (!cellValue) {
                      // Your dataTableColumn value object does not have the attribute passed attribute
                      throw new EvalError(
                        `'${path[i]}' is not attribute of '${path[i - 1]}'`
                      );
                    }
                  }
                } else {
                  // your dataTableColumn value name differs from the dataTable var name
                  throw new EvalError(`'${child.props.value}' is not defined`);
                }
              }

              return <Table.Cell> {cellValue} </Table.Cell>;
            })}
          </Table.Row>
        );
      });
    } else {
      return (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      );
    }
  };

  render() {
    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>{this.getHeaderCells()}</Table.Row>
          </Table.Header>
          <Table.Body>{this.getRows()}</Table.Body>
          {this.getFooter()}
        </Table>
      </div>
    );
  }
}

export default DataTable;
