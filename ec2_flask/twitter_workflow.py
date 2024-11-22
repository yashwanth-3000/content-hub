import json
from typing import Optional
from pydantic import BaseModel
import openai

SAMBANOVA_API_KEY="6390a121-2903-43b0-ba6d-3cec7b5debe5"

class TweetModel(BaseModel):
    tweet_text: str
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
    "tweet_text": "your generated tweet",
    "image_description": "your generated image description"
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

def generate_single_tweet(input_text):
    """
    Generates a single, optimized tweet based on the input text.

    Args:
        input_text (str): The text to be used as the basis for the tweet.
    Returns:
        tuple: A tuple containing the generated tweet text and image description.
    """
    # Initialize SambaNova client
    client = openai.OpenAI(
        api_key=SAMBANOVA_API_KEY,
        base_url="https://api.sambanova.ai/v1"
    )

    creator = Agent(
        role='Twitter Content Strategist',
        goal='Create optimized, engaging Twitter content',
        backstory="""You are a master of Twitter content creation with deep understanding of human psychology.
        You craft tweets that perfectly balance authenticity and optimization.
        You know how to make content both algorithmically favored and genuinely interesting to humans.
        You understand the perfect mix of hooks, value delivery, and call-to-actions.
        You're skilled at incorporating trending topics naturally while maintaining authenticity.
        You excel at writing in a way that sounds natural and conversational, not robotic or overly marketed.""",
        verbose=True,
        llm=client
    )

    content_creation_task = Task(
        description=f"""Based on this topic: "{input_text}", create an engaging tweet and matching image description.
        
        Requirements for the tweet:
        1. Natural, human voice
        2. 1-2 relevant hashtags
        3. 1-2 appropriate emojis
        4. Strong hook
        5. Clear value
        6. Under 280 characters
        7. Engaging language
        
        Requirements for the image description:
        1. Brief description of an image that would complement the tweet
        2. Should be visually appealing
        3. Should support the tweet's message
        
        Respond in valid JSON format with tweet_text and image_description fields.""",
        expected_output="JSON with tweet_text and image_description",
        output_json=TweetModel,
        agent=creator
    )

    crew = Crew(
        agents=[creator],
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
            lines = final_output.splitlines()
            for line in lines:
                if line.strip():
                    if ':' in line:
                        key, value = line.split(':', 1)
                        key_value_pairs[key.strip()] = value.strip()
            
            tweet_text = key_value_pairs.get('"tweet_text"', '').strip('"')
            image_description = key_value_pairs.get('"image_description"', '').strip('"')
            return tweet_text, image_description
                
    except Exception as e:
        print(f"Error in workflow execution: {e}")
    
    return "", ""

#if __name__ == "__main__":
#    input_text = "Write a tweet about investing"
#    tweet_text, image_description = generate_single_tweet(input_text)
#   
#    print("\nGenerated Tweet:")
#    print("-" * 50)
#    print(tweet_text)
#    print("\nImage Description:")
#    print("-" * 50)
#    print(image_description)