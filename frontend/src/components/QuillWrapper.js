import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';

const QuillWrapper = ({ value, onChange, modules, formats, ...props }) => {
  const quillRef = useRef(null);
  
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.getEditor().root.setAttribute('spellcheck', false);
    }
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      {...props}
    />
  );
};

export default QuillWrapper;