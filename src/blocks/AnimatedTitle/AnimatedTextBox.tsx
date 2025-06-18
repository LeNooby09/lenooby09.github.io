import React from 'react';
import TextBox from '../TextBox/TextBox';
import DecryptedText from '../TextAnimations/DecryptedText/DecryptedText';

interface AnimatedTextBoxProps {
	titleText: string;
	contentText: string;
	className?: string;
	formattedContent?: string;
}

export default function AnimatedTextBox({
																					titleText,
																					contentText,
																					className = '',
																					formattedContent = ''
																				}: AnimatedTextBoxProps) {
	return (
		<TextBox
			title={
				<DecryptedText
					text={titleText}
					speed={100}
				/>
			}
			className={className}
		>
			<DecryptedText
				text={contentText}
			/>
			{formattedContent && (
				<div dangerouslySetInnerHTML={{__html: formattedContent}}/>
			)}
		</TextBox>
	);
}
