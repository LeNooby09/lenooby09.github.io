import React, {useEffect, useRef, useState} from "react";
import {type HTMLMotionProps, motion} from "framer-motion";

interface DecryptedTextProps extends HTMLMotionProps<"span"> {
	text: string;
	speed?: number;
	maxIterations?: number;
	sequential?: boolean;
	revealDirection?: "start" | "end" | "center";
	useOriginalCharsOnly?: boolean;
	characters?: string;
	className?: string;
	encryptedClassName?: string;
	parentClassName?: string;
	animateOn?: "view" | "hover";
}

export default function DecryptedText({
																				text,
																				speed = 5,
																				maxIterations = 10,
																				sequential = true,
																				revealDirection = "start",
																				useOriginalCharsOnly = false,
																				characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+=",
																				className = "",
																				parentClassName = "",
																				encryptedClassName = "",
																				animateOn = "view",
																				...props
																			}: DecryptedTextProps) {
	const [displayText, setDisplayText] = useState<string>(text);
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const [isScrambling, setIsScrambling] = useState<boolean>(false);
	const [revealedIndices, setRevealedIndices] = useState<Set<number>>(
		new Set(),
	);
	const [hasAnimated, setHasAnimated] = useState<boolean>(false);
	const containerRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		let currentIteration = 0;

		const getNextIndex = (revealedSet: Set<number>): number => {
			const textLength = text.length;
			switch (revealDirection) {
				case "start":
					return revealedSet.size;
				case "end":
					return textLength - 1 - revealedSet.size;
				case "center": {
					const middle = Math.floor(textLength / 2);
					const offset = Math.floor(revealedSet.size / 2);
					const nextIndex =
						revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

					if (
						nextIndex >= 0 &&
						nextIndex < textLength &&
						!revealedSet.has(nextIndex)
					) {
						return nextIndex;
					}
					for (let i = 0; i < textLength; i++) {
						if (!revealedSet.has(i)) return i;
					}
					return 0;
				}
				default:
					return revealedSet.size;
			}
		};

		const availableChars = useOriginalCharsOnly
			? Array.from(new Set(text.split(""))).filter((char) => char !== " " && char !== "\n")
			: characters.split("");

		const shuffleText = (
			originalText: string,
			currentRevealed: Set<number>,
		): string => {
			if (useOriginalCharsOnly) {
				const positions = originalText.split("").map((char, i) => ({
					char,
					isSpace: char === " " || char === "\n",
					index: i,
					isRevealed: currentRevealed.has(i),
				}));

				const nonSpaceChars = positions
					.filter((p) => !p.isSpace && !p.isRevealed)
					.map((p) => p.char);

				for (let i = nonSpaceChars.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[nonSpaceChars[i], nonSpaceChars[j]] = [
						nonSpaceChars[j],
						nonSpaceChars[i],
					];
				}

				let charIndex = 0;
				return positions
					.map((p) => {
						if (p.isSpace) return p.char; // Keep spaces and newlines
						if (p.isRevealed) return originalText[p.index];
						return nonSpaceChars[charIndex++];
					})
					.join("");
			} else {
				return originalText
					.split("")
					.map((char, i) => {
						if (char === " " || char === "\n") return char; // Preserve newlines
						if (currentRevealed.has(i)) return originalText[i];
						return availableChars[
							Math.floor(Math.random() * availableChars.length)
							];
					})
					.join("");
			}
		};

		if (isHovering) {
			setIsScrambling(true);
			interval = setInterval(() => {
				setRevealedIndices((prevRevealed) => {
					if (sequential) {
						if (prevRevealed.size < text.length) {
							const nextIndex = getNextIndex(prevRevealed);
							const newRevealed = new Set(prevRevealed);
							newRevealed.add(nextIndex);
							setDisplayText(shuffleText(text, newRevealed));
							return newRevealed;
						} else {
							clearInterval(interval);
							setIsScrambling(false);
							return prevRevealed;
						}
					} else {
						setDisplayText(shuffleText(text, prevRevealed));
						currentIteration++;
						if (currentIteration >= maxIterations) {
							clearInterval(interval);
							setIsScrambling(false);
							setDisplayText(text);
						}
						return prevRevealed;
					}
				});
			}, speed);
		} else {
			setDisplayText(text);
			setRevealedIndices(new Set());
			setIsScrambling(false);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [
		isHovering,
		text,
		speed,
		maxIterations,
		sequential,
		revealDirection,
		characters,
		useOriginalCharsOnly,
	]);

	useEffect(() => {
		if (animateOn !== "view") return;

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !hasAnimated) {
					setIsHovering(true);
					setHasAnimated(true);
				}
			});
		};

		const observerOptions = {
			root: null,
			rootMargin: "0px",
			threshold: 0.1,
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions,
		);
		const currentRef = containerRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) observer.unobserve(currentRef);
		};
	}, [animateOn, hasAnimated]);

	const hoverProps =
		animateOn === "hover"
			? {
				onMouseEnter: () => setIsHovering(true),
				onMouseLeave: () => setIsHovering(false),
			}
			: {};

	// Render text with proper line breaks during animation
	const renderFormattedText = () => {
		if (!isScrambling || !isHovering) {
			// Split text by newlines and render each line
			return displayText.split('\n').map((line, lineIndex) => (
				<React.Fragment key={lineIndex}>
					{line}
					{lineIndex < displayText.split('\n').length - 1 && <br/>}
				</React.Fragment>
			));
		}

		// During animation, maintain line breaks while scrambling
		return displayText.split('\n').map((line, lineIndex) => (
			<React.Fragment key={lineIndex}>
				{line.split('').map((char, charIndex) => {
					const globalIndex = displayText
						.split('\n')
						.slice(0, lineIndex)
						.reduce((sum, l) => sum + l.length + 1, 0) + charIndex;

					const isRevealed = revealedIndices.has(globalIndex);

					return (
						<span
							key={charIndex}
							className={isRevealed ? className : encryptedClassName}
							style={{
								display: 'inline-block',
								width: '0.6em',
								textAlign: 'center'
							}}
						>
																				       {char}
																				      </span>
					);
				})}
				{lineIndex < displayText.split('\n').length - 1 && <br/>}
			</React.Fragment>
		));
	};

	return (
		<motion.span
			ref={containerRef}
			className={`inline-block ${parentClassName}`}
			{...hoverProps}
			{...props}
			style={{
				fontFamily: 'monospace',
				display: 'inline-block',
				width: '100%',
				whiteSpace: 'pre-wrap', // Important for preserving line breaks
				...props.style
			}}
		>
			{/* Screen reader only text */}
			<span className="sr-only" style={{
				position: 'absolute',
				width: '1px',
				height: '1px',
				padding: '0',
				margin: '-1px',
				overflow: 'hidden',
				clip: 'rect(0, 0, 0, 0)',
				whiteSpace: 'nowrap',
				borderWidth: '0'
			}}>{text}</span>

			{/* Visual display with animation */}
			<span
				aria-hidden="true"
				style={{
					display: 'inline-block',
					width: '100%',
					minWidth: '100%',
					whiteSpace: 'pre-wrap' // Ensure line breaks are preserved
				}}
			>
																				    {renderFormattedText()}
																				   </span>
		</motion.span>
	);
}
