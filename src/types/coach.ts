export interface Coach {
  id: string;
  name: string;
  bio: {
    en: string;
    de: string;
    sq: string;
  };
  specialty: {
    en: string;
    de: string;
    sq: string;
  };
  image: string;
  greetings: {
    en: string[];
    de: string[];
    sq: string[];
  };
  motivationalPhrases: {
    en: string[];
    de: string[];
    sq: string[];
  };
  tips: {
    en: string[];
    de: string[];
    sq: string[];
  };
}

export interface CoachResponse {
  message: string;
  options?: {
    text: string;
    action: string;
    value?: string;
  }[];
} 