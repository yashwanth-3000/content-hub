# Content Hub: Social Media Post and Video Reel Generator  

Welcome to the **Content Hub** repository! This project provides an intuitive platform to:  
1. Generate creative **social media posts** based on user prompts.  
2. Create engaging **video reels/shorts** with custom gameplay themes in minutes.  

---

## Getting Started  

Follow these steps to set up and run the website locally:  

### Prerequisites  
- **Node.js** installed on your machine.  

### 1. Clone the Repository  
```  
git clone https://github.com/yashwanth-3000/content-hub.git 
cd content-hub
```

### 2. Run the Frontend Website
The frontend is built using **Cursor** and requires **npm** to run.
1. Install dependencies:
   ```
   npm install 
   ```
2. Start the development server:
   ```
   npm run dev 
   ```
 4. Open your browser and go to::
   ```
   http://localhost:3000  
   ```

### 3. Interact with the Website  
The website is fully connected to a **publicly deployed AWS EC2 API endpoint**.  

Type your prompt into the input box, and the platform will generate creative social media posts for platforms like:  
- Twitter  
- LinkedIn  
- Instagram  
- YouTube  

---

## Video Reels/Shorts Generation Platform  
To generate high-quality video reels or shorts:  

1. Visit our dedicated website: [**AI Video Generator**](https://8510-01jd9b14swzjq7de9agtbz2e1t.cloudspaces.litng.ai/)  
2. **How it works**:  
   - Enter a prompt  
   - Select a background gameplay from the available options.  
   - Click **Generate**.  


### ! Note:  
- Video generation takes approximately **3 minutes**.  
- This is significantly faster than traditional manual video editing, which typically takes **3–6 hours**.

or 

- you can run locally by using streamlit-reels dictory and enter your **api keys** then
   ```
   streamlit run app.py
   ```

---

## Challenges We Faced  

Developing and deploying this platform presented some challenges:  

### Frontend Development  
- Built using **Cursor** and designed for seamless user interaction.  

### Backend API Deployment  
- Our backend API, built with **Flask**, is fully deployed on **AWS EC2**, providing 24/7 availability.  

### HTTPS Restriction with Vercel  
- The **EC2 backend** operates on **HTTP**, whereas **Vercel** requires **HTTPS** to communicate with API endpoints.  
- Due to time constraints, we couldn’t resolve this issue fully.  

#### Current Solution  
- The website works perfectly in local environments by connecting to the EC2 backend.  
- For now, we have not deployed the website on Vercel due to this limitation.  

---

Thank you for exploring **Content Hub**! We hope this platform helps you create amazing content effortlessly and efficiently. 