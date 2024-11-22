import os
import json
from typing import Optional, Tuple
from pydantic import BaseModel
import openai


SAMBANOVA_API_KEY="6390a121-2903-43b0-ba6d-3cec7b5debe5"

class YouTubeContentModel(BaseModel):
    youtube_title: str
    youtube_description: str
    thumbnail_image_description: str

class Agent:
    def __init__(self, role, goal, backstory, verbose, llm):
        self.role = role
        self.goal = goal
        self.backstory = backstory
        self.verbose = verbose
        self.llm = llm

    def get_completion(self, prompt):
        system_prompt = f"""Role: {self.role}
Goal: {self.goal}
Backstory: {self.backstory}

You must respond in the following JSON format:
{{
    "youtube_title": "your generated title",
    "youtube_description": "your generated description",
    "thumbnail_image_description": "your generated thumbnail description"
}}"""

        try:
            response = self.llm.chat.completions.create(
                model='Meta-Llama-3.1-8B-Instruct',
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                top_p=0.9
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error in get_completion: {e}")
            return None

class Task:
    def __init__(self, description, expected_output, output_json, agent):
        self.description = description
        self.expected_output = expected_output
        self.output_json = output_json
        self.agent = agent

    def execute(self):
        result = self.agent.get_completion(self.description)
        if self.agent.verbose:
            print(f"Task output from {self.agent.role}: {result}")
        return result

class Process:
    sequential = "sequential"

class Crew:
    def __init__(self, agents, tasks, verbose, process):
        self.agents = agents
        self.tasks = tasks
        self.verbose = verbose
        self.process = process

    def kickoff(self):
        class Result:
            def __init__(self, tasks_output):
                self.tasks_output = tasks_output

        outputs = []
        for task in self.tasks:
            output = task.execute()
            outputs.append(type('TaskOutput', (), {'raw': output})())

        return Result(outputs)

def clean_string(value: str) -> str:
    """Clean string by removing quotes, commas, and extra whitespace."""
    cleaned = value.strip().strip('"').strip(',').strip()
    cleaned = cleaned.replace('\\"', '')
    return cleaned

def generate_youtube_content(input_text: str) -> Tuple[str, str, str]:
    """
    Generates optimized YouTube content using SambaNova LLM.

    Args:
        input_text (str): The topic to be used as the basis for the YouTube content.
    Returns:
        Tuple[str, str, str]: Generated YouTube title, description, and thumbnail description.
    """
    # Initialize SambaNova client
    client = openai.OpenAI(
        api_key=SAMBANOVA_API_KEY,
        base_url="https://api.sambanova.ai/v1"
    )

    content_creator = Agent(
        role='YouTube Content Creator',
        goal='Create engaging, SEO-optimized YouTube content',
        backstory="""You are a master of YouTube content creation with deep understanding of the platform.
        You craft content that perfectly balances engagement and SEO optimization.
        You know how to make titles that drive clicks while maintaining authenticity.
        You understand how to write descriptions that boost visibility and provide value.
        You're skilled at designing thumbnails that stop viewers mid-scroll.
        You excel at creating content that ranks well and genuinely interests viewers.""",
        verbose=True,
        llm=client
    )

    content_creation_task = Task(
        description=f"""Based on this topic: "{input_text}", create optimized YouTube content.

        Requirements for the title:
        1. Attention-grabbing and clear
        2. Include relevant keywords
        3. Under 70 characters
        4. Convey value proposition

        Requirements for the description:
        1. First 2-3 lines should hook viewer
        2. Include relevant keywords naturally
        3. Add timestamps if applicable
        4. Include clear call-to-action
        5. Add relevant links and social media

        Requirements for the thumbnail:
        1. Eye-catching design elements
        2. Clear focal point
        3. Readable text overlay
        4. High contrast colors

        Respond in valid JSON format with youtube_title, youtube_description, and thumbnail_image_description fields.""",
        expected_output="JSON with youtube_title, youtube_description, and thumbnail_image_description",
        output_json=YouTubeContentModel,
        agent=content_creator
    )

    crew = Crew(
        agents=[content_creator],
        tasks=[content_creation_task],
        verbose=True,
        process=Process.sequential
    )

    try:
        result = crew.kickoff()

        if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
            final_output = result.tasks_output[-1].raw if result.tasks_output else ""

            # Process the output into key-value pairs
            key_value_pairs = {}
            current_key = None
            current_value = []

            lines = final_output.splitlines()
            for line in lines:
                if line.strip():
                    if ':' in line and not current_key:
                        key, value = line.split(':', 1)
                        current_key = clean_string(key)
                        current_value = [clean_string(value)]
                    elif current_key:
                        current_value.append(clean_string(line))

                    if current_key:
                        key_value_pairs[current_key] = ' '.join(current_value)
                        current_key = None
                        current_value = []

            youtube_title = clean_string(key_value_pairs.get('youtube_title', ''))
            youtube_description = key_value_pairs.get('youtube_description', '').replace('\\n', '\n')
            thumbnail_image_description = clean_string(key_value_pairs.get('thumbnail_image_description', ''))

            return youtube_title, youtube_description, thumbnail_image_description

    except Exception as e:
        print(f"Error in workflow execution: {e}")

    return "", "", ""

#if __name__ == "__main__":
#    input_text = "How to start investing for beginners"
#    title, description, thumbnail = generate_youtube_content(input_text)
#
#    print("\nGenerated YouTube Title:")
#    print("-" * 50)
#    print(title)
#    print("\nGenerated Description:")
#    print("-" * 50)
#    print(description)
#    print("\nThumbnail Description:")
#    print("-" * 50)
 #   print(thumbnail)