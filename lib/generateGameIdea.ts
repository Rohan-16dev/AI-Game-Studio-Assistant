import { GameStudioIdea, GameStudioInput } from "@/lib/types";

export async function generateGameIdea(input: GameStudioInput): Promise<GameStudioIdea> {
  const { genre, theme, audience } = input;

  // Replace this placeholder logic with a real AI API call when ready.
  return {
    title: `${theme} ${genre} Odyssey`,
    story: `A ${audience} hero must traverse a ${theme} world and uncover the truth behind the ${genre} conflict.`,
    mainCharacter: `The protagonist is a resourceful ${audience.toLowerCase()} adventurer with a personal stake in the ${theme.toLowerCase()} mystery.`,
    mechanics: [
      `Dynamic ${genre.toLowerCase()} progression`,
      `Interactive ${theme.toLowerCase()} environments`,
      `Audience-friendly challenge pacing`,
    ],
    enemies: [
      `${theme} shadow creatures`,
      `Rival ${genre.toLowerCase()} scouts`,
      `Mysterious sentinels guarding the realm`,
    ],
    bossFight: `A climactic battle against a corrupted ${theme} overlord who tests all of the player’s skills and the game’s core mechanics.`,
    levelIdeas: [
      `A tutorial city level introducing the ${genre} systems`,
      `A stealthy mission through ${theme.toLowerCase()} ruins`,
      `A final arena built around the boss’s unique powers`,
    ],
  };
}
