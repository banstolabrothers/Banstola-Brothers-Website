interface NativeSelectProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const NativeSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  disabled,
}: NativeSelectProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl border bg-white text-sm outline-none transition-colors
          ${error ? "border-red-400 focus:border-red-500 ring-1 ring-red-400" : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"}
          ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "cursor-pointer"}
          ${!value ? "text-gray-400" : "text-gray-900"}`}
      >
        <option value="" disabled>
          {placeholder ?? `Select ${label}`}
        </option>
        {options.map((opt, i) => (
          <option key={`${opt}-${i}`} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    {error && <span className="text-red-500 text-xs mt-0.5">{error}</span>}
  </div>
);

export default NativeSelect;
