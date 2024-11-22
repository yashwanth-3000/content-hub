import os
import json
from typing import Optional, Tuple
from pydantic import BaseModel
import openai


SAMBANOVA_API_KEY="6390a121-2903-43b0-ba6d-3cec7b5debe5"

class InstagramModel(BaseModel):
    post_caption: str
    image_description: Optional[str]

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
    "post_caption": "$#your generated instagram caption with hashtags#$",
    "image_description": "your generated image description"
}}

Important: The Instagram caption must be wrapped with $# at the start and #$ at the end."""

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

def extract_instagram_text(text: str) -> str:
    """Extract Instagram text between $# and #$ markers."""
    start_marker = '$#'
    end_marker = '#$'
    try:
        start_idx = text.find(start_marker)
        end_idx = text.find(end_marker)
        if start_idx != -1 and end_idx != -1:
            return text[start_idx + len(start_marker):end_idx].strip()
    except Exception as e:
        print(f"Error extracting Instagram text: {e}")
    return text

def clean_string(value: str) -> str:
    """Clean string by removing quotes, commas, and extra whitespace."""
    cleaned = value.strip().strip('"').strip(',').strip()
    cleaned = cleaned.replace('\\"', '')
    return cleaned

def analyze_crypto_content_insta(results_string: str) -> Tuple[str, str]:
    """
    Generates optimized Instagram content using SambaNova LLM.

    Args:
        results_string (str): Input content to analyze and convert to Instagram format
    Returns:
        Tuple[str, str]: Generated Instagram caption and image description
    """
    # Initialize SambaNova client
    client = openai.OpenAI(
        api_key=SAMBANOVA_API_KEY,
        base_url="https://api.sambanova.ai/v1"
    )

    content_creator = Agent(
        role='Instagram Content Creator',
        goal='Transform crypto content into engaging Instagram posts',
        backstory="""You are a specialist in adapting crypto content for Instagram's visual-first environment.
        You excel at creating eye-catching single post concepts.
        You know how to write captions that drive engagement while respecting Instagram's character limits.
        You understand how to optimize content for maximum reach using Instagram's algorithm.
        You're skilled at crafting strategic hashtag sets and creating attention-grabbing visuals.""",
        verbose=True,
        llm=client
    )

    content_creation_task = Task(
        description=f"""Convert this crypto content into Instagram format: "{results_string}"

        Requirements for the Instagram post:
        1. Engaging and conversational tone
        2. Clear structure with line breaks
        3. Strategic use of emojis
        4. Brief but impactful messaging
        5. Storytelling elements
        6. Relevant hashtags
        7. Strong call-to-action

        Requirements for the image:
        1. Eye-catching design
        2. Bold visual elements
        3. Clear focal point
        4. Instagram-optimized layout
        5. Engaging visuals or data presentation

        The post should include:
        - Attention-grabbing opener
        - Key message or insight
        - Supporting points with emojis
        - Engaging questions
        - Call-to-action
        - Strategic hashtag set

        Remember to wrap the Instagram text with $# at the start and #$ at the end.
        
        Respond in valid JSON format with post_caption and image_description fields.""",
        expected_output="JSON with post_caption and image_description",
        output_json=InstagramModel,
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

            try:
                # Try parsing as JSON first
                output_data = json.loads(final_output)
                post_caption = extract_instagram_text(output_data.get('post_caption', ''))
                image_description = clean_string(output_data.get('image_description', ''))
                return post_caption, image_description
            except json.JSONDecodeError:
                # Fallback to manual parsing if JSON parsing fails
                post_caption = ""
                image_description = ""
                
                # Extract Instagram text between markers
                start_marker = '$#'
                end_marker = '#$'
                start_idx = final_output.find(start_marker)
                end_idx = final_output.find(end_marker)
                if start_idx != -1 and end_idx != -1:
                    post_caption = final_output[start_idx + len(start_marker):end_idx].strip()

                # Extract image description
                img_desc_start = final_output.find('"image_description":')
                if img_desc_start != -1:
                    img_desc_text = final_output[img_desc_start:].split(':', 1)[1].strip()
                    image_description = clean_string(img_desc_text)

                return post_caption, image_description

    except Exception as e:
        print(f"Error in workflow execution: {e}")

    return "", ""

if __name__ == "__main__":
    results_string = "Bitcoin "
    post_caption, image_description = analyze_crypto_content_insta(results_string)

    print("\nGenerated Instagram Post:")
    print("-" * 50)
    print(post_caption)
    print("\nImage Description:")
    print("-" * 50)
    print(image_description)