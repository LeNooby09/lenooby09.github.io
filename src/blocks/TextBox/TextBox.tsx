import React, {type ReactNode} from 'react';
import './TextBox.css';

interface TextBoxProps {
	title?: string | ReactNode;
	content?: string | ReactNode;
	className?: string;
	style?: React.CSSProperties;
	children?: ReactNode;
}

export default function TextBox({
																	title = 'HEADING',
																	content = 'CONTENT',
																	className = '',
																	style = {},
																	children
																}: TextBoxProps) {
	const contentToDisplay = children || content;

	return (
		<div className={`text-container ${className}`}>
			<div className="text-box" style={style}>
				<h1 className="text-box-title">
					{title}
				</h1>
				{typeof contentToDisplay === 'string' ? <p>{contentToDisplay}</p> : contentToDisplay}
			</div>
		</div>
	);
}
