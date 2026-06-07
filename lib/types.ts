export type GameStudioInput = {
  genre: string;
  theme: string;
  audience: string;
};

export interface GameIdea {
  title: string;
  story: string;
  mainCharacter: string;
  coverPrompt: string;
  mechanics: string[];
  enemies: string[];
  boss: string;
  levels: string[];
}

export interface FoundryKnowledge {
  genreConventions: string[];
  recommendedMechanics: string[];
  referenceGames: string[];
  recommendedProgressionSystems: string[];
}

export type GameStudioIdea = {
  title: string;
  story: string;
  mainCharacter: string;
  mechanics: string[];
  enemies: string[];
  bossFight: string;
  levelIdeas: string[];
};
