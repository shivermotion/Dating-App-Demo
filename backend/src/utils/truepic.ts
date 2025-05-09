import axios from 'axios';

const TRUEPIC_API_KEY = process.env.TRUEPIC_API_KEY!;
const TRUEPIC_API_URL = 'https://api.truepic.com/v1';

interface VerificationResult {
  verified: boolean;
  confidence: number;
  details?: {
    faceDetected: boolean;
    isLive: boolean;
    manipulationDetected: boolean;
  };
}

export async function verifyWithTruepic(file: string): Promise<VerificationResult> {
  try {
    // Convert file to base64 if it's a URL
    const fileData = file.startsWith('http') 
      ? await fetch(file).then(res => res.buffer())
      : Buffer.from(file.split(',')[1], 'base64');

    // Upload to Truepic
    const formData = new FormData();
    formData.append('file', fileData);

    const response = await axios.post(
      `${TRUEPIC_API_URL}/verify`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${TRUEPIC_API_KEY}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    const { verified, confidence, details } = response.data;

    return {
      verified,
      confidence,
      details: {
        faceDetected: details?.face_detected || false,
        isLive: details?.is_live || false,
        manipulationDetected: details?.manipulation_detected || false
      }
    };
  } catch (error) {
    console.error('Error verifying with Truepic:', error);
    return {
      verified: false,
      confidence: 0
    };
  }
} 