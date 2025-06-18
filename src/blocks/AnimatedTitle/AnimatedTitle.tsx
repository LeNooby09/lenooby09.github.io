import React from 'react';
import DecryptedText from '../TextAnimations/DecryptedText/DecryptedText';

interface AnimatedTitleProps {
	text: string;
}

export default function AnimatedTitle({text}: AnimatedTitleProps) {
	return (
		<DecryptedText
			text={text}
			animateOn="view"
			speed={60}
			sequential={true}
		/>
	);
}
