// /pages/supabase.tsx
"use client"
// /pages/supabase.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables for security
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const SupabasePage = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to handle data insertion into Supabase
  const insertData = async () => {
    setLoading(true); // Set loading to true while the data is being inserted

    const platform = 'YouTube';
    const title = 'Generated Sunrise Over Mountains'; // Caption
    const description = 'This image represents a beautiful sunrise over the mountains.';
    const base64Image =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wQAAwEB/UBMPQAAAABJRU5ErkJggg=='; // Example base64 image
    const user_name = 'GeneratedAI'; // Optional

    try {
      // Step 1: Validate inputs
      if (!platform || !title || !base64Image) {
        throw new Error('Missing required fields: platform, title, or image data.');
      }

      console.log('Attempting to insert data into Supabase...');

      // Step 2: Insert data into Supabase
      const { data, error: supabaseError } = await supabase
        .from('content_gallery')
        .insert([
          {
            platform,
            caption: title,
            description, // Optional for non-YouTube platforms
            url: base64Image, // Insert the Base64 string directly as URL
            user_name, // Include only if available
          },
        ]);

      // Step 3: Handle Supabase errors if they occur
      if (supabaseError) {
        console.error('Supabase insert error:', supabaseError.message);
        console.error('Error details:', supabaseError.details || 'No additional details');
        console.error('Hint:', supabaseError.hint || 'No hint provided');
        setError(`Supabase error: ${supabaseError.message}`);
        return;
      }

      // Step 4: Handle success
      console.log('Data inserted successfully:', data);
      setResponse(data); // Set the response to display the inserted data
    } catch (err: any) {
      // Step 5: Handle unexpected errors (e.g., network issues)
      console.error('Unexpected error occurred:', err);
      setError(`Unexpected error: ${err.message || err}`);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  useEffect(() => {
    insertData(); // Automatically trigger insertData when the component loads
  }, []);

  return (
    <div>
      <h1>Supabase Data Insertion</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {response ? (
        <div>
          <h2>Data Inserted Successfully:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      ) : (
        !loading && <p>No data inserted yet.</p>
      )}
    </div>
  );
};

export default SupabasePage;
