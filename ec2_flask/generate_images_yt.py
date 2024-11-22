import requests
import time
from io import BytesIO
from PIL import Image

def generate_image_yt(prompt):
    # Set the API key directly in the code
    api_token = ''

    if not api_token:
        print("Error: API token is not set.")
        return None

    api_url = "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }

    data = {
        "input": {
            "prompt": prompt,
            "aspect_ratio": "16:9",
            "guidance": 3.5
        }
    }

    response = requests.post(api_url, headers=headers, json=data)

    if response.status_code == 201:
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
            # Return the first URL in the output list
            return output_url[0]
        else:
            print("Failed to create prediction.")
            return None
    else:
        print(f"Failed to create prediction. Status code: {response.status_code}, Response: {response.text}")
        return None


# Example usage
#if __name__ == "__main__":
 #   prompt = "A distorted human face with unrealistic features, blurred eyes, mismatched colors, and asymmetrical proportions, resembling early AI-generated images that appear unsettling or unnatural."
  #  image = generate_image(prompt)
  #  
   # if image:
    #    image.show()  # This will display the generated image
