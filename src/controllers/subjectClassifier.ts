import { HfInference } from '@huggingface/inference';
import 'dotenv/config';

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

const subjectKeywords: Record<string, string[]> = {
  Physics: ['newton', 'force', 'mass', 'acceleration', 'velocity', 'quantum', 'thermodynamics'],
  Biology: ['photosynthesis', 'cell', 'dna', 'organism', 'evolution', 'biology'],
  Chemistry: ['atom', 'molecule', 'reaction', 'chemical', 'periodic table'],
  Mathematics: ['equation', 'algebra', 'calculus', 'derivative', 'integral', 'geometry'],
  History: ['war', 'history', 'empire', 'century', 'historical'],
  Literature: ['poem', 'novel', 'author', 'literature', 'shakespeare'],
  Computer: ['programming', 'algorithm', 'code', 'computer', 'software'],
};

const subjects = Object.keys(subjectKeywords);

export async function classifySubject(text: string): Promise<string> {
  const lowerText = text.toLowerCase();
  
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return subject;
    }
  }
  
  try {
    const classification = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: [text],
      parameters: { candidate_labels: subjects },
    });
    
    return classification[0]?.labels[0]; 
  } catch (error) {
    console.error('ML classification failed:', error);
    return 'General';
  }
}