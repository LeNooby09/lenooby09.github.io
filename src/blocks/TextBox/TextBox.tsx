import React, { type ReactNode } from 'react';
import './TextBox.css';

interface TextBoxProps {
  title?: string;
  content?: string | ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export default function TextBox({
  title = 'HEADING',
  content = 'content goes here',
  className = '',
  style = {},
  children
}: TextBoxProps) {
  const contentToDisplay = children || content;

  return (
    <div className={`text-container ${className}`}>
      <div className="text-box" style={style}>
        <h1>{title}</h1>
        {typeof contentToDisplay === 'string' ? <p>{contentToDisplay}</p> : contentToDisplay}
      </div>
    </div>
  );
}
