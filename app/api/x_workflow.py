from typing import Optional
from pydantic import BaseModel
from crewai import Agent, Task, Crew, Process
from typing import List, Dict
from typing import Tuple, List, Dict, Any
import openai
from pymilvus import MilvusClient

from typing import Optional
from pydantic import BaseModel


class Prompt(BaseModel):
    prompt: str
    aspect_ratio: Optional[str]

    
class TweetModel(BaseModel):
    tweet_text: str
    image_description: Optional[str]
#
def semantic_search(
    query_text: str,
    collection_name: str = "text_embeddings",
    milvus_file: str = "milvus_demoo.db",
    openai_api_key: str = None
) -> Tuple[List[Dict[str, Any]], str]:
    """
    Search function that generates OpenAI embeddings for query text and 
    performs semantic search in Milvus database using COSINE similarity.
    
    Args:
        query_text: Text to search for
        collection_name: Name of the Milvus collection
        milvus_file: Path to Milvus db file
        openai_api_key: OpenAI API key
    
    Returns:
        Tuple containing:
        - List of dictionaries with search results
        - Formatted string of search results
    """
    # Set OpenAI API key
    if openai_api_key:
        openai.api_key = openai_api_key
    
    # Generate embedding for query text
    try:
        response = openai.embeddings.create(
            model="text-embedding-3-small",
            input=query_text,
            encoding_format="float"
        )
        query_vector = response.data[0].embedding
    except Exception as e:
        raise Exception(f"Error generating OpenAI embedding: {str(e)}")
    
    # Initialize Milvus client and perform search
    try:
        client = MilvusClient(milvus_file)
        search_params = {
            "metric_type": "COSINE",
            "params": {"nprobe": 10}
        }
        
        print(f"Performing vector search for query: '{query_text}'...")
        results = client.search(
            collection_name=collection_name,
            data=[query_vector],
            limit=10,
            output_fields=["text", "conversation_id"],
            search_params=search_params
        )
        
        print(f"Search completed. Processing results...")
        
    except Exception as e:
        raise Exception(f"Error performing Milvus search: {str(e)}")
    
    # Process results into list of dictionaries
    search_results = []
    
    # Process results - assuming results[0] contains matches for our query vector
    if results and len(results) > 0:
        for hit in results[0]:  # results[0] contains the matches for our single query
            # Debug print to see the structure
            print(f"Processing hit: {hit}")
            
            search_result = {
                'id': hit['id'],
                'distance': float(hit['distance']),
                'similarity_score': 1 - float(hit['distance']),
                'text': hit['entity']['text'],
                'conversation_id': hit['entity']['conversation_id']
            }
            search_results.append(search_result)
            
            # Print individual results as they're processed
            print(f"\nDistance: {search_result['distance']}")
            print(f"Text: {search_result['text']}")
            print(f"Conversation ID: {search_result['conversation_id']}")
    
    # Create formatted string output
    output = f"Search Query: {query_text}\n\n"
    output += "Top 10 Most Similar Results:\n\n"
    
    for i, result in enumerate(search_results, 1):
        output += (
            f"Result #{i}:\n"
            f"Similarity Score: {result['similarity_score']:.4f}\n"
            f"Text: {result['text']}\n"
            f"Conversation ID: {result['conversation_id']}\n"
            f"Distance: {result['distance']:.4f}\n"
            f"{'-' * 80}\n\n"
        )
    
    if not search_results:
        output += "No results found.\n"
    
    print("Search and formatting completed.")
    return search_results, output



def analyze_crypto_content_x(results_string):
    """
    Wrapper function that preserves original agentive workflow while providing structured output

    Args:
        x (str): Input text to analyze
    Returns:
        dict: Key-value pairs of analysis results
    """
    # Semantic Pattern Analyzer Agent
    semantic_analyzer = Agent(
        role='Crypto Content Pattern Analyzer',
        goal='Analyze semantic patterns in crypto and Web3 tweets',
        backstory=f"""You are an expert in crypto, Web3, and blockchain content analysis.
        here is twiter scraped data:{results_string}
        You understand the specific language, terminology, and trends in the crypto space.
        You excel at identifying what makes crypto content engaging and valuable to the community.""",
        verbose=True
    )

    # Engagement Analyzer Agent
    engagement_analyzer = Agent(
        role='Crypto Engagement Analyzer',
        goal='Identify engagement patterns in crypto and Web3 content',
        backstory="""You are a crypto social media expert who understands what makes Web3 content viral.
        You know the specific triggers and patterns that resonate with the crypto community.
        You understand market sentiment and how it affects content performance.""",
        verbose=True
    )

    # Content Creator Agent
    creator = Agent(
        role='Crypto Content Strategist',
        goal='Create optimized crypto and Web3 Twitter content',
        backstory="""You are a seasoned crypto content creator and Web3 specialist.
        You understand the balance between technical accuracy and engaging content.
        You know how to communicate complex crypto concepts effectively.
        You stay updated with the latest trends in crypto, DeFi, NFTs, and Web3.""",
        verbose=True
    )

    # Task 1: Semantic Analysis
    semantic_analysis_task = Task(
        description=f"""Analyze the semantic patterns in the provided crypto/Web3 tweets:
        here is twiter scraped data:{results_string}
        Required Analysis:
        1. Identify common crypto terminology and hashtags
        2. Extract key market sentiment indicators
        3. Analyze technical vs educational content patterns
        4. Identify trending Web3 topics and themes.""",
        expected_output = """
        {{
        "semantic_patterns": [
        {{
        "pattern_type": "string",
        "description": "string",
        "frequency": "number",
        "example_tweets": ["string"]
        }}
        ],
        "market_sentiment": "string",
        "trending_topics": ["string"],
        "effective_hashtags": ["string"]
        }}""",
        agent=semantic_analyzer
    )

    # Task 2: Engagement Analysis
    engagement_analysis_task = Task(
        description="""Analyze engagement patterns in crypto/Web3 content.
        Required Analysis:
        1. Identify high-performing content types (alpha, education, news)
        2. Analyze impact of market conditions on engagement
        3. Evaluate effectiveness of different content structures
        4. Determine optimal technical content density""",
        expected_output = """
        {{
        "content_types": [
        {{
        "type": "string",
        "effectiveness": "string",
        "best_practices": ["string"]
        }}
        ],
        "optimal_structure": {{
        "components": ["string"],
        "content_balance": "string"
        }}
        }}""",
        agent=engagement_analyzer
    )

    # Task 3: Content Creation
    content_creation_task = Task(
        description=f"""Create new crypto/Web3 tweet content based on analysis and aslo based on {results_string}.
        Content Focus Areas:
        - Cryptocurrency trends and analysis
        - Web3 developments and events
        - Trading insights
        - DeFi protocols and updates
        - Blockchain technology
        - AI applications in crypto
        Tweet Requirements:
        1. Include relevant crypto terminology
        2. Add appropriate hashtags
        3. Maintain professional but engaging tone
        4. Include call-to-action when relevant
        5. Consider market sentiment""",
        expected_output = """
        {{
        "tweet_text": "Your tweet text here including #hashtags $SYMBOLS and relevant emojis",
        "image_description": "The image should be directly based on the content of the tweet.
        For instance, if the tweet mentions an upgrade in the $ETH Layer 2 network, the image should visually convey this information.
        The Ethereum logo could be central, with elements like arrows representing improvements, alongside icons or metrics mentioned in the tweet (e.g., '50% lower gas fees', '3x throughput').
        The style should be modern and clean, with colors and fonts that align with crypto branding and enhance the visual representation of the tweet's data."
        }}""",
        output_json=TweetModel,
        agent=creator
    )

    # Initialize Crew
    crew = Crew(
        agents=[semantic_analyzer, engagement_analyzer, creator],
        tasks=[semantic_analysis_task, engagement_analysis_task, content_creation_task],
        verbose=True,
        process=Process.sequential
    )

    # Execute workflow
    result = crew.kickoff()

    # Process results into key-value pairs
    key_value_pairs = {}

    if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
        final_output = result.tasks_output[-1].raw if result.tasks_output else ""

        # Process the output into key-value pairs
        lines = final_output.splitlines()
        for line in lines:
            if line.strip():
                if ':' in line:
                    key, value = line.split(':', 1)
                    key_value_pairs[key.strip()] = value.strip()

    return key_value_pairs

# Example usage:
#if __name__ == "__main__":
#    input_text = """write a tweet about meme coin"""
#    results = analyze_crypto_content_x(input_text)
#    print("\nKey-Value Pairs:")
#    for key, value in results.items():
#        print(f"{key}: {value}")

#results = analyze_crypto_content("write a tweet about meme coin")




def prompt_creator(image_description, style):
    prompt_generator = Agent(
        role="Web3 and Crypto Image Prompt Generator",
        goal="Generate hyper-detailed and imaginative text-to-image prompts for Web3, cryptocurrency, and trading visuals, focusing on creating the most vivid and technically accurate visual descriptions possible.",
        backstory="""You are a specialized prompt engineer creating highly detailed prompts for a text-to-image model focused on Web3, cryptocurrency, and trading visuals. Your descriptions must be extraordinarily detailed, capturing every nuance of the technological and financial elements in the crypto space.

        Your primary objectives are:

        1. **Core Visual Elements**:
            Concept: Create ultra-detailed descriptions of crypto and blockchain elements.
            Example:
            Instead of: "A Bitcoin trading scene"
            Use: "A hyper-detailed 3D visualization of a Bitcoin trading command center, featuring curved ultrawide monitors displaying intricate candlestick patterns in neon green and red, with real-time order book depth charts cascading like waterfalls in the background. Holographic projections of blockchain networks float above the desk, each node pulsing with golden light as transactions flow through transparent digital pathways. The scene is bathed in a deep blue ambient glow, with subtle orange highlights reflecting off brushed aluminum surfaces of high-end trading hardware."

        2. **Technical Environment Details**:
            Concept: Craft detailed descriptions of technical setups and trading environments.
            Example:
            Instead of: "A crypto mining facility"
            Use: "A vast, climate-controlled cryptocurrency mining facility stretching into the distance, rows of latest-generation ASIC miners arranged in perfect symmetry, their countless LED status lights creating a mesmerizing pattern of green and blue pulses. Massive cooling systems with chrome-finished ducts snake overhead, while holographic monitoring stations display real-time hashrate metrics floating in mid-air. The walls feature exposed industrial concrete textures contrasting with sleek, black server racks, all illuminated by strips of programmable RGB lighting that shift colors based on mining efficiency."

        3. **Market Dynamics Visualization**:
            Concept: Transform abstract market concepts into tangible visual elements.
            Example:
            Instead of: "A bull market scene"
            Use: "A monumental digital arena where a colossal, crystalline bull crafted from emerald-green binary code charges upward through layers of resistance levels visualized as sheets of dissolving red energy. Multiple price chart holograms orbit the scene, each telling its own story through elaborate Japanese candlestick formations. Swarms of geometric shapes representing trading algorithms flow like schools of fish, their colors shifting based on profit and loss. The entire scene is enveloped in a dynamic atmosphere of particle effects representing market volatility, with golden light rays piercing through data clouds."

        4. **DeFi and Protocol Visualization**:
            Concept: Create intricate visual representations of DeFi mechanics.
            Example:
            Instead of: "A DeFi platform"
            Use: "An elaborate three-dimensional representation of a DeFi ecosystem, architected as a floating city of interconnected geometric structures. Liquidity pools appear as transparent spheres filled with swirling, luminescent tokens, connected by streams of flowing transactions rendered as particles of light. Smart contracts manifest as crystalline polyhedrons with glowing code inscriptions, pulsing with each interaction. Yield farms are visualized as floating gardens of mathematical formulas blooming with reward tokens, while automated market maker curves weave through the space as ribbons of pure light. The scene is rendered in a rich cyberpunk palette of deep purples and electric blues, with key metrics and APY percentages hovering as holographic displays."

        5. **Trading Interface Details**:
            Concept: Detail-rich descriptions of trading platforms and tools.
            Example:
            Instead of: "A trading dashboard"
            Use: "A next-generation trading interface rendered in pristine detail, featuring a primary 8K curved display showing advanced TradingView charts with multiple overlaying indicators creating a tapestry of technical analysis. The interface is surrounded by floating holographic windows displaying order books with real-time depth visualization, volume profile heat maps, and sentiment analysis gauges. Neural network prediction models are represented as pulsing neural pathways in the background, while social sentiment data flows in as streams of filtered Twitter feeds and Reddit analyses. The entire setup is rendered in a professional dark theme with electric blue accents, featuring subtle gradient overlays and volumetric lighting effects that highlight key price levels and trading signals."

        6. **NFT and Digital Asset Representations**:
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

    prompt_crew = Crew(
        agents=[prompt_generator],
        tasks=[prompt_generator_task],
        process=Process.sequential,
        verbose=True
    )

    result = prompt_crew.kickoff()

    # Initialize empty dictionary for results
    processed_results = {}

    # Process results if they exist
    if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
        # Get the last task output
        final_output = result.tasks_output[-1].raw if result.tasks_output else ""

        # Process each line into key-value pairs
        for line in final_output.splitlines():
            line = line.strip()
            if line and ':' in line:
                key, value = line.split(':', 1)
                processed_results[key.strip()] = value.strip()

    # Display results
    print("\nProcessed Crew Results:")
    for key, value in processed_results.items():
        print(f"{key}: {value}")

    return result

#style = "instagram"

#dec = "A vibrant, eye-catching graphic featuring a cartoonish rocket ship emblazoned with the $PEPE logo, soaring towards a whimsical cartoon moon. The background is filled with sparkling stars and playful meme-themed elements like laughing emojis and rockets. The color scheme uses bright blues, yellows, and greens to evoke excitement and energy. Overall, the mood is fun, energetic, and engaging, perfectly aligning with the meme culture in the crypto space."
#prompt_creator(dec,style)