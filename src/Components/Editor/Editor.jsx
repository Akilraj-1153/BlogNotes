import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { useRecoilState } from "recoil";
import { texteditor, blogStructure, DarkTheme } from "../Configuration/Atoms";
import { tools } from "./Tools";
import { useParams } from "react-router-dom";

let editorInstance = null;

function Editor() {
  const [isEditorReady, setEditorReady] = useRecoilState(texteditor);
  const [isDarkTheme] = useRecoilState(DarkTheme);
  const [blog, setBlog] = useRecoilState(blogStructure);
  const editorRef = useRef(null);
  const { blog_id } = useParams();
  const [loading, setLoading] = useState(true);

  const editorConfig = (holderId) => ({
    holder: holderId,
    data: Array.isArray(blog.content) ? blog.content[0] : blog.content,
    tools: tools,
    onReady: () => {
      console.log("Editor.js is ready to work!");
    },
    onChange: (api, event) => {
      console.log("Now I know that Editor's content changed!", event);
    },
    autofocus: true,
    placeholder: "Let’s write an awesome story!",
  });

  useEffect(() => {
    const editor = new EditorJS(editorConfig(editorRef.current));

    editor.isReady
      .then(() => {
        setEditorReady(true);
        setLoading(false);
        editorInstance = editor;
      })
      .catch((error) => {
        console.error("ERROR editor initialization", error);
        setEditorReady(false);
        setLoading(false);
      });

    return () => {
      editor.isReady
        .then(() => {
          editor.destroy();
          setEditorReady(false);
        })
        .catch((e) => console.error("ERROR editor cleanup", e));
    };
  }, [setEditorReady]);

  useEffect(() => {
    if (blog_id === "create-new-blog" && isEditorReady) {
      if (editorInstance) {
        editorInstance.clear();
      } else {
        const editor = new EditorJS(editorConfig(editorRef.current));
        editorInstance = editor;
      }
    }
  }, [blog_id]);

  return (
    <div>
      {loading ? (
        <div>Loading editor...</div>
      ) : (
        <div
          id="editorjs"
          className={`ml-2 ${
            isDarkTheme
              ? "selection:bg-white selection:text-black"
              : "selection:text-white selection:bg-black"
          }`}
          ref={editorRef}
        ></div>
      )}
    </div>
  );
}

export default Editor;

export const handleEditorSave = async () => {
  if (editorInstance) {
    try {
      const savedData = await editorInstance.save();
      return savedData;
    } catch (error) {
      console.error("ERROR saving data", error);
      throw error;
    }
  }
};
