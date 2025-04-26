"use client"

import { useState } from "react"
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import styles from "./MailEditor.module.css"

//Structure of RawDraftContentState.
const rawContentState = {
  entityMap: {},
  blocks: [
    {
      key: "637gr",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
}

export default function MailEditor(props) {
  const [contentState, setContentState] = useState(rawContentState)

  function handleContentStateChange(content) {
    setContentState({ content })
    // Call onDoneEditing whenever content changes
    props.onDoneEditing({ content })
  }

  // Remove this line as it's causing the issue - it's calling onDoneEditing before content is ready
  // props.onDoneEditing(contentState)

  return (
    <Editor
      toolbarClassName={styles.toolbar}
      editorClassName={styles.editor}
      initialContentState={contentState}
      onContentStateChange={handleContentStateChange}
      placeholder="Start writing from here..."
    />
  )
}





// import React, { useState } from 'react';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import styles from './MailEditor.module.css';

// //Structure of RawDraftContentState.
// const rawContentState = {
//   entityMap: {},
//   blocks: [
//     {
//       key: '637gr',
//       text: '',
//       type: 'unstyled',
//       depth: 0,
//       inlineStyleRanges: [],
//       entityRanges: [],
//       data: {},
//     },
//   ],
// };

// export default function MailEditor(props) {
//   const [contentState, setContentState] = useState(rawContentState);

//   function handleContentStateChange(content) {
//     setContentState({ content });
//   }

//   props.onDoneEditing(contentState);

//   return (
//     <Editor
//       toolbarClassName={styles.toolbar}
//       editorClassName={styles.editor}
//       initialContentState={contentState}
//       onContentStateChange={handleContentStateChange}
//       placeholder="Start writing from here..."
//     />
//   );
// }
