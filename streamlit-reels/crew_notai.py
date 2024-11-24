import os
import json
from typing import Optional
from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel
from crewai import Agent, Task, Crew, Process, LLM
from typing import List, Dict
from typing import Tuple, List, Dict, Any
import openai
import os

from typing import Optional
from pydantic import BaseModel

#SAMBANOVA_API_KEY="Enter you api key"


llm = LLM(
    model="sambanova/Meta-Llama-3.1-405B-Instruct",
    api_key=os.environ.get("SAMBANOVA_API_KEY"),
    temperature=0.5
)

class VoiceoverModel(BaseModel):
    voiceover_script: str


def generate_voiceover_lines(input_idea):
    """
    Generates an optimized voiceover script for an Instagram Reel based on the input idea.

    Args:
        input_idea (str): The concept or topic for the Instagram Reel.
    Returns:
        str: A complete voiceover script optimized for Instagram Reels.
    """
    # Content Structure Analyzer Agent
    structure_analyzer = Agent(
        role='Reel Structure Specialist',
        goal='Analyze and structure content for maximum Instagram Reel engagement',
        backstory=f"""You are an expert in Instagram Reel content structure and viewer retention.
        Here is the input idea: {input_idea}
        You understand hook creation, pacing, and how to maintain viewer attention throughout a short-form video.
        You excel at breaking down complex topics into bite-sized, engaging segments.
        You know exactly how to structure content to prevent viewers from scrolling past.""",
        verbose=True,
        
    )

    # Script Creator Agent
    script_creator = Agent(
        role='Voiceover Script Specialist',
        goal='Create engaging, concise voiceover scripts for Instagram Reels',
        backstory="""You are a master of short-form video scripting with deep understanding of social media psychology.
        You craft voiceover lines that hook viewers instantly and keep them watching.
        You write direct, natural-flowing scripts without any technical indicators or markers.
        You understand the perfect balance between information delivery and entertainment.
        You're skilled at incorporating natural pauses and transitions.
        You excel at writing scripts that work well with Instagram's algorithm while maintaining authenticity.
        You ensure all scripts can be delivered within 60 seconds.""",
        verbose=True,
        
    )

    # New Agent: Mr. Beast Style Text Creator
    mr_beast_style_creator = Agent(
        role='Mr. Beast Style Text Specialist',
        goal='Create engaging, high-energy text for social media',
        backstory="""You specialize in crafting high-energy, attention-grabbing text in the style of Mr. Beast.
        You know how to use excitement, emphasis, and over-the-top language to keep viewers hooked.
        You create powerful, punchy scripts with lots of excitement and urgency, similar to the language used by Mr. Beast on his YouTube channel.""",
        verbose=True,
    
    )

    # Task 1: Content Structure Analysis
    structure_analysis_task = Task(
        description=f"""Analyze the input idea and create a structured outline for the Reel: {input_idea}.
        Requirements:
        1. Identify key points that will grab attention
        2. Structure content for maximum retention
        3. Plan natural transitions between segments
        4. Ensure pacing works for a sub-60-second video
        5. Consider trending Reel formats
        6. Map out engagement triggers throughout the video
        7. Plan hook placement and closing call-to-action
        8. Optimize for Instagram's algorithm
        9. Include natural pauses in content flow
        10. Maintain viewer interest throughout""",
        expected_output="""
        {
            "content_structure": "string",
            "key_moments": ["string"],
            "pacing_notes": "string"
        }""",
        agent=structure_analyzer
    )

    # Task 2: Voiceover Script Creation
    script_creation_task = Task(
        description="""Create a complete voiceover script based on the content structure.
        Requirements:
        1. Write a continuous, flowing script without any technical markers or pause indicators
        2. Create a powerful hook in the first 3 seconds
        3. Keep total script under 60 seconds when spoken
        4. Include natural transitions between points
        5. End with a strong call-to-action
        6. Use power words and engaging language
        7. Maintain consistent energy throughout
        8. Include natural pauses in speech rhythm
        9. Optimize for Instagram Reels algorithm
        10. Sound authentic and relatable""",
        expected_output="""
        {
            "voiceover_script": "AI is changing the world, but what do you really know about it? From robots to machines that can think for themselves, AI is more than just a buzzword. Did you know AI can learn from its own experiences? It's like having a super smart friend who gets smarter every day. But AI isn't just some futuristic concept, it's already all around us. From virtual assistants to self-driving cars, AI is making our lives easier and more convenient. And here's a mind-blowing fact: AI can process information 10 times faster than the human brain. That's like having a supercomputer in the palm of your hand. Imagine a world where AI helps us solve some of humanity's biggest challenges. Want to learn more? Check out the link in our bio to discover the latest AI innovations. Stay ahead of the curve and dive into the future of AI today!"
        }""",
        output_json=VoiceoverModel,
        agent=script_creator
    )

    # Task 3: Mr. Beast Style Text Generation
    mr_beast_style_task = Task(
        description="""Generate a high-energy voiceover script in the style of Mr. Beast. The script should use lots of emphasis, excitement, and engaging language.
        Requirements:
        1. Use strong emphasis on words like 'GUYS!', 'BELIEVE!', 'INSANE!', 'POSSIBLE!', and other high-energy terms.
        2. Use humor and excitement to capture attention.
        3. The script should evoke strong emotions like surprise, amazement, and urgency.
        4. Incorporate emoticons and popular internet slang.
        5. Keep the total script under 60 seconds.""",
        expected_output="""
        {
            "voiceover_script": "GUYS! You Won't BELIEVE What AI Can Do! 🤯 It's LITERALLY CHANGING Everything! Imagine having a SUPER SMART robot friend... That's RIGHT! AI is making it POSSIBLE! From helping doctors save lives 🏥 To making SELF-DRIVING CARS! 🚗 This is INSANE! The future is HERE! And it's getting BETTER every day! Want to see more MIND-BLOWING tech? SMASH that like button! 👍 And don't forget to SUBSCRIBE! The future is going to be CRAZY! 🚀"
        }""",
        output_json=VoiceoverModel,
        agent=mr_beast_style_creator
    )

    # Initialize Crew
    crew = Crew(
        agents=[structure_analyzer, script_creator, mr_beast_style_creator],
        tasks=[structure_analysis_task, script_creation_task, mr_beast_style_task],
        verbose=True,
        process=Process.sequential
    )

    # Execute workflow
    result = crew.kickoff()

    # Extract voiceover script
    try:
        if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
            final_task_output = result.tasks_output[-1]
            if hasattr(final_task_output, 'output') and isinstance(final_task_output.output, VoiceoverModel):
                return final_task_output.output.voiceover_script
            elif hasattr(final_task_output, 'raw'):
                try:
                    json_output = json.loads(final_task_output.raw)
                    return json_output.get('voiceover_script', '')
                except json.JSONDecodeError:
                    pass
    except Exception as e:
        print(f"Error processing output: {e}")

    return ''

#ai = generate_voiceover_lines("ai")
#print(ai)

#print(type(ai))