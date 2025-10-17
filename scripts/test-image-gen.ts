#!/usr/bin/env tsx

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config();

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
  console.error('❌ GOOGLE_AI_API_KEY not found in .env');
  process.exit(1);
}

async function testImageGeneration() {
  console.log('🧪 Testing Gemini 2.5 Flash Image...\n');

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

  const prompt = 'Generate an image: a glowing purple cannabis leaf';

  console.log(`📝 Prompt: "${prompt}"\n`);
  console.log('⏳ Generating...\n');

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;

    console.log('📦 Response structure:');
    console.log(JSON.stringify(response, null, 2));

    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      console.error('\n❌ No parts in response');
      return;
    }

    console.log(`\n✅ Received ${parts.length} parts`);

    // Check each part
    parts.forEach((part: any, index: number) => {
      console.log(`\nPart ${index}:`);
      console.log(`  Has text: ${!!part.text}`);
      console.log(`  Has inlineData: ${!!part.inlineData}`);
      
      if (part.text) {
        console.log(`  Text content: ${part.text.substring(0, 100)}...`);
      }
      
      if (part.inlineData) {
        console.log(`  MIME type: ${part.inlineData.mimeType}`);
        console.log(`  Data length: ${part.inlineData.data?.length || 0} bytes`);
        
        // Save the image
        if (part.inlineData.data) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          writeFileSync('test-image.png', buffer);
          console.log('\n  ✅ Image saved to test-image.png!');
        }
      }
    });

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

testImageGeneration();
