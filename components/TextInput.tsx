type TextInputProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function TextInput({
  label,
  name,
  value,
  placeholder,
  onChange,
}: TextInputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-200">
      <span className="font-medium">{label}</span>
      <input
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-violet-400 dark:focus:ring-violet-900"
      />
    </label>
  );
}
