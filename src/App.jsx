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

 // Function to handle the export to HTML
 const handleExport = () => {
  if (quillRef != null && quillRef.current != null) {
    let quill = quillRef.current.getEditor();
    let delta = quill.getContents();
    let html = quill.root.innerHTML; // Get HTML
    
    // Process the HTML to wrap pre tags and add code tags
    let wrappedHtml = html.replace(/<pre class="ql-syntax"/g, '<div class="code-block"><pre').replace(/<\/pre>/g, '</pre></div>').replace(/spellcheck="false"/g, '').replace(/<pre >/g, '<pre>');
    
    // Count the number of pre tags
    let preTagCount = (wrappedHtml.match(/<pre>/g) || []).length;

    // Loop over each pre tag to insert a code tag with user-specified language
    for (let i = 0; i < preTagCount; i++) {
      let language = prompt('Enter a language for the code block'); // Prompt the user to enter a language
      wrappedHtml = wrappedHtml.replace('<pre>', `<pre><code class="language-${language}">`).replace('</pre>', '</code></pre>'); // Insert the code tag with the specified language
    }

    console.log(wrappedHtml); // Log the modified HTML
  }
};

  return (
    <div>
      <ReactQuill 
        ref={quillRef} 
        theme="snow" 
        value={value} 
        onChange={setValue} 
        modules={modules} 
      />
      <button onClick={handleExport}>Export as HTML</button> {/* Add export button */}

     

    </div>
  );
}

// Specify the toolbar options
const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

export default MyComponent;
