import React from 'react';
import './TextBox.css';

interface TextBoxProps {
  title?: string;
  content?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function TextBox({
  title = 'HEADING',
  content = 'content goes here',
  className = '',
  style = {}
}: TextBoxProps) {
  return (
    <div className={`text-container ${className}`}>
      <div className="text-box" style={style}>
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
    </div>
  );
}
