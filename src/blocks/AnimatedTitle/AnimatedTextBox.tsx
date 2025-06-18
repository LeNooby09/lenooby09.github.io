import React from 'react';
import TextBox from '../TextBox/TextBox';
import DecryptedText from '../TextAnimations/DecryptedText/DecryptedText';

interface AnimatedTextBoxProps {
	titleText: string;
	contentText: string;
	className?: string;
}

export default function AnimatedTextBox({
																					titleText,
																					contentText,
																					className = ''
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
		</TextBox>
	);
}
