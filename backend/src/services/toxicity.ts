import { WordTokenizer, PorterStemmer } from 'natural';

export class ToxicityAnalyzer {
  private tokenizer: WordTokenizer;
  private toxicWords: string[];

  constructor() {
    this.tokenizer = new WordTokenizer();
    // Basic list of toxic words (can be expanded)
    this.toxicWords = [
      'hate', 'stupid', 'idiot', 'dumb', 'ugly',
      'kill', 'die', 'loser', 'worthless', 'trash'
    ].map(word => PorterStemmer.stem(word.toLowerCase()));
  }

  async analyze(text: string): Promise<number> {
    try {
      const words = this.tokenizer.tokenize(text) || [];
      const stemmedWords = words.map(word => PorterStemmer.stem(word.toLowerCase()));
      
      let toxicCount = 0;
      stemmedWords.forEach(word => {
        if (this.toxicWords.includes(word)) {
          toxicCount++;
        }
      });

      // Return a score between 0 and 1
      return Math.min(1, toxicCount / words.length);
    } catch (error) {
      console.error('Error analyzing toxicity:', error);
      return 0;
    }
  }
} 