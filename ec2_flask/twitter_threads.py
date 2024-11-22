import os
import json
from typing import Optional, Dict, List, Tuple
from pydantic import BaseModel
import openai

SAMBANOVA_API_KEY="6390a121-2903-43b0-ba6d-3cec7b5debe5"

class ThreadTweetModel(BaseModel):
    tweet_text_1: str
    image_description_1: Optional[str]
    tweet_text_2: str
    image_description_2: Optional[str]
    tweet_text_3: str
    image_description_3: Optional[str]
    tweet_text_4: str
    image_description_4: Optional[str]
    tweet_text_5: str
    image_description_5: Optional[str]
    tweet_text_6: str
    image_description_6: Optional[str]
    tweet_text_7: str
    image_description_7: Optional[str]

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

You must respond in the following JSON format for a 7-part Twitter thread:
{{
    "tweet_text_1": "First tweet with strong hook 🧵1/7",
    "image_description_1": "First tweet image description",
    "tweet_text_2": "Second tweet content 🧵2/7",
    "image_description_2": "Second tweet image description",
    "tweet_text_3": "Third tweet content 🧵3/7",
    "image_description_3": "Third tweet image description",
    "tweet_text_4": "Fourth tweet content 🧵4/7",
    "image_description_4": "Fourth tweet image description",
    "tweet_text_5": "Fifth tweet content 🧵5/7",
    "image_description_5": "Fifth tweet image description",
    "tweet_text_6": "Sixth tweet content 🧵6/7",
    "image_description_6": "Sixth tweet image description",
    "tweet_text_7": "Final tweet with CTA 🧵7/7",
    "image_description_7": "Final tweet image description"
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
    """Clean string by removing quotes and extra whitespace."""
    return value.strip().strip('"').strip(',').strip()

def generate_twitter_thread(input_text: str) -> Tuple[str, str, str, str, str, str, str, str, str, str, str, str, str, str]:
    """
    Generates a Twitter thread with images based on input text.
    
    Args:
        input_text (str): The topic for the Twitter thread
    Returns:
        Tuple[str, str, ...]: Returns 14 strings representing 7 tweets and their image descriptions
    """
    # Initialize SambaNova client
    client = openai.OpenAI(
        api_key=SAMBANOVA_API_KEY,
        base_url="https://api.sambanova.ai/v1"
    )

    thread_creator = Agent(
        role='Twitter Thread Creator',
        goal='Create engaging, viral Twitter threads',
        backstory="""You are a master of Twitter thread creation with deep understanding of viral content.
        You craft threads that maintain engagement from start to finish.
        You know how to hook readers with powerful openings.
        You understand how to structure information for maximum impact.
        You're skilled at creating smooth transitions between tweets.
        You excel at ending threads with strong calls-to-action.
        You know how to use visuals to enhance your message.""",
        verbose=True,
        llm=client
    )

    thread_creation_task = Task(
        description=f"""Create an engaging Twitter thread about: "{input_text}"

        Requirements:
        1. Start with a powerful hook (Tweet 1)
        2. Maintain engagement throughout
        3. Include relevant hashtags and emojis
        4. Add 🧵 and tweet numbers (e.g., 1/7)
        5. Keep each tweet under 280 characters
        6. Create smooth transitions
        7. End with a strong call-to-action
        8. Include relevant image descriptions
        
        Each tweet should work both standalone and as part of the thread.""",
        expected_output="JSON with tweet_text_1 through tweet_text_7 and image_description_1 through image_description_7",
        output_json=ThreadTweetModel,
        agent=thread_creator
    )

    crew = Crew(
        agents=[thread_creator],
        tasks=[thread_creation_task],
        verbose=True,
        process=Process.sequential
    )

    # Initialize empty variables for all tweets and descriptions
    tweet_text_1 = tweet_text_2 = tweet_text_3 = tweet_text_4 = ""
    tweet_text_5 = tweet_text_6 = tweet_text_7 = ""
    image_description_1 = image_description_2 = image_description_3 = ""
    image_description_4 = image_description_5 = image_description_6 = ""
    image_description_7 = ""

    try:
        result = crew.kickoff()
        
        if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
            final_output = result.tasks_output[-1].raw if result.tasks_output else ""

            # Process the output into key-value pairs
            key_value_pairs = {}
            lines = final_output.splitlines()
            for line in lines:
                if line.strip():
                    if ':' in line:
                        key, value = line.split(':', 1)
                        key = clean_string(key)
                        value = clean_string(value)
                        key_value_pairs[key] = value

            # Assign values to individual variables
            tweet_text_1 = key_value_pairs.get('tweet_text_1', '')
            tweet_text_2 = key_value_pairs.get('tweet_text_2', '')
            tweet_text_3 = key_value_pairs.get('tweet_text_3', '')
            tweet_text_4 = key_value_pairs.get('tweet_text_4', '')
            tweet_text_5 = key_value_pairs.get('tweet_text_5', '')
            tweet_text_6 = key_value_pairs.get('tweet_text_6', '')
            tweet_text_7 = key_value_pairs.get('tweet_text_7', '')

            image_description_1 = key_value_pairs.get('image_description_1', '')
            image_description_2 = key_value_pairs.get('image_description_2', '')
            image_description_3 = key_value_pairs.get('image_description_3', '')
            image_description_4 = key_value_pairs.get('image_description_4', '')
            image_description_5 = key_value_pairs.get('image_description_5', '')
            image_description_6 = key_value_pairs.get('image_description_6', '')
            image_description_7 = key_value_pairs.get('image_description_7', '')

    except Exception as e:
        print(f"Error in workflow execution: {e}")

    return (
        tweet_text_1, image_description_1,
        tweet_text_2, image_description_2,
        tweet_text_3, image_description_3,
        tweet_text_4, image_description_4,
        tweet_text_5, image_description_5,
        tweet_text_6, image_description_6,
        tweet_text_7, image_description_7
    )

#if __name__ == "__main__":
#    input_text = "Write a thread about investing for beginners"
#    (
#        tweet_1, image_1,
 #       tweet_2, image_2,
#        tweet_3, image_3,
#        tweet_4, image_4,
#        tweet_5, image_5,
#        tweet_6, image_6,
#        tweet_7, image_7
#    ) = generate_twitter_thread(input_text)
#    
#    print("\nGenerated Twitter Thread:")
#    print("-" * 50)
#    print(f"\nTweet 1:\n{tweet_1}")
#    print(f"Image 1:\n{image_1}")
#    print(f"\nTweet 2:\n{tweet_2}")
#    print(f"Image 2:\n{image_2}")
#    print(f"\nTweet 3:\n{tweet_3}")
 #   print(f"Image 3:\n{image_3}")
#    print(f"\nTweet 4:\n{tweet_4}")
#    print(f"Image 4:\n{image_4}")
#    print(f"\nTweet 5:\n{tweet_5}")
#    print(f"Image 5:\n{image_5}")
#    print(f"\nTweet 6:\n{tweet_6}")
#    print(f"Image 6:\n{image_6}")
#    print(f"\nTweet 7:\n{tweet_7}")
 #   print(f"Image 7:\n{image_7}")