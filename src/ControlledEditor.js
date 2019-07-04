import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import ReactDOMServer from "react-dom/server";
import { CustomList } from "./List";
import { CustomListItem } from "./ListItem";

export class ControlledEditor extends React.Component {
  state = {
    text: ""
  };

  handleEditorChange = (content, e) => {
    this.setState({ text: content });
  };

  handleAddCustomListCommand = ed => {
    this.setState(prevState => {
      //Determining if the list item will be added to an existing list or a new list
      const isInList =
        prevState.text.substr(prevState.text.lastIndexOf("</") + 2, 2) ==
        CustomList.HTML_TAG;

      const selectedText = ed.selection.getNode().innerText;
      //Parsing our custom React element to stringified HTML
      const elementToAdd = ReactDOMServer.renderToStaticMarkup(
        isInList ? (
          <CustomListItem>{selectedText}</CustomListItem>
        ) : (
          <CustomList>
            <CustomListItem>{selectedText}</CustomListItem>
          </CustomList>
        )
      );

      /*Either injecting the element html inside list tags if it's being added to a list
      or concating it to the end of the string if it's a new list */
      return {
        text: isInList
          ? injectElement(
              prevState.text,
              prevState.text.lastIndexOf(CustomList.HTML_TAG),
              elementToAdd
            )
          : prevState.text.concat(elementToAdd)
      };
    });
  };

  render() {
    console.log(this.state.text);
    return (
      <Editor
        apiKey={process.env.REACT_APP_API_KEY}
        init={{
          setup: ed => {
            //Adding shortcut to custom command
            ed.addShortcut(
              "ctrl+alt+o",
              "Adds a custom list item",
              "addCustomListItem"
            );
            //Registering custom command
            ed.addCommand(
              "addCustomListItem",
              this.handleAddCustomListCommand.bind(this, ed)
            );
          }
        }}
        value={this.state.text}
        onEditorChange={this.handleEditorChange}
      />
    );
  }
}

function injectElement(contentString, index, element) {
  return [
    contentString.slice(0, index - 2),
    element,
    contentString.slice(index - 2)
  ].join("");
}
