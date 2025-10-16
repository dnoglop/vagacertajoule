export interface CompatibilityFactor {
  factor: string;
  score: number;
  justification: string;
}

export interface Compatibility {
  totalScore: number;
  feedback: string;
  breakdown: CompatibilityFactor[];
  focusedImprovementSuggestions?: Suggestion[];
}

export interface Skill {
  skill: string;
  importance: string;
}

export interface Suggestion {
  area: string;
  suggestion: string;
}

export interface StarGuide {
  suggestionTitle: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface AnalysisResult {
  compatibility: Compatibility;
  commonSkills: Skill[];
  improvementSuggestions: Suggestion[];
  starMethodGuides: StarGuide[];
}

export interface SavedAnalysis {
  id: string;
  savedAt: string;
  analysisResult: AnalysisResult;
  jobDescription: string;
  resume: string;
}

export interface JobSuggestion {
  title: string;
  company: string;
  url: string;
  platform: string;
}