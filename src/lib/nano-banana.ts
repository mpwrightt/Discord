import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper function for easy image generation using Gemini 2.5 Flash Image (Nano Banana)
export async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_AI_API_KEY not found');
      return null;
    }

    // Use Gemini 2.5 Flash Image (Nano Banana) for image generation
    const client = new NanaBananaClient(apiKey);
    return await client.generateImage(prompt, true);
  } catch (error: any) {
    console.error('Generate image error:', error);
    return null;
  }
}

export class NanaBananaClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use Gemini 2.5 Flash Image for image generation (Nano Banana)
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image'
    });
  }

  async generateImage(prompt: string, cannabisThemed = true): Promise<Buffer> {
    try {
      const fullPrompt = cannabisThemed 
        ? `Generate a cannabis-themed image: ${prompt}. Cannabis leaves, buds, artistic, vibrant colors, high quality.`
        : `Generate an image: ${prompt}`;

      const result = await this.model.generateContent(fullPrompt);

      const response = result.response;
      
      // Gemini 2.5 Flash Image returns images in parts
      const parts = response.candidates?.[0]?.content?.parts;
      
      if (!parts || parts.length === 0) {
        console.error('API Response:', JSON.stringify(response, null, 2));
        throw new Error('No content parts returned from API');
      }

      // Find the first part with image data
      const imagePart = parts.find((part: any) => part.inlineData?.data);
      
      if (!imagePart || !imagePart.inlineData?.data) {
        console.error('Parts received:', parts);
        throw new Error('No image data in response. The model may have returned text instead of an image.');
      }

      return Buffer.from(imagePart.inlineData.data, 'base64');
    } catch (error: any) {
      console.error('Nano Banana Image Generation Error:', error.message);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  async editImage(
    imageBuffer: Buffer,
    editPrompt: string,
    conversationHistory: any[] = []
  ): Promise<Buffer> {
    try {
      const contents = [
        ...conversationHistory,
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBuffer.toString('base64')
              }
            },
            { text: editPrompt }
          ]
        }
      ];

      const result = await this.model.generateContent({ contents });
      const response = result.response;
      const imageData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!imageData) {
        throw new Error('No edited image data returned');
      }

      return Buffer.from(imageData, 'base64');
    } catch (error: any) {
      console.error('Nano Banana Image Edit Error:', error.message);
      throw new Error(`Image editing failed: ${error.message}`);
    }
  }

  async blendImages(imageBuffers: Buffer[], blendPrompt: string): Promise<Buffer> {
    try {
      const parts: Array<{ inlineData: { mimeType: string; data: string } } | { text: string }> = imageBuffers.map(buffer => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: buffer.toString('base64')
        }
      }));

      parts.push({ text: `Blend these images: ${blendPrompt}` });

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts }]
      });

      const response = result.response;
      const imageData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!imageData) {
        throw new Error('No blended image data returned');
      }

      return Buffer.from(imageData, 'base64');
    } catch (error: any) {
      console.error('Nano Banana Image Blend Error:', error.message);
      throw new Error(`Image blending failed: ${error.message}`);
    }
  }
}
