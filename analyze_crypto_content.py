from typing import Optional
from pydantic import BaseModel
from crewai import Agent, Task, Crew, Process
from typing import List, Dict
from typing import Tuple, List, Dict, Any
import openai
import os

from typing import Optional
from pydantic import BaseModel

api_key = os.getenv("OPENAI_API_KEY")
print("api key is: "+api_key)

class TweetModel(BaseModel):
    tweet_text: str
    image_description: Optional[str]

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

   # Extract tweet_text and image_description
    tweet_text = ""
    image_description = ""

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
# Example usage:
#if _name_ == "_main_":
#    input_text = """write a tweet about meme coin"""
#    results = analyze_crypto_content_x(input_text)
#    print("\nKey-Value Pairs:")
#    for key, value in results.items():
#        print(f"{key}: {value}")

#results = analyze_crypto_content("write a tweet about meme coin")



class InstagramModel(BaseModel):
    post_caption: str
    hashtags: str
    image_description: Optional[str]

def analyze_crypto_content_insta(results_string):
    """
    Wrapper function that converts Twitter content to Instagram format while preserving original workflow

    Args:
        twitter_data (str): Input Twitter content to analyze and convert
    Returns:
        dict: Key-value pairs of analysis results
    """
    # Semantic Pattern Analyzer Agent
    semantic_analyzer = Agent(
        role='Twitter-to-Instagram Content Analyzer',
        goal='Convert Twitter crypto patterns to Instagram format',
        backstory=f"""You are an expert in adapting crypto and Web3 content from Twitter to Instagram.
        Here is Twitter data to analyze: {results_string}
        You understand how to translate Twitter's concise language into engaging Instagram content.
        You excel at identifying key points that can be transformed into a compelling single post.
        You know how to maintain the core message while making it visually appealing for Instagram.""",
        verbose=True
    )

    # Engagement Analyzer Agent
    engagement_analyzer = Agent(
        role='Platform Adaptation Analyzer',
        goal='Transform Twitter engagement patterns to Instagram format',
        backstory="""You are a cross-platform social media expert who understands how to adapt
        crypto content from Twitter to Instagram's visual-first environment.
        You know how to expand tweet content into engaging Instagram captions.
        You understand Instagram's best practices for crypto content, including
        the balance of educational value and visual appeal.
        You excel at creating content that encourages likes and comments.""",
        verbose=True
    )

    # Content Creator Agent
    creator = Agent(
        role='Twitter-to-Instagram Content Strategist',
        goal='Transform Twitter crypto content into Instagram posts',
        backstory="""You are a specialist in adapting crypto content for Instagram.
        You excel at creating eye-catching single post concepts.
        You know how to write captions that drive engagement while respecting Instagram's character limits.
        You understand how to optimize content for maximum reach using Instagram's algorithm.
        You're skilled at crafting strategic hashtag sets and creating attention-grabbing visuals.""",
        verbose=True
    )

    # Task 1: Twitter Content Analysis
    semantic_analysis_task = Task(
        description=f"""Analyze the Twitter crypto content for Instagram conversion:
        Twitter Data: {results_string}
        Required Analysis:
        1. Extract key message for the post
        2. Identify core sentiment and tone
        3. Catalog technical terms for simplified explanation
        4. Note engagement triggers for caption""",
        expected_output = """
        {{
        "twitter_elements": [
        {{
        "key_message": "string",
        "core_sentiment": "string",
        "technical_terms": ["string"],
        "engagement_hooks": ["string"]
        }}
        ],
        "sentiment": "string",
        "main_topic": "string"
        }}""",
        agent=semantic_analyzer
    )

    # Task 2: Visual Analysis
    engagement_analysis_task = Task(
        description="""Plan the Twitter-to-Instagram content adaptation.
        Required Analysis:
        1. Design single image concept
        2. Plan caption structure
        3. Determine engagement elements
        4. Identify key visual elements""",
        expected_output = """
        {{
        "content_plan": {{
        "visual_concept": "string",
        "caption_elements": ["string"],
        "engagement_triggers": ["string"]
        }}
        }}""",
        agent=engagement_analyzer
    )

    # Task 3: Instagram Content Creation
    content_creation_task = Task(
        description=f"""Convert Twitter crypto content into Instagram format.
        Conversion Requirements:
        1. Create engaging image concept
        2. Write compelling caption with line breaks
        3. Curate strategic hashtag set
        4. Include call-to-action

        Original Twitter Content:
        {results_string}""",
        expected_output = """
        {{
        "post_caption": "Attention-grabbing Instagram caption with proper spacing and emojis

        🔑 Key Point

        💡 Main Insight

        💬 Share your thoughts below!",

        "hashtags": "Curated set of relevant hashtags:
        #CryptoEducation #BlockchainTechnology #CryptoTrading #Web3
        #CryptoInvestor #CryptoNews #CryptoTips #CryptoCommunity",

        "image_description": "Detailed description of visual elements including:
        - Main visual concept
        - Color scheme and branding
        - Key elements to include
        - Overall mood and style"
        }}""",
        output_json=InstagramModel,
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

    post_caption = ""
    hashtags = ""
    image_description = None

    if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
        final_output = result.tasks_output[-1].raw if result.tasks_output else ""

        # Extract specific fields
        for line in final_output.splitlines():
            if "post_caption" in line:
                post_caption = line.split(":", 1)[1].strip()
            elif "hashtags" in line:
                hashtags = line.split(":", 1)[1].strip()
            elif "image_description" in line:
                image_description = line.split(":", 1)[1].strip()

    return post_caption, hashtags, image_description

# Example usage:
#if __name__ == "__main__":
#    twitter_input = """🚀 Just aped into $PEPE! This meme coin is going to the moon!
#    💎🙌 #cryptotwitter #memeszn"""
#
#    results = analyze_crypto_content(twitter_input)
#    print("\nTwitter to Instagram Conversion Results:")
#    for key, value in results.items():
 #       print(f"{key}: {value}")




api_key = os.getenv("OPENAI_API_KEY")
print("api key is: "+api_key)

class LinkedinModel(BaseModel):
    linkedin_text: str
    image_description: Optional[str]

def analyze_crypto_content_Linkedin(results_string):
    """
    Wrapper function that converts Twitter content to LinkedIn format while preserving original workflow

    Args:
        twitter_data (str): Input Twitter content to analyze and convert
    Returns:
        dict: Key-value pairs of analysis results
    """
    # Semantic Pattern Analyzer Agent
    semantic_analyzer = Agent(
        role='Twitter-to-LinkedIn Content Analyzer',
        goal='Convert Twitter crypto patterns to LinkedIn format',
        backstory=f"""You are an expert in adapting crypto and Web3 content from Twitter to LinkedIn.
        Here is Twitter data to analyze: {results_string}
        You understand how to translate Twitter's concise language into LinkedIn's professional tone.
        You excel at expanding Twitter's brief points into detailed professional insights.""",
        verbose=True
    )

    # Engagement Analyzer Agent
    engagement_analyzer = Agent(
        role='Platform Adaptation Analyzer',
        goal='Transform Twitter engagement patterns to LinkedIn format',
        backstory="""You are a cross-platform social media expert who understands how to adapt
        crypto content from Twitter to LinkedIn's professional environment.
        You know how to expand tweet threads into comprehensive LinkedIn posts.
        You understand how to maintain the core message while adapting to LinkedIn's tone.""",
        verbose=True
    )

    # Content Creator Agent
    creator = Agent(
        role='Twitter-to-LinkedIn Content Strategist',
        goal='Transform Twitter crypto content into LinkedIn posts',
        backstory="""You are a specialist in adapting crypto content across platforms.
        You excel at expanding Twitter's brevity into LinkedIn's detailed format.
        You know how to maintain technical accuracy while adding professional context.
        You understand how to translate Twitter's casual tone into LinkedIn's professional voice.""",
        verbose=True
    )

    # Task 1: Twitter Content Analysis
    semantic_analysis_task = Task(
        description=f"""Analyze the Twitter crypto content for conversion:
        Twitter Data: {results_string}
        Required Analysis:
        1. Extract key points from tweets
        2. Identify core message and market sentiment
        3. Catalog technical terms and hashtags
        4. Note engagement triggers for adaptation""",
        expected_output = """
        {{
        "twitter_elements": [
        {{
        "key_points": ["string"],
        "core_message": "string",
        "technical_terms": ["string"],
        "hashtags": ["string"]
        }}
        ],
        "sentiment": "string",
        "main_topics": ["string"]
        }}""",
        agent=semantic_analyzer
    )

    # Task 2: Platform Adaptation Analysis
    engagement_analysis_task = Task(
        description="""Plan the Twitter-to-LinkedIn content adaptation.
        Required Analysis:
        1. Identify points needing expansion
        2. Plan professional context additions
        3. Determine business angle for content
        4. Structure long-form conversion strategy""",
        expected_output = """
        {{
        "expansion_points": [
        {{
        "twitter_point": "string",
        "linkedin_expansion": "string",
        "context_needed": "string"
        }}
        ],
        "structure_plan": {{
        "opening": "string",
        "body_points": ["string"],
        "conclusion": "string"
        }}
        }}""",
        agent=engagement_analyzer
    )

    # Task 3: LinkedIn Content Creation
    content_creation_task = Task(
        description=f"""Convert Twitter crypto content into LinkedIn format.
        Conversion Requirements:
        1. Expand tweet content into professional paragraphs
        2. Add business context and implications
        3. Transform casual language to professional tone
        4. Maintain technical accuracy while adding depth
        5. Adapt hashtags for LinkedIn audience

        Original Twitter Content:
        {results_string}""",
        expected_output = """
        {{
        "linkedin_text": "Your LinkedIn post text here including #hashtags $SYMBOLS and relevant professional context
        Your LinkedIn post text here including #hashtags $SYMBOLS and relevant professional contex
        The output should include:

        - **headline**: A concise and compelling statement that captures the essence of the post.
        - **opening_hook**: An engaging sentence or two that draws readers in and highlights the importance of the topic.
        - **main_content**: The core message of the post, elaborating on the topic with key points, insights, and examples that provide value to the audience.
        - **professional_context**: Contextual information that relates the topic to industry trends, challenges, or opportunities relevant to your audience.
        - **call_to_action**: A clear and motivating invitation for readers to engage, whether by commenting, sharing their thoughts, or taking a specific action.
        - **hashtags**: Relevant hashtags that enhance discoverability and align with the content, e.g., #Blockchain #Innovation #Enterprise.",

        "image_description": "The image should be directly based on the content of the LinkedIn post and maintain professional aesthetics.
        For instance, if the post discusses blockchain enterprise adoption, the image should use corporate-appropriate visuals and infographics.
        The style should be professional and clean, with business-appropriate colors and fonts that enhance the visual representation of the data and maintain LinkedIn's professional standards."
        }}""",
        output_json=LinkedinModel,
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

    linkedin_text = ""
    image_description = ""

    if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
        final_output = result.tasks_output[-1].raw if result.tasks_output else ""

        # Extract linkedin_text and image_description correctly
        key_value_pairs = {}
        lines = final_output.splitlines()
        for line in lines:
            # Only process lines with a colon to avoid empty lines or malformed entries
            if ':' in line:
                key, value = line.split(':', 1)
                # Strip quotation marks and whitespace
                clean_key = key.strip().strip('"')
                clean_value = value.strip().strip('"')
                key_value_pairs[clean_key] = clean_value

        linkedin_text = key_value_pairs.get("linkedin_text", "No LinkedIn text found.")
        image_description = key_value_pairs.get("image_description", "No image description found.")

    return linkedin_text, image_description


# Example usage:
#if __name__ == "__main__":
#    twitter_input = """🚀 Just aped into $PEPE! This meme coin is going to the moon!
#    💎🙌 #cryptotwitter #memeszn"""
#
#    results = analyze_crypto_content(twitter_input)
#    print("\nTwitter to LinkedIn Conversion Results:")
#    for key, value in results.items():
#       print(f"{key}: {value}")


class YouTubeContentModel(BaseModel):
    youtube_title: str
    youtube_description: str
    thumbnail_image_description: str

def generate_youtube_content(input_text):
    """
    Generates optimized YouTube content including title, description, and thumbnail image description.

    Args:
        input_text (str): The topic or theme to be used as the basis for the YouTube content.
    Returns:
        dict: A dictionary containing the generated YouTube title, description, and thumbnail image description.
    """
    # YouTube Content Strategy Task
    yt_content_strategy_task = Task(
        description=f"""Create an engaging, SEO-friendly YouTube title and description based on the input topic: {input_text}.
        Content Requirements:
        1. Craft a catchy, SEO-friendly YouTube title
        2. Write a compelling YouTube description that drives clicks""",
        expected_output="""
        {{
        "youtube_title": "Your YouTube title here",
        "youtube_description": "Your YouTube description here"
        }}""",
        output_json=YouTubeContentModel,
        agent=Agent(
            role='YouTube Content Strategist',
            goal='Create engaging, optimized YouTube titles and descriptions',
            backstory="""You are an expert in YouTube content optimization. 
            You deeply understand YouTube's algorithm and what makes titles and descriptions successful.
            Your goal is to craft catchy, SEO-friendly titles and compelling descriptions that drive clicks and views.""",
            verbose=True
        )
    )

    # Thumbnail Design Task
    thumbnail_design_task = Task(
        description=f"""Design a visually appealing, thumb-stopping YouTube thumbnail image that aligns with the input topic: {input_text}.
        Content Requirements:
        1. Create a thumbnail that is eye-catching and relevant to the video content
        2. Use colors, fonts, imagery, and composition that align with current trends and best practices""",
        expected_output="""
        {{
        "thumbnail_image_description": "Description of the designed YouTube thumbnail image here"
        }}""",
        output_json=YouTubeContentModel,
        agent=Agent(
            role='YouTube Thumbnail Designer',
            goal='Create visually appealing, thumb-stopping YouTube thumbnails',
            backstory="""You are a professional graphic designer specializing in YouTube thumbnail creation.
            You understand the psychology of thumbnail design and what makes people click.
            Your goal is to design thumbnails that are eye-catching, relevant to the video content, and aligned with current trends.""",
            verbose=True
        )
    )

    # Initialize Crew
    crew = Crew(
        agents=[],
        tasks=[yt_content_strategy_task, thumbnail_design_task],
        verbose=True,
        process=Process.sequential
    )

    # Execute workflow
    result = crew.kickoff()

     # Initialize empty dictionary for results
    thread_content = {}
    thread_content["youtube_title"] = ""
    thread_content["youtube_description"] = ""
    thread_content["thumbnail_image_description"] = ""

    if hasattr(result, 'tasks_output') and isinstance(result.tasks_output, list):
        for task_output in result.tasks_output:
            if task_output.raw:
                key_value_pairs = {}
                lines = task_output.raw.splitlines()
                for line in lines:
                    if line.strip():
                        if ':' in line:
                            key, value = line.split(':', 1)
                            key = key.strip().strip('"')
                            value = value.strip().strip('"')
                            if key in thread_content:
                                thread_content[key] = value

    return thread_content


if __name__ == "__main__":
    input_text = "How to start investing for beginners"
    result = generate_youtube_content(input_text)
    print(f"YouTube Title: {result['youtube_title']}")
    print(f"YouTube Description: {result['youtube_description']}")
    print(f"Thumbnail Image Description: {result['thumbnail_image_description']}")