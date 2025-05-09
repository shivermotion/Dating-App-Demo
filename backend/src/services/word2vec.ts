import { WordTokenizer, TfIdf } from 'natural';
import { mean } from 'mathjs';

class Word2Vec {
  private tokenizer: WordTokenizer;
  private tfidf: TfIdf;
  private readonly dimensions = 768;

  constructor() {
    this.tokenizer = new WordTokenizer();
    this.tfidf = new TfIdf();
  }

  private hashString(str: string): number[] {
    let hash = new Array(this.dimensions).fill(0);
    const tokens = this.tokenizer.tokenize(str.toLowerCase());
    
    if (!tokens) return hash;

    tokens.forEach((token, i) => {
      for (let j = 0; j < this.dimensions; j++) {
        // Use a simple but deterministic hashing function
        const code = token.charCodeAt(0) * (i + 1) * (j + 1);
        hash[j] = (hash[j] + code) % 2 - 1; // Normalize to [-1, 1]
      }
    });

    // Normalize the vector
    const magnitude = Math.sqrt(hash.reduce((sum, val) => sum + val * val, 0));
    return hash.map(val => val / (magnitude || 1));
  }

  async textToVector(text: string): Promise<number[]> {
    try {
      // Add the document to TF-IDF
      this.tfidf.addDocument(text);
      
      // Get TF-IDF weights for the document
      const tfidfWeights = new Map<string, number>();
      this.tfidf.listTerms(0).forEach(item => {
        tfidfWeights.set(item.term, item.tfidf);
      });

      // Generate hash vectors for each token and combine them weighted by TF-IDF
      const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
      const vectors = tokens.map(token => {
        const weight = tfidfWeights.get(token) || 1;
        return this.hashString(token).map(val => val * weight);
      });

      // Average all vectors
      return vectors.length > 0 
        ? mean(vectors, 0) as number[]
        : new Array(this.dimensions).fill(0);
    } catch (error) {
      console.error('Error converting text to vector:', error);
      return new Array(this.dimensions).fill(0);
    }
  }
}

export const wordToVec = new Word2Vec(); 