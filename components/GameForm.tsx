"use client";

import { useState } from "react";

type GameFormValues = {
  genre: string;
  theme: string;
  audience: string;
};

type GameFormProps = {
  onSubmit: (values: GameFormValues) => void;
  initialValues?: GameFormValues;
  isLoading?: boolean;
};

const genreOptions = [
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Puzzle",
  "Simulation",
];

const audienceOptions = [
  "Kids",
  "Teens",
  "Adults",
  "Everyone",
];

export default function GameForm({
  onSubmit,
  initialValues = { genre: "Action", theme: "", audience: "Everyone" },
  isLoading = false,
}: GameFormProps) {
  const [values, setValues] = useState<GameFormValues>(initialValues);

  function handleChange(field: keyof GameFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Genre
          <select
            value={values.genre}
            onChange={(event) => handleChange("genre", event.target.value)}
            className="mt-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-400 dark:focus:ring-violet-900"
          >
            {genreOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Audience
          <select
            value={values.audience}
            onChange={(event) => handleChange("audience", event.target.value)}
            className="mt-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-400 dark:focus:ring-violet-900"
          >
            {audienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-200">
        <label htmlFor="theme">Theme</label>
        <input
          id="theme"
          type="text"
          value={values.theme}
          onChange={(event) => handleChange("theme", event.target.value)}
          placeholder="Enter a theme like cyberpunk or mystical forest"
          className="mt-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-400 dark:focus:ring-violet-900"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isLoading ? "Generating…" : "Generate"}
      </button>
    </form>
  );
}
