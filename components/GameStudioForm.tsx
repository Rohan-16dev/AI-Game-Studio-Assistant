import { useState } from "react";
import { GameStudioInput } from "@/lib/types";
import TextInput from "@/components/TextInput";

type GameStudioFormProps = {
  initialValues?: GameStudioInput;
  onSubmit: (input: GameStudioInput) => Promise<void>;
  isLoading: boolean;
};

export default function GameStudioForm({
  initialValues = { genre: "", theme: "", audience: "" },
  onSubmit,
  isLoading,
}: GameStudioFormProps) {
  const [genre, setGenre] = useState(initialValues.genre);
  const [theme, setTheme] = useState(initialValues.theme);
  const [audience, setAudience] = useState(initialValues.audience);

  return (
    <form
      className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/10"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({ genre, theme, audience });
      }}
    >
      <div className="space-y-4">
        <TextInput
          label="Game genre"
          name="genre"
          value={genre}
          placeholder="e.g. action RPG"
          onChange={setGenre}
        />
        <TextInput
          label="Game theme"
          name="theme"
          value={theme}
          placeholder="e.g. cyberpunk city"
          onChange={setTheme}
        />
        <TextInput
          label="Target audience"
          name="audience"
          value={audience}
          placeholder="e.g. teen players"
          onChange={setAudience}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isLoading ? "Generating idea…" : "Generate game concept"}
      </button>
    </form>
  );
}
