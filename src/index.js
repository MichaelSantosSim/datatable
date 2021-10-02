import React from "react";
import ReactDOM from "react-dom";
import DataTable from "./dataTable.js";

import "semantic-ui-css/semantic.min.css";

import { Container, Segment, Button, Icon, Label } from "semantic-ui-react";

var people = [
  { id: "1", name: "Michael", age: "26", gender: "Male" },
  { id: "2", name: "Maria", age: "32", gender: "Female" },
  { id: "3", name: "Jongku", age: "35", gender: "Male" },
  { id: "4", name: "William", age: "22", gender: "Male" },
  { id: "5", name: "Hugo", age: "35", gender: "Male" },
  { id: "6", name: "Emilia", age: "35", gender: "Female" }
];

function updateId(page) {
  for (let i = 0; i < people.length; i++) {
    people[i].id = page + i + 1;
  }
  console.log(people);
}

function App() {
  return (
    <Container text style={{ marginTop: "4em" }}>
      <Segment>
        <DataTable
          value={people}
          var="person"
          pages={5}
          onPageChange={updateId}
        >
          <dataTableColumn headerName="Id" value="person.id" />
          <dataTableColumn headerName="Name" value="person.name" />
          <dataTableColumn headerName="Age" value="person.age" />
          <dataTableColumn headerName="Gender" value="person.gender" />
          <dataTableColumn headerName="Action">
            <Button
              content="Edit"
              color="blue"
              onClick={person => alert("Editing " + person.name)}
            />
            <Button
              content="Delete"
              color="red"
              onClick={person => alert("Deleting " + person.name)}
            />
          </dataTableColumn>
        </DataTable>
      </Segment>
    </Container>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
