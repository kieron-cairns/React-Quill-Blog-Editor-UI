import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import ReactDOMServer from 'react-dom/server';

import 'react-quill/dist/quill.snow.css';

function MyComponent() {

  const quillRef = useRef(); // Create a ref for storing the Quill instance

   // Define your initial blog posts data
   const [blogPosts, setBlogPosts] = useState([
    {
      link: "/blog/business-consulting",
      img: "./logo512.png",
      alt: "business consulting",
      title: "Business Consulting",
      desc: "Get expert advice to help your business grow and succeed.",
      date: "July 13, 2023",
      content: <div class="code-block"><pre><code class="language-javascript">{`public void HeyWorld() {
        Console.WriteLine("Hello World");
      }
      `}</code></pre></div>
    },
    // other posts...
  ]);

  const [value, setValue] = useState(''); // Initialize Quill's value to an empty string

// Function to handle selecting a blog post
const handleSelectPost = (index) => {
  let content = blogPosts[index].content;

  if (typeof content !== 'string') {
    content = ReactDOMServer.renderToStaticMarkup(content);
  }
  
  // Remove the special characters `{` and `}` around the backticks
  content = content.replace(/<code[^>]*>{`/g, '<code>');
  content = content.replace(/`}<\/code>/g, '</code>');

  setValue(content); // Load the HTML content of the selected post into Quill
};


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
    
    // Remove all instances of &nbsp;
    wrappedHtml = wrappedHtml.replace(/&nbsp;/g, ' ');
    
    // Count the number of pre tags
    let preTagCount = (wrappedHtml.match(/<pre>/g) || []).length;

    // Loop over each pre tag to insert a code tag with user-specified language
    for (let i = 0; i < preTagCount; i++) {
      let language = prompt('Enter a language for the code block'); // Prompt the user to enter a language
      wrappedHtml = wrappedHtml.replace('<pre>', `<pre><code class="language-${language}">{\``).replace('</pre>', `\`}</code></pre>`); // Insert the code tag with the specified language and special characters
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
            <button onClick={() => handleSelectPost(0)}>Load post</button> {/* Load the content of the first post into Quill */}

      <button onClick={handleExport}>Export as HTML</button> {/* Add export button */}

     

    </div>
  );
}

// Specify the toolbar options
const modules = {
  toolbar: [
    [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],               // custom button values
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

export default MyComponent;
