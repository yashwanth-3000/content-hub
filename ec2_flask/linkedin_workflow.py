import os
import json
from typing import Optional, Tuple
from pydantic import BaseModel
import openai


SAMBANOVA_API_KEY="6390a121-2903-43b0-ba6d-3cec7b5debe5"

class LinkedinModel(BaseModel):
    linkedin_text: str
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
    "linkedin_text": "$#your generated linkedin post#$",
    "image_description": "your generated image description"
}}

Important: The LinkedIn text must be wrapped with $# at the start and #$ at the end."""

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

def extract_linkedin_text(text: str) -> str:
    """Extract LinkedIn text between $# and #$ markers."""
    start_marker = '$#'
    end_marker = '#$'
    try:
        start_idx = text.find(start_marker)
        end_idx = text.find(end_marker)
        if start_idx != -1 and end_idx != -1:
            return text[start_idx + len(start_marker):end_idx].strip()
    except Exception as e:
        print(f"Error extracting LinkedIn text: {e}")
    return text

def clean_string(value: str) -> str:
    """Clean string by removing quotes, commas, and extra whitespace."""
    cleaned = value.strip().strip('"').strip(',').strip()
    cleaned = cleaned.replace('\\"', '')
    return cleaned

def analyze_crypto_content_Linkedin(results_string: str) -> Tuple[str, str]:
    """
    Generates optimized LinkedIn content using SambaNova LLM.

    Args:
        results_string (str): Input content to analyze and convert to LinkedIn format
    Returns:
        Tuple[str, str]: Generated LinkedIn text and image description
    """
    # Initialize SambaNova client
    client = openai.OpenAI(
        api_key=SAMBANOVA_API_KEY,
        base_url="https://api.sambanova.ai/v1"
    )

    content_creator = Agent(
        role='LinkedIn Content Creator',
        goal='Transform crypto content into professional LinkedIn posts',
        backstory="""You are a specialist in adapting crypto content for LinkedIn's professional environment.
        You excel at expanding brevity into LinkedIn's detailed format.
        You know how to maintain technical accuracy while adding professional context.
        You understand how to translate casual tone into LinkedIn's professional voice.
        You're an expert at crafting content that resonates with LinkedIn's business audience.""",
        verbose=True,
        llm=client
    )

    content_creation_task = Task(
        description=f"""Convert this crypto content into LinkedIn format: "{results_string}"

        Requirements for the LinkedIn post:
        1. Professional tone and language
        2. Expanded context with business implications
        3. Technical accuracy with added depth
        4. Clear structure with paragraphs
        5. Strategic use of whitespace
        6. Relevant hashtags and $SYMBOLS
        7. Professional call-to-action

        Requirements for the image:
        1. Professional aesthetic
        2. Clean design elements
        3. Business-appropriate visuals
        4. Professional color scheme
        5. Clear data visualization if applicable

        The post should include:
        - Compelling headline
        - Opening hook
        - Main content with key insights
        - Professional context
        - Clear call-to-action
        - Strategic hashtags

        Remember to wrap the LinkedIn text with $# at the start and #$ at the end.
        
        Respond in valid JSON format with linkedin_text and image_description fields.""",
        expected_output="JSON with linkedin_text and image_description",
        output_json=LinkedinModel,
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
                linkedin_text = extract_linkedin_text(output_data.get('linkedin_text', ''))
                image_description = clean_string(output_data.get('image_description', ''))
                return linkedin_text, image_description
            except json.JSONDecodeError:
                # Fallback to manual parsing if JSON parsing fails
                linkedin_text = ""
                image_description = ""
                
                # Extract LinkedIn text between markers
                start_marker = '$#'
                end_marker = '#$'
                start_idx = final_output.find(start_marker)
                end_idx = final_output.find(end_marker)
                if start_idx != -1 and end_idx != -1:
                    linkedin_text = final_output[start_idx + len(start_marker):end_idx].strip()

                # Extract image description
                img_desc_start = final_output.find('"image_description":')
                if img_desc_start != -1:
                    img_desc_text = final_output[img_desc_start:].split(':', 1)[1].strip()
                    image_description = clean_string(img_desc_text)

                return linkedin_text, image_description

    except Exception as e:
        print(f"Error in workflow execution: {e}")

    return "", ""

#if __name__ == "__main__":
#    results_string = "Crypto markets are showing strong growth, driven by institutional adoption and new technological advancements. #Blockchain #Innovation #Enterprise"
 #   linkedin_text, image_description = analyze_crypto_content_Linkedin(results_string)
#
 #   print("\nGenerated LinkedIn Post:")
  #  print("-" * 50)
   # print(linkedin_text)
    # print("\nImage Description:")
    #print("-" * 50)
    #print(image_description)