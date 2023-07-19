import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function MyComponent() {
  const [value, setValue] = useState('');
  const quillRef = useRef(); // Create a ref for storing the Quill instance

  useEffect(() => {
    if (quillRef != null && quillRef.current != null) {
      let quill = quillRef.current.getEditor();
      let toolbar = quill.getModule('toolbar');
      
      toolbar.addHandler('image', () => {
        let url = prompt('Enter the image URL');
        let range = quill.getSelection();
        if (url) {
          quill.insertEmbed(range.index, 'image', url);
        }
      });
    }
  }, []);

  return (
    <ReactQuill 
      ref={quillRef} 
      theme="snow" 
      value={value} 
      onChange={setValue} 
      modules={modules} 
    />
  );
}

// Specify the toolbar options
const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

export default MyComponent;
