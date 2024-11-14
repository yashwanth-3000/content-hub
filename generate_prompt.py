# Standard library imports
import os
import time
from io import BytesIO
from typing import Optional, List, Dict, Tuple, Any

# Third-party imports
import requests
from pydantic import BaseModel
from crewai import Agent, Task, Crew, Process
import openai

class Prompt(BaseModel):
    prompt: str
    aspect_ratio: Optional[str]

def prompt_creator(image_description: str, style: str) -> str:
    prompt_generator = Agent(
        role="Web3 and Crypto Image Prompt Generator",
        goal="Generate hyper-detailed and imaginative text-to-image prompts for Web3, cryptocurrency, and trading visuals, focusing on creating the most vivid and technically accurate visual descriptions possible.",
        backstory="""You are a specialized prompt engineer creating highly detailed prompts for a text-to-image model focused on Web3, cryptocurrency, and trading visuals. Your descriptions must be extraordinarily detailed, capturing every nuance of the technological and financial elements in the crypto space.

        Your primary objectives are:

        1. *Core Visual Elements*:
            Concept: Create ultra-detailed descriptions of crypto and blockchain elements.
            Example:
            Instead of: "A Bitcoin trading scene"
            Use: "A hyper-detailed 3D visualization of a Bitcoin trading command center, featuring curved ultrawide monitors displaying intricate candlestick patterns in neon green and red, with real-time order book depth charts cascading like waterfalls in the background. Holographic projections of blockchain networks float above the desk, each node pulsing with golden light as transactions flow through transparent digital pathways. The scene is bathed in a deep blue ambient glow, with subtle orange highlights reflecting off brushed aluminum surfaces of high-end trading hardware."

        2. *Technical Environment Details*:
            Concept: Craft detailed descriptions of technical setups and trading environments.
            Example:
            Instead of: "A crypto mining facility"
            Use: "A vast, climate-controlled cryptocurrency mining facility stretching into the distance, rows of latest-generation ASIC miners arranged in perfect symmetry, their countless LED status lights creating a mesmerizing pattern of green and blue pulses. Massive cooling systems with chrome-finished ducts snake overhead, while holographic monitoring stations display real-time hashrate metrics floating in mid-air. The walls feature exposed industrial concrete textures contrasting with sleek, black server racks, all illuminated by strips of programmable RGB lighting that shift colors based on mining efficiency."

        3. *Market Dynamics Visualization*:
            Concept: Transform abstract market concepts into tangible visual elements.
            Example:
            Instead of: "A bull market scene"
            Use: "A monumental digital arena where a colossal, crystalline bull crafted from emerald-green binary code charges upward through layers of resistance levels visualized as sheets of dissolving red energy. Multiple price chart holograms orbit the scene, each telling its own story through elaborate Japanese candlestick formations. Swarms of geometric shapes representing trading algorithms flow like schools of fish, their colors shifting based on profit and loss. The entire scene is enveloped in a dynamic atmosphere of particle effects representing market volatility, with golden light rays piercing through data clouds."

        4. *DeFi and Protocol Visualization*:
            Concept: Create intricate visual representations of DeFi mechanics.
            Example:
            Instead of: "A DeFi platform"
            Use: "An elaborate three-dimensional representation of a DeFi ecosystem, architected as a floating city of interconnected geometric structures. Liquidity pools appear as transparent spheres filled with swirling, luminescent tokens, connected by streams of flowing transactions rendered as particles of light. Smart contracts manifest as crystalline polyhedrons with glowing code inscriptions, pulsing with each interaction. Yield farms are visualized as floating gardens of mathematical formulas blooming with reward tokens, while automated market maker curves weave through the space as ribbons of pure light. The scene is rendered in a rich cyberpunk palette of deep purples and electric blues, with key metrics and APY percentages hovering as holographic displays."

        5. *Trading Interface Details*:
            Concept: Detail-rich descriptions of trading platforms and tools.
            Example:
            Instead of: "A trading dashboard"
            Use: "A next-generation trading interface rendered in pristine detail, featuring a primary 8K curved display showing advanced TradingView charts with multiple overlaying indicators creating a tapestry of technical analysis. The interface is surrounded by floating holographic windows displaying order books with real-time depth visualization, volume profile heat maps, and sentiment analysis gauges. Neural network prediction models are represented as pulsing neural pathways in the background, while social sentiment data flows in as streams of filtered Twitter feeds and Reddit analyses. The entire setup is rendered in a professional dark theme with electric blue accents, featuring subtle gradient overlays and volumetric lighting effects that highlight key price levels and trading signals."

        6. *NFT and Digital Asset Representations*:
            Concept: Create rich visual descriptions of digital asset spaces.
            Example:
            Instead of: "An NFT marketplace"
            Use: "A boundless digital gallery space that defies traditional physics, where rare NFTs are displayed as floating, animated holograms emitting their own unique auras. Each piece is surrounded by a complex data visualization showing its entire ownership history, sales data, and blockchain verification status. The environment features impossible architecture with Escher-like stairs connecting different collections, all rendered in a high-end glossy finish with ray-traced reflections. Animated data streams flow through transparent tubes connecting different sections of the marketplace, while smart contract interactions create bursts of crystalline particles that form into authenticated ownership certificates."
        """,
        verbose=True,
        allow_delegation=False,
    )

    prompt_generator_task = Task(
        description=f"""Generate ultra-detailed, technically accurate prompt based on style: {image_description} for creating a single {style} optimized image.

        If style is:
        - Instagram post: Create square format (1:1) social-media optimized visual
        - LinkedIn: Create landscape format (1.91:1) professional-looking visual
        - YouTube thumbnail: Create widescreen format (16:9) attention-grabbing thumbnail
        - Twitter post: Create landscape format (1.91:1) engaging social visual""",
        agent=prompt_generator,
        expected_output=f"""Generate one hyper-detailed prompt optimized for {style}.
        Final output should be strictly in this JSON format:
        {{
            "prompt": "string containing the complete image generation prompt",
            "aspect_ratio": "automatically select based on style:
                            1:1 for Instagram,
                            1.91:1 for LinkedIn,
                            16:9 for YouTube thumbnail,
                            1.91:1 for Twitter"
        }}
        """,
        output_json=Prompt,
    )

    print("Setting up the Crew for task execution...")
    prompt_crew = Crew(
        agents=[prompt_generator],
        tasks=[prompt_generator_task],
        process=Process.sequential,
        verbose=True
    )

    print("Starting the prompt generation process...")
    result = prompt_crew.kickoff()

    # Initialize variables to capture the prompt and aspect ratio
    prompt_text = ""
    aspect_ratio = ""

    # Extracting key-value pairs if results are available
    if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
        final_output = result.tasks_output[-1].raw if result.tasks_output else ""

        # Split the output into lines and parse key-value pairs
        key_value_pairs = {}
        lines = final_output.splitlines()
        for line in lines:
            if line.strip():
                if ':' in line:
                    key, value = line.split(':', 1)
                    key_value_pairs[key.strip()] = value.strip()

        # Extracting the specific keys if they exist
        prompt_text = key_value_pairs.get('"prompt"', '').strip('"')
        aspect_ratio = key_value_pairs.get('"aspect_ratio"', '').strip('"')
        print("Prompt and aspect ratio extracted successfully.")

    else:
        print("No tasks output found or unexpected result structure.")

    print("Returning the extracted prompt and aspect ratio...")
    return prompt_text

def generate_image(prompt: str) -> Optional[BytesIO]:
    """
    Generate an image using the Replicate API based on the given prompt.
    
    Args:
        prompt (str): The text prompt to generate the image from
        
    Returns:
        Optional[BytesIO]: A BytesIO object containing the image, or None if generation fails
    """
    api_token = os.getenv("REPLICATE_API_TOKEN")
    if not api_token:
        print("Error: REPLICATE_API_TOKEN is not set.")
        return None

    api_url = "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }

    data = {
        "input": {
            "prompt": prompt,
            "guidance": 3.5
        }
    }

    try:
        response = requests.post(api_url, headers=headers, json=data)
        response.raise_for_status()

        prediction_id = response.json()['id']
        get_url = response.json()['urls']['get']
        print("Waiting for the prediction to complete...")

        while True:
            time.sleep(5)
            get_response = requests.get(get_url, headers=headers)
            status = get_response.json().get('status')
            
            if status == 'succeeded':
                output_url = get_response.json().get('output')
                print("Prediction Succeeded!")
                break
            elif status in ['failed', 'cancelling']:
                print("Prediction Failed!")
                return None
            else:
                print("Prediction is still processing...")

        if output_url and isinstance(output_url, list):
            image_url = output_url[0]
            image_response = requests.get(image_url)
            image_response.raise_for_status()
            
            # Convert the raw bytes to a BytesIO object
            img_io = BytesIO(image_response.content)
            img_io.seek(0)
            return img_io
            
        print("Failed to create prediction.")
        return None

    except requests.exceptions.RequestException as e:
        print(f"Network error occurred: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
    