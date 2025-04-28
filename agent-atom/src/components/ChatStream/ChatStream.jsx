import React, { useState } from "react";
import "./ChatStream.css";
import { HfInference } from "@huggingface/inference";
import VoiceStream from "../VoiceStream/VoiceStream"

const client = new HfInference(process.env.REACT_APP_HF_TOKEN);
export default function ChatStream() {
	const [userInput, setUserInput] = useState("");
	const [agentResponse, setAgentResponse] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleCallAgent = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const stream = client.chatCompletionStream({
				model: "mistralai/Mistral-Nemo-Instruct-2407",
				provider: "hf-inference",
				messages: [{ role: "user", content: userInput }],
				temperature: 0.5,
				max_tokens: 2048,
				top_p: 0.7,
			});

			for await (const chunk of stream) {
				const message = chunk.choices[0].delta.content;
				setAgentResponse((prevResponse) => prevResponse + message);
			}
			setIsLoading(false);
		} catch (error) {
			console.error("Error handling agent call:", error);
		}
	};
	return (
		<div className="container">
			<img src="/assets/A_Logo.png" alt="Agent Atom Logo" className="logo" />
			<div className="responseBox">
				{agentResponse || (isLoading && <TypingDots />)}
				<VoiceStream text={agentResponse} />
			</div>
			<form onSubmit={handleCallAgent} className="form">
				<div className="search-container">
					<input
						type="text"
						className="input"
						placeholder="Ask Atom ..."
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						disabled={isLoading}
					/>
					<button type="submit" className="button" disabled={isLoading}>
						{isLoading ? "Thinking..." : "Send"}
					</button>
				</div>
			</form>

		</div>
	);
}

function TypingDots() {
	return (
		<span className="dots">
			<span>.</span>
			<span>.</span>
			<span>.</span>
		</span>
	);
}
