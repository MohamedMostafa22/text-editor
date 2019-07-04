import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export class UncontrolledEditor extends React.Component {
  handleAddCustomListCommand = ed => {
    //Getting hold of the currnet node
    const elem = ed.selection.getNode();
    //Determining if the list item will be added to an existing list or a new list
    const listElementExists = ed.dom.select("ul#list").length > 0;

    if (listElementExists) {
      //Adding list item to existing list
      ed.dom.add(ed.dom.select("ul#list")[0], "li", {}, elem.innerText);
    } else {
      //Adding a new list
      ed.dom.add(ed.getBody(), "ul", {
        id: "list",
        class: "custom-list",
        style: {
          color: "blue"
        }
      });
      ed.dom.add(ed.dom.select("ul#list")[0], "li", {}, elem.innerText);
      //Removing written text after adding it as a list item
      elem.remove && elem.remove();
    }
  };

  render() {
    return (
      <Editor
        apiKey={process.env.REACT_APP_API_KEY}
        init={{
          selector: "textarea",
          plugin: "textpattern",
          setup: ed => {
            //Adding shortcut for the custom command
            ed.addShortcut(
              "ctrl+alt+o",
              "Adds a custom list item",
              "addCustomListItem"
            );
            //Registering the custom command
            ed.addCommand(
              "addCustomListItem",
              this.handleAddCustomListCommand.bind(null, ed)
            );
          }
        }}
      />
    );
  }
}
