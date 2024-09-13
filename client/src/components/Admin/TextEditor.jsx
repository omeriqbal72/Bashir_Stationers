import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../../css/texteditor.css';

const TextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);

    return (
        <div className="editor-container">
            <Editor
                apiKey='ue9mue22ckrx5knp9e1q7d3ygmwao1o3ctwa3y4utmy2810p'
                onInit={(evt, editor) => editorRef.current = editor}
                value={value} // Controlled value
                onEditorChange={(content) => {
                    // Ensure the value is only updated when there is a change
                    if (editorRef.current && content !== value) {
                        onChange(content); // Notify the parent component of changes
                    }
                }}
                init={{
                    plugins: [
                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'mentions', 'autocorrect'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | checklist numlist bullist | emoticons charmap | removeformat',
                    menubar: false,
                    statusbar: false,
                    placeholder: placeholder || 'Start typing...', // Placeholder for empty content
                }}
            />
        </div>
    );
};

export default TextEditor;
