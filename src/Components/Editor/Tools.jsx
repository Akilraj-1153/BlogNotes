import EditorJS from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Image from "@editorjs/image";
import Quote from "@editorjs/quote";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import LinkTool from "@editorjs/link"; // Standalone link tool
import LinkAutocomplete from "@editorjs/link-autocomplete"; // Autocomplete link tool
import Paragraph from "@editorjs/paragraph";
import Underline from "@editorjs/underline";

// Function to handle image upload by URL
const uploadImageByUrl = async (url) => {
  console.log("Uploading image by URL:", url);
  return {
    success: 1,
    file: {
      url: url, // Return the provided URL as the image source
    },
  };
};

// Function to handle image upload by file
const uploadImageByFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        success: 1,
        file: {
          url: reader.result, // Return the data URL of the uploaded image
        },
      });
    };
    reader.onerror = (error) => {
      reject({
        success: 0,
        message: error.message, // Provide an error message in case of failure
      });
    };
    reader.readAsDataURL(file);
  });
};

// Tools configuration for Editor.js
export const tools = {
  header: {
    class: Header,
    inlineToolbar: true, // Enable inline toolbar for the header tool
    config: {
      placeholder: "Enter a header", // Placeholder text for headers
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true, // Enable inline toolbar for paragraphs
    config: {
      placeholder: "Enter a paragraph", // Placeholder text for paragraphs
    },
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M", // Shortcut for quick marker usage
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+C", // Shortcut for quick inline code usage
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: uploadImageByFile, // Function to handle image file uploads
        uploadByUrl: uploadImageByUrl, // Function to handle image URL uploads
      },
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true, // Enable inline toolbar for quotes
    config: {
      quotePlaceholder: "Enter a quote", // Placeholder text for quotes
      captionPlaceholder: "Quote's author", // Placeholder text for the quote's author
    },
  },
  list: {
    class: List,
    inlineToolbar: true, // Enable inline toolbar for lists
  },
  embed: {
    class: Embed,
    inlineToolbar: true, // Enable inline toolbar for embeds
    config: {
      services: {
        youtube: true, // Enable embedding YouTube videos
        coub: true, // Enable embedding Coub videos
      },
    },
  },
  code: {
    class: CodeTool, // Code block tool
  },
  link: {
    class: LinkTool, // Standalone link tool
    config: {
      endpoint: "http://localhost:3000/", // Endpoint for link autocompletion
      queryParam: "search", // Query parameter for the endpoint
    },
  },
  linkAutocomplete: {
    class: LinkAutocomplete, // Autocomplete link tool
    config: {
      queryParam: "search", // Query parameter for the endpoint
    },
  },
  underline: {
    class: Underline, // Underline tool
    shortcut: "CMD+U", // Optional: Shortcut for underline
  },
};
