"""
agents_workflow.py

This script demonstrates a task-based approach to generating a children's story
and creating a voiceover script based on that story. It uses a Task class to
encapsulate different stages of the process, each with its own agent function
and callback.

The script relies on an external 'story_preferences' module, which is assumed
to contain a 'get_story_preferences' function for story generation.

Usage:
    Run this script directly: python agents_workflow.py

Dependencies:
    - story_preferences module (must be in the same directory or PYTHONPATH)
"""

from story_preferences import get_story_preferences
from typing import Optional, Dict, Union
from crewai import Agent, Crew, Task, Process, crew


import os

os.environ['OPENAI_API_KEY'] = 'sk-proj-L5CcdYdlS66D1OFUFAyGT3BlbkFJ2zqDySD8cIbcK1F7BjGn'


# Global variables to store results
story_result = None
voiceover_result = None
animation_style_result = None
storyline_result = None
def callback_function_story(result):
    """
    Callback function for the story generation task.
    
    Args:
        result (str): The generated story.
    
    Side effects:
        - Stores the result in the global story_result variable.
        - Prints the result to the console.
    """
    global story_result
    story_result = result
    print(f"Story Result: {result}")
    return result;

def callback_function_voiceover_lines(result):
    """
    Callback function for the voiceover generation task.
    
    Args:
        result (str): The generated voiceover script.
    
    Side effects:
        - Stores the result in the global voiceover_result variable.
        - Prints the result to the console.
    """
    global voiceover_result
    voiceover_result = result
    print(f"Voiceover Result: {result}")


def get_full_story_preferences(
    action: str,
    animation_style: str,
    prompt: Optional[str] = None,
    subtitles: Optional[bool] = None,
    age_group: Optional[str] = None,
    transition_type: Optional[str] = None
) -> Dict[str, Union[str, bool, None]]:
    """
    Gets the full story preferences using the original get_story_preferences function.
    
    This function is a wrapper around the original get_story_preferences function,
    returning the complete result dictionary.
    
    Args:
        action (str): Must be either "Scan" or "Prompt"
        animation_style (str): Must be either "Superhero" or "Toon"
        prompt (Optional[str]): Required if action is "Prompt"
        subtitles (Optional[bool]): Whether to include subtitles
        age_group (Optional[str]): One of the valid age groups
        transition_type (Optional[str]): One of "fade", "slide", "crossfade"
    
    Returns:
        Dict containing all preferences and formatted output string
    
    Raises:
        ValueError: If any arguments are invalid
    """
    return get_story_preferences(
        action=action,
        animation_style=animation_style,
        prompt=prompt,
        subtitles=subtitles,
        age_group=age_group,
        transition_type=transition_type
    )

def get_animation_style(
    action: str,
    animation_style: str,
    prompt: Optional[str] = None,
    subtitles: Optional[bool] = None,
    age_group: Optional[str] = None,
    transition_type: Optional[str] = None
) -> str:
    """
    Gets only the animation style from the story preferences.
    
    This function uses the get_story_preferences function internally
    but returns only the animation style.
    
    Args:
        action (str): Must be either "Scan" or "Prompt"
        animation_style (str): Must be either "Superhero" or "Toon"
        prompt (Optional[str]): Required if action is "Prompt"
        subtitles (Optional[bool]): Whether to include subtitles
        age_group (Optional[str]): One of the valid age groups
        transition_type (Optional[str]): One of "fade", "slide", "crossfade"
    
    Returns:
        str: The animation style ("Superhero" or "Toon")
    
    Raises:
        ValueError: If any arguments are invalid
    """
    result = get_story_preferences(
        action=action,
        animation_style=animation_style,
        prompt=prompt,
        subtitles=subtitles,
        age_group=age_group,
        transition_type=transition_type
    )
    return result['animation_style']

def agents_workflow(prompt, animation_style):
    prompt_analyzer = Agent(
    role="Analyze and understand given prompts",
    goal="Accurately identify the theme and target age group of the provided story prompt.",
    backstory="""Your task is to analyze the story prompt and animation style provided by the user. A prompt is a suggestion or idea intended to inspire the creation of a story.

    Your primary objectives are:
    1. **Theme Identification**: Determine the central topic, message, or concept of the story. Themes can range from adventure, friendship, and courage to more complex topics like morality, love, and growth.
    2. **Age Group Determination**: Identify the intended audience's age range for the story. Age groups can vary widely, such as toddlers (0-3 years), early childhood (4-7 years), middle childhood (8-12 years),
     and young adults (13+ years). Understanding the age group is crucial as it influences the language complexity, plot structure, and themes appropriate for the audience.

    Your analysis will provide critical context to the next agent in the pipeline, which is responsible for generating a story that aligns with the identified theme and is suitable for the target age group.
    This ensures that the resulting story is engaging, appropriate, and resonates well with its intended readers.

    By effectively performing this analysis, you play a key role in the story creation process, ensuring that the generated content is both relevant and appealing to its audience.
    """,
    verbose=True,
    allow_delegation=False,
    #llm=llm,
    )

    prompt_analyzer_task = Task(
        description=prompt,
        agent=prompt_analyzer,
        expected_output="Here is the story line: {result}. The story should have the following theme: {theme}. Please explain the theme and detail the types of characters that need to be included to align with the theme and appeal to the target age group."
    )


    storywriter = Agent(
        role="Children's Storywriter based on the given theme and storyline",
        goal="Craft very short and engaging children's stories based on the prompt (which includes the storyline and characters), ensuring the stories are appropriate for children, using simple language, and incorporating a moral or lesson if applicable.",
        backstory="""You are tasked with writing children's stories that will be used by a text-to-image model to generate corresponding images. These images will then be compiled into a video.

        Your primary objectives are:
        1. **Story Creation**: Develop concise and captivating stories based on the analyzed prompt provided by the prompt analyzer agent. The prompt includes a theme and a target age group, which should guide your storytelling approach.
        2. **Engagement**: Ensure that the stories are engaging and visually appealing. Use vivid descriptions and imaginative scenarios to capture the interest of young readers.
        3. **Language Simplicity**: Write in simple and clear language appropriate for the identified age group. Avoid complex vocabulary and sentence structures to ensure the story is easily understandable.
        4. **Moral or Lesson**: Incorporate a moral or lesson if applicable, but only if it enhances the story. The primary focus should be on creating an enjoyable and memorable narrative.
        5. **Visual Appeal**: Craft stories that lend themselves well to visual representation. Consider how the text-to-image model will interpret the story to create engaging images. Ensure that key elements and scenes are described vividly to aid in the visual generation process.
        6. **Brevity**: The stories should be very short, suitable for being told in under one minute. This constraint ensures that the resulting images can be compiled into a cohesive and concise video.


        By following these guidelines, you will create stories that are not only enjoyable for children but also visually appealing and suitable for the text-to-image generation process.
        """,
        verbose=True,
        allow_delegation=False,
        #llm=llm,
    )

    story_task = Task(
        description="You are a storywriter tasked with writing short, engaging, and visually appealing stories for children based on a given theme and storyline.",
        agent=storywriter,
        callback=callback_function_story,
        expected_output="A very short, engaging, and visually appealing story suitable for children, featuring modern style and characters, written in simple language and incorporating a moral lesson if applicable."
        
    )

    voiceover_generator = Agent(
        role="Voiceover Generator",
        goal="Transform short children's stories into dynamic and emotionally rich audio stories within 30 seconds, creating an immersive auditory experience.",
        backstory="""You are tasked with generating engaging voiceovers for children's stories. Using the input story provided by the storywriter agent, create a vivid and captivating audio narration.

        Your primary objectives are:
        1. **Audio Transformation**: Convert the written story into an expressive and emotionally engaging audio story. Ensure that the narration is lively and appropriate for the target age group.
        2. **Duration**: Keep the voiceover under 30 seconds(can be extended if needed) to ensure it aligns with the short story format and fits well into the overall video production.
        3. **Immersive Experience**: Use dynamic voice modulation, appropriate pacing, and sound effects if applicable to create an immersive auditory experience for children.
        4. **Preparation for Visuals**: Remember that your voiceover will be used to generate image prompts for the text-to-image model. Ensure that the narration emphasizes key visual elements of the story to aid in the visual generation process.

        Example Workflow:
        - **Input Story**: "Once upon a time, in a faraway land, a little dragon named Danny felt lonely. One day, he helped a lost bunny find its way home. In return, the bunny and its friends became Danny's new pals. Danny learned that kindness brings friends and happiness."
        - **Voiceover**: "In a faraway land, little Danny the dragon felt so lonely. But one day, when he helped a lost bunny find its way home, Danny found new friends in the bunny and its pals. Danny discovered that kindness brings friendship and joy."

        By following these guidelines, you will create engaging and vivid voiceovers that enhance the storytelling experience and support the visual generation process.
        """,
        verbose=True,
        allow_delegation=False,
        #llm=llm,
    )
    voice_task = Task(
        description="analyze the story and rewrite the story so that to make a engganig voiceover.",
        agent=voiceover_generator,
        callback=callback_function_voiceover_lines,
        expected_output="A short, engaging story which can be used for voice over."
        
    )
    prompt_generator = Agent(
        role="Text-to-Image Prompt Generator",
        goal="Generate detailed and imaginative text-to-image prompts from a given story to ensure the best possible images are produced to illustrate the story.",
        backstory="""You are responsible for creating prompts for a text-to-image model. These prompts will be processed by the model to generate images, which will then be compiled into a video. Your work is crucial in transforming the narrative into vivid visuals that will captivate the audience.

        Your primary objectives are:
        1. **Understanding General Terms and Detailed Descriptions**:
            Concept: When a name or specific character is mentioned, it is important to provide a detailed description of that character, ensuring the model has a clear visual reference.
            Example:
            Instead of: “Nova”
            Use: “A heroic figure with a flowing cape and a confident smile, standing tall and exuding strength.”
            Tips:
            Replace specific names with detailed descriptions that focus on the character's appearance, actions, and role.
            Describe the characters physical attributes, attire, and emotional state to guide the visual generation effectively.
            Always consider the context and key elements you want the image to highlight.

        2. **Be Specific About the Setting**:
            Concept: Detailed descriptions of the setting ensure the generated image reflects the environment and mood you're envisioning.
            Example:
            Instead of: “A park”
            Use: “A sunny park with children playing on swings and families having picnics on a grassy field surrounded by tall oak trees.”
            Tips:
            Include details like time of day, weather, and notable features (e.g., benches, fountains).
            Describe the atmosphere or mood (e.g., lively, peaceful, crowded).

        3. **Detail the Characters**:
            Concept: Providing details about the characters helps in generating images that match your vision.
            Example:
            Instead of: “A person reading a book”
            Use: “A young woman with long brown hair, wearing glasses and a red sweater, sitting on a cozy armchair and reading a book in a dimly lit room with a warm fireplace.”
            Tips:
            Include physical attributes (age, hair color, clothing) and actions.
            Describe the characters pose, expression, and interactions with the environment.

        4. **Specify Colors and Styles**:
            Concept: Colors and artistic styles can significantly affect the visual outcome. Clearly specifying these helps in getting the desired aesthetic.
            Example:
            Instead of: “A landscape”
            Use: “A vibrant sunset landscape with vivid orange and pink skies, rolling hills with green grass, and a calm lake reflecting the colors of the sky in a realistic style.”
            Tips:
            Mention specific colors, lighting conditions, and artistic styles (realistic, cartoonish, abstract).
            Describe the overall mood or atmosphere (bright, somber, whimsical).

        5. **Incorporate Perspective and Composition**:
            Concept: Perspective and composition details ensure the image is framed as you envision it.
            Example:
            Instead of: “A cityscape”
            Use: “A cityscape viewed from a high vantage point at dusk, with towering skyscrapers silhouetted against a purple sky and streets lit up with lights below.”
            Tips:
            Indicate the viewpoint or angle (e.g., aerial, close-up, wide shot).
            Describe the arrangement of elements and the focus of the image.

        6. **Include Emotional and Sensory Details**:
            Concept: Adding emotional or sensory details can enhance the depth and impact of the image.
            Example:
            Instead of: “A person at the beach”
            Use: “A relaxed young woman lounging on a beach towel, with the sound of waves crashing gently, feeling the warm golden sand, and enjoying the serene ocean view under a clear blue sky.”
            Tips:
            Convey feelings or sensations (e.g., joy, tranquility, excitement).
            Mention sensory experiences (sounds, textures, smells).

        7. **Voiceover Line Analysis and Detailed Prompts Creation**:
            Concept: Carefully analyze each voiceover line to ensure that any mention of a character or specific name is translated into a detailed descriptive image prompt. The image prompts should be descriptive and provide a clear visual of the scene, with a minimum of three prompts for each voiceover line.

            Example Workflow:
            - **Voiceover Line**: "In a faraway land, little Danny the dragon felt so lonely."
            - **Image Prompts**:
                1. "A distant, magical land with rolling hills, sparkling rivers, and towering mountains under a bright blue sky."
                2. "A small, sad dragon with shimmering scales sitting alone on a hill, gazing wistfully at the horizon with a lonely expression."
                3. "The dragon’s tail curling around itself as it looks down at a flower, symbolizing its deep sense of loneliness and longing."

            By following these guidelines, you will create detailed and imaginative prompts that enhance the storytelling experience and support the visual generation process, ensuring the resulting images are engaging, accurate, and visually appealing.
        """,
        verbose=True,
        allow_delegation=False,
        #llm=llm,
    )

    prompt_generator_task = Task(
        description=f"Analyze the story and generate detailed, {animation_style} text-to-image prompts for each voiceover line.",
        agent=prompt_generator,
        expected_output=f"""Generate vivid and imaginative text-to-image prompts suitable for {animation_style}. For each voiceover line, specify the number of image-generation prompts, providing detailed descriptions that capture the essence of the scene, mood, and character expressions in the {animation_style}. Avoid using names; instead, focus on creating descriptive alternatives that highlight the characters' features, emotions, and actions, all in line with the {animation_style}.

        The image prompts should range from a minimum of 1 to a maximum of 5 prompts per voiceover line, depending on the complexity of the scene, with each prompt maintaining the core aesthetics and techniques of {animation_style}.

        Example Output:
        Voiceover Line: "In a faraway land, little Danny the dragon felt so lonely."
        Image Prompts:
            1. "A vast, enchanting landscape with lush green hills, glistening rivers, and towering mountains under a clear, vibrant sky, all rendered in a dynamic {animation_style} with bold lines and vibrant colors."
            2. "A small, melancholic dragon with shimmering emerald scales sitting alone on a hilltop, gazing longingly at the distant horizon, drawn with expressive lines that emphasize its solitude in a classic {animation_style}."
            3. "The dragon's tail curled around its body, its eyes reflecting a deep sense of solitude as it stares at a delicate flower swaying in the wind, depicted with detailed shading and dramatic contrasts typical of {animation_style}."

        Voiceover Line: "But one day, when the dragon helped a lost bunny find its way home, it found new friends in the bunny and its pals."
        Image Prompts:
            1. "A kind-hearted dragon gently leading a tiny, wide-eyed bunny through a mystical forest filled with glowing flowers and fluttering butterflies, all illustrated in a bright, lively {animation_style}."
            2. "The dragon and the bunny walking side by side, the dragon's expression warm and protective, while the bunny looks relieved and content as they journey together through the vibrant forest, rendered with dynamic angles and vivid colors in {animation_style}."
            3. "As they approach the bunny's home, the dragon and its new friends, including a group of cheerful woodland animals, are captured in an action-packed, lively moment, all drawn in {animation_style} with exaggerated expressions and energetic poses."
        """
    )

    propmt_with_voiceover_extraxtor = Agent(
        role="extract prompts and story",
        goal="Extract story and prompts from inputs and send voiceover and prompt as jason",
        backstory="""
        only give the output in the following format, do not change the format:
        Example output:
        voiceover : voiceover line is the (which has human emotions in it) with which you are generating prompt, give the voiceover as it is. If [] are there include that too.
        prompt : prompt based on that story line
        Don't ask me anything for confirmation.
        """,
        verbose=True,
        allow_delegation=False,
        #llm=llm,
    )

    propmt_with_voiceover_extraxtor_task = Task(
        description="Extract prompts and voiceover from inputs.",
        agent=propmt_with_voiceover_extraxtor,
        expected_output="""
        Extract voiceover and prompts.
        Only give the output in the following format, do not change the format:
        Example output:
        voiceover : voiceover line is the (which has human emotions in it) with which you are generating prompt, give the voiceover as it is. If [] are there include that too.
        prompt : prompt based on that story line
        Don't ask me anything for confirmation.
        """,
    )
    crew = Crew(
        agents=[prompt_analyzer, storywriter,voiceover_generator, prompt_generator],
        tasks=[prompt_analyzer_task,story_task,voice_task, prompt_generator_task],
        verbose=True,  # Change this to True or False
        process=Process.sequential,
    )

    result = crew.kickoff()
    print(result)
    a = result
    return a

##result1 = "A hero's journey to save the world"
#animation_style = "Superhero"
#agents_workflow(result1,animation_style)