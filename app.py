from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import base64
import os
from io import BytesIO
from search_db import semantic_search
from analyze_crypto_content import analyze_crypto_content_x, analyze_crypto_content_insta, analyze_crypto_content_Linkedin
from generate_prompt import prompt_creator, generate_image

app = Flask(__name__)
CORS(app)

print(f"Current working directory: {os.getcwd()}")
print(f"Template folder location: {app.template_folder}")

# Root route to serve index.html
@app.route('/')
def index():
    print("Accessing root route '/'")
    try:
        return render_template('index.html')
    except Exception as e:
        print(f"Error rendering template: {str(e)}")
        return f"Error: {str(e)}", 500

# Route to perform semantic search
@app.route('/search', methods=['POST'])
def search():
    print("\n=== Starting search request ===")
    print("Received POST request to /search")
    
    data = request.json
    query_text = data.get('query_text', '')
    print(f"Received query text: {query_text}")
    
    try:
        print("Attempting semantic search...")
        search_results, output = semantic_search(query_text)
        print(f"Search results: {search_results}")
        print(f"Output: {output}")
        
        results_dict = {
            'search_results': search_results,
            'output': output
        }
        
        return jsonify(results_dict)
    
    except Exception as e:
        print(f"Error occurred during search: {str(e)}")
        return jsonify(error=str(e)), 500

# Helper function to extract text fields
def extract_text_fields(results):
    try:
        if isinstance(results, dict):
            output_text = results.get('output', '')
        elif isinstance(results, tuple) and len(results) == 2:
            output_text = results[1]
        else:
            output_text = str(results)
        
        text_blocks = []
        for line in str(output_text).splitlines():
            if line.startswith("Text:"):
                text_blocks.append(line.replace("Text: ", "").strip())
        return "\n".join(text_blocks)
    except Exception as e:
        print(f"Error in extract_text_fields: {str(e)}")
        return ""

# Route to analyze search results for Twitter/X
@app.route('/analyze', methods=['POST'])
def analyze_search_results_x():
    try:
        data = request.json
        if not data:
            return jsonify(error="No data provided"), 400
            
        search_results = data.get('search_results')
        if not search_results:
            search_results = data
            
        extracted_texts = extract_text_fields(search_results)
        if not extracted_texts:
            return jsonify(error="No text could be extracted from the results"), 400
            
        tweet_text, image_description = analyze_crypto_content_x(extracted_texts)
        print("Tweet Text:", tweet_text)
        print("Image Description:", image_description)
        
        return jsonify({
            'tweet_text': tweet_text,
            'image_description': image_description
        })
        
    except Exception as e:
        print(f"Error in analyze_search_results: {str(e)}")
        return jsonify(error=str(e)), 500

# Route to analyze search results for Instagram
@app.route('/analyze_instagram', methods=['POST'])
def analyze_search_results_instagram():
    try:
        data = request.json
        search_results = data.get('search_results', {})

        extracted_texts = extract_text_fields(search_results)
        
        post_caption, hashtags, image_description = analyze_crypto_content_insta(extracted_texts)

        return jsonify(post_caption=post_caption, hashtags=hashtags, image_description=image_description)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify(error=str(e)), 500
    
# Route to analyze search results for LinkedIn
@app.route('/analyze_Linkedin', methods=['POST'])
def analyze_search_results_linkedin():
    try:
        # Log incoming request
        print("Starting LinkedIn analysis request...")
        
        # Validate incoming data
        data = request.json
        if not data:
            print("Error: No data received in request")
            return jsonify(error="No data provided"), 400
            
        search_results = data.get('search_results')
        if not search_results:
            print("Error: No search results found in request data")
            return jsonify(error="No search results provided"), 400

        # Extract and validate text content
        extracted_texts = extract_text_fields(search_results)
        if not extracted_texts:
            print("Error: No text could be extracted from search results")
            return jsonify(error="No content could be extracted from the results"), 400
        
        # Log the extracted content for debugging
        print(f"Extracted text content: {extracted_texts[:200]}...")  # First 200 chars for logging
        
        # Perform content analysis
        try:
            linkedin_text, image_description = analyze_crypto_content_Linkedin(extracted_texts)
            print("LinkedIn analysis completed successfully")
            print(f"Generated LinkedIn text length: {len(linkedin_text)} characters")
            print(f"Generated image description length: {len(image_description)} characters")
        except Exception as analysis_error:
            print(f"Error during content analysis: {str(analysis_error)}")
            return jsonify(error=f"Content analysis failed: {str(analysis_error)}"), 500

        # Return successful response
        return jsonify({
            'linkedin_text': linkedin_text,
            'image_description': image_description,
            'status': 'success'
        })

    except Exception as e:
        print(f"Unexpected error in LinkedIn analysis: {str(e)}")
        # Include error type in response for better debugging
        error_details = {
            'error': str(e),
            'error_type': type(e).__name__,
            'status': 'error'
        }
        return jsonify(error_details), 500
    
# Route to generate an image from image description
@app.route('/generate-image', methods=['POST'])
def generate_image_from_description():
    try:
        data = request.json
        image_description = data.get('image_description', '')
        style = data.get('style', '')
        
        if not image_description:
            return jsonify(error="No image description provided."), 400
            
        img_prompt = prompt_creator(image_description, style)
        print(f"Image Prompt: {img_prompt}")
        
        if img_prompt:
            image = generate_image(img_prompt)
            image_base64 = base64.b64encode(image.getvalue()).decode('utf-8')
            image_url = f"data:image/png;base64,{image_base64}"
            return jsonify(image_url=image_url)
        else:
            return jsonify(error="Failed to create image prompt."), 500
            
    except Exception as e:
        print(f"Error in generate_image_from_description: {str(e)}")
        return jsonify(error=str(e)), 500

if __name__ == '__main__':  # Fixed the main check
    print("Starting Flask development server...")
    print(f"Templates should be in: {os.path.join(os.getcwd(), 'templates')}")
    app.run(debug=True, port=5001)