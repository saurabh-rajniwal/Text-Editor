import React from "react";
import ReactDOM from "react-dom";
import { Editor, EditorState, Modifier, getDefaultKeyBinding } from "draft-js";
import "draft-js/dist/Draft.css";

const styleMap = {
  HIGHLIGHT: {
    color: "red",
  },
  HEADING: {
    display: "block",
    fontSize: "2em",
    marginTop: "0.67em",
    marginBottom: "0.67em",
    marginLeft: 0,
    marginRight: 0,
    fontWeight: "bold",
  },
  BOLD: {
    fontWeight: "bold",
  },
};

function Editors() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const handleBeforeInput = (chars) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const currentBlock = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const blockText = currentBlock.getText();

    if (chars === " ") {
      if (blockText.trim().endsWith("***")) {
        const underlineContentState = Modifier.applyInlineStyle(
          contentState,
          selectionState.merge({
            anchorOffset: blockText.lastIndexOf("***"),
            focusOffset: selectionState.getEndOffset(),
          }),
          "UNDERLINE"
        );

        setEditorState(
          EditorState.push(
            editorState,
            underlineContentState,
            "change-inline-style"
          )
        );
        return "handled";
      }

      if (blockText.trim().endsWith("**")) {
        const highlightContentState = Modifier.applyInlineStyle(
          contentState,
          selectionState.merge({
            anchorOffset: blockText.lastIndexOf("**"),
            focusOffset: selectionState.getEndOffset(),
          }),
          "HIGHLIGHT"
        );

        setEditorState(
          EditorState.push(
            editorState,
            highlightContentState,
            "change-inline-style"
          )
        );
        return "handled";
      }
      if (blockText.trim().endsWith("*")) {
        const headerOneContentState = Modifier.applyInlineStyle(
          contentState,
          selectionState.merge({
            anchorOffset: blockText.lastIndexOf("*"),
            focusOffset: selectionState.getEndOffset(),
          }),
          "BOLD"
        );

        setEditorState(
          EditorState.push(
            editorState,
            headerOneContentState,
            "change-inline-style"
          )
        );
        return "handled";
      }
      if (blockText.trim().startsWith("#")) {
        const headerContentState = Modifier.applyInlineStyle(
          contentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: selectionState.getEndOffset(),
          }),
          "HEADING"
        );

        setEditorState(
          EditorState.push(
            editorState,
            headerContentState,
            "change-inline-style"
          )
        );
        return "handled";
      }
    }
    return "not-handled";
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", minHeight: "200px" }}
    >
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={styleMap}
      />
    </div>
  );
}

export default Editors;
