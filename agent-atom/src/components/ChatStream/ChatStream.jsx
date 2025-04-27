import React, { useState } from "react";
import "./ChatStream.css";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HF_TOKEN);
export default function ChatStream() {
	const [userInput, setUserInput] = useState("");
	const [agentResponse, setAgentResponse] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleCallAgent = async () => {
		setIsLoading(true);

		try {
			client.chatCompletionStream({
				model: "mistralai/Mistral-Nemo-Instruct-2407",
				messages: [{ role: "user", content: userInput }],
			});
		} catch (error) {
			console.error("Error handling agent call:", error);
		}
	};
	return (
		<div className="container">
			<form onSubmit={handleCallAgent} className="form">
				<input
					type="text"
					className="input"
					placeholder="Ask something..."
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					disabled={isLoading}
				/>
				<button type="submit" className="button" disabled={isLoading}>
					{isLoading ? "Thinking..." : "Send"}
				</button>
			</form>

			<div className="responseBox">
				{agentResponse || "AI response will appear here..."}
			</div>
		</div>
	);
}
