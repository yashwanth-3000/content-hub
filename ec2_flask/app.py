from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from generate_images import generate_image
from generate_images_yt import generate_image_yt
from instagram_workflow import analyze_crypto_content_insta
from linkedin_workflow import analyze_crypto_content_Linkedin
from twitter_workflow import generate_single_tweet
from youtube_workflow import generate_youtube_content
from twitter_threads import generate_twitter_thread
from io import BytesIO

app = Flask(__name__)

# Allow access from anywhere
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/')
def home():
    """
    Default route to check API status.
    """
    return jsonify({"message": "API is working"}), 200

@app.route('/youtube', methods=['POST'])
def youtube():
    """
    API endpoint to generate YouTube content based on input text.
    """
    try:
        data = request.get_json()
        input_text = data.get('input_text')

        if not input_text:
            return jsonify({"error": "Missing 'input_text' in request"}), 400

        # Generate YouTube content
        title, description, thumbnail = generate_youtube_content(input_text)

        return jsonify({
            "title": title,
            "description": description,
            "thumbnail": thumbnail
        }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/twitter', methods=['POST'])
def twitter():
    data = request.get_json()

    # Extract the input text from the request
    input_text = data.get("input_text", "")

    if not input_text:
        return jsonify({"error": "Input text is required"}), 400

    try:
        # Call the generate_single_tweet function to generate the tweet and image description
        tweet_text, image_description = generate_single_tweet(input_text)

        if tweet_text and image_description:
            return jsonify({
                "tweet_text": tweet_text,
                "image_description": image_description
            })
        else:
            return jsonify({"error": "Failed to generate tweet"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/linkedin', methods=['POST'])
def linkedin():
    """
    API endpoint to generate LinkedIn content based on input text.
    """
    try:
        data = request.get_json()
        input_text = data.get("input_text", "")

        if not input_text:
            return jsonify({"error": "Input text is required"}), 400

        # Call the LinkedIn workflow to generate post and image description
        linkedin_text, image_description = analyze_crypto_content_Linkedin(input_text)

        if linkedin_text:
            return jsonify({
                "linkedin_text": linkedin_text,
                "image_description": image_description
            }), 200
        else:
            return jsonify({"error": "Failed to generate LinkedIn content"}), 500

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/instagram', methods=['POST'])
def instagram():
    try:
        data = request.get_json()
        input_text = data.get('input_text', '')

        if not input_text:
            return jsonify({"error": "Input text is required"}), 400

        post_caption, image_description = analyze_crypto_content_insta(input_text)
        return jsonify({
            "post_caption": post_caption,
            "image_description": image_description
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
       

@app.route('/twitter-thread', methods=['POST'])
def twitter_thread():
    """
    API endpoint to generate a Twitter thread based on input text.
    """
    try:
        # Get the input text for the Twitter thread prompt
        data = request.get_json()
        input_text = data.get('input_text')

        if not input_text:
            return jsonify({"error": "Missing 'input_text' in request"}), 400

        # Generate Twitter thread using the input text
        tweet_text_1, image_description_1, tweet_text_2, image_description_2, tweet_text_3, image_description_3, \
        tweet_text_4, image_description_4, tweet_text_5, image_description_5, tweet_text_6, image_description_6, \
        tweet_text_7, image_description_7 = generate_twitter_thread(input_text)

        # Return the generated Twitter thread and image descriptions as a response
        return jsonify({
            "tweet_text_1": tweet_text_1,
            "image_description_1": image_description_1,
            "tweet_text_2": tweet_text_2,
            "image_description_2": image_description_2,
            "tweet_text_3": tweet_text_3,
            "image_description_3": image_description_3,
            "tweet_text_4": tweet_text_4,
            "image_description_4": image_description_4,
            "tweet_text_5": tweet_text_5,
            "image_description_5": image_description_5,
            "tweet_text_6": tweet_text_6,
            "image_description_6": image_description_6,
            "tweet_text_7": tweet_text_7,
            "image_description_7": image_description_7
        }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    

@app.route('/generate_image', methods=['POST'])
def generate_image_route():
    """
    API endpoint to generate an image URL based on input prompt.
    """
    try:
        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({"error": "Missing 'prompt' in request"}), 400

        # Generate image URL using the generate_image_url function
        image_url = generate_image(prompt)

        if image_url:
            # Return the generated image URL as a JSON response
            return jsonify({"image_url": image_url}), 200

        return jsonify({"error": "Image generation failed"}), 500

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/generate_image_yt', methods=['POST'])
def generate_image_yt_route():
    """
    API endpoint to generate an image URL based on input prompt.
    """
    try:
        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({"error": "Missing 'prompt' in request"}), 400

        # Generate image URL using the generate_image_url function
        image_url = generate_image_yt(prompt)

        if image_url:
            # Return the generated image URL as a JSON response
            return jsonify({"image_url": image_url}), 200

        return jsonify({"error": "Image generation failed"}), 500

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
