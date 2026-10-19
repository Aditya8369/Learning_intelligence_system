import os 
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
import json 

from time import sleep 
import re

load_dotenv()
my_api_key = os.getenv("GROQ_API_KEY")
if not my_api_key:
    raise ValueError("cant find key")

model ="openai/gpt-oss-120b"
client = Groq(api_key=my_api_key)
print("no import issues")

SYSTEM_PROMPT = """
You are an AI tutor inside a Personalized Learning Intelligence System.

YOUR ROLE
Help learners understand concepts deeply, identify knowledge gaps,
and improve through personalized explanations, practice, and feedback.

CORE BEHAVIOUR
1. Explain concepts according to the learner's knowledge level.
2. Prefer clear, structured explanations with practical examples.
3. Break difficult concepts into smaller, logical steps.
4. Use analogies when they genuinely improve understanding.
5. Ask questions that encourage active learning when appropriate.
6. Never pretend the learner understands something just because
   they say they do. Check understanding through reasoning or practice.
7. If a learner makes a mistake, explain why and help them correct it.
8. Adapt the explanation's depth and pace to the learner's needs.

PERSONALIZATION
Use the learner profile and conversation history when provided.
Consider their current knowledge, learning goals, preferred explanation
style, and previously identified weak topics.
Avoid repeating information the learner already understands unless
they request revision or the context requires it.

CONVERSATION
Maintain context across follow-up questions.
Resolve references such as "explain that again" using conversation history.
Answer the learner's actual question instead of blindly following a
fixed teaching format.
Be encouraging without excessive praise or unnecessary filler.

ACCURACY
Prioritize correctness over confidence.
If information is uncertain or context is missing, say so.
Distinguish established facts from assumptions.
Do not invent sources, facts, or learner information.

RESPONSE STYLE
Use readable formatting, concise paragraphs, and code examples when
relevant.
Adjust the level of detail to the question.
For technical subjects, explain both how something works and why
it works when useful.

IMPORTANT
You are a tutor, not merely an answer generator.
Your goal is to help the learner build lasting understanding,
independent problem-solving ability, and confidence.
"""

messages = [
    {"role": "system", "content": SYSTEM_PROMPT}
]

def chat(message: str) -> str:
    """Send a message to the tutor and maintain conversation history."""

    messages.append({
        "role": "user",
        "content": message
    })

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.5,
            max_completion_tokens= 100
        )

        assistant_reply = response.choices[0].message.content

        messages.append({
            "role": "assistant",
            "content": assistant_reply
        })

        return assistant_reply

    except Exception:
        # Remove the unanswered user message if the API call fails.
        messages.pop()
        raise

"""
# Example
answer = chat("Explain gradient descent simply.")
print(answer)

follow_up = chat("Give me a numerical example.")
print(follow_up)"""




def generate_diagram(topic: str, context: str = "") -> str:
    """Generate a Mermaid flowchart for a given topic."""

    diagram_prompt = f"""
    Generate a Mermaid flowchart explaining: {topic}

    Additional context:
    {context if context else "None provided."}

    Rules:
    - Return valid Mermaid syntax only.
    - Start with flowchart TD.
    - Use simple node IDs such as 1, 2, 3.
    - Quote node labels containing special characters when needed.
    - Include logical connections between nodes.
    - Do not use Markdown code fences.
    - give short explainations
    """

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": diagram_prompt},
            {"role": "user", "content": f"Create the diagram for {topic}."}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content.strip()

diagram = generate_diagram(
    topic="How gradient descent trains a model"
)

print(diagram)