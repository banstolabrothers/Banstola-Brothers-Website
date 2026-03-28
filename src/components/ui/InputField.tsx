"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { ChevronDown, Search } from "lucide-react";

// ─── InputField Types ────────────────────────────────────────────────────────

type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea";

interface InputFieldProps {
  label: string;
  name: string;
  type?: InputType;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  optional?: boolean;
  maxLength?: number;
  rows?: number;
  prefix?: string;
  className?: string;
}

// ─── InputField Component ─────────────────────────────────────────────────────

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  optional = false,
  maxLength,
  rows,
  prefix,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    onChange(e);
    setIsFilled(e.target.value.length > 0);
  };

  const baseInputClasses =
    "w-full px-4 py-3 border-2 text-center md:text-left rounded-2xl focus:outline-none transition-all duration-200";

  const getInputClasses = (): string => {
    if (error) return `${baseInputClasses} border-red-500 bg-red-50`;
    if (isFocused)
      return `${baseInputClasses} border-brand-900 bg-white shadow-sm`;
    if (isFilled) return `${baseInputClasses} border-neutral-300 bg-white`;
    if (disabled)
      return `${baseInputClasses} border-neutral-200 bg-gray-50 text-neutral-400 cursor-not-allowed`;
    return `${baseInputClasses} border-neutral-200 hover:border-neutral-300`;
  };

  const sharedProps = {
    name,
    value,
    onChange: handleChange,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    placeholder,
    className: getInputClasses(),
    required,
    disabled,
    maxLength,
  };

  const renderInput = (): React.ReactNode => {
    if (type === "textarea") {
      return <textarea {...sharedProps} rows={rows} />;
    }
    return <input type={type} {...sharedProps} />;
  };

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <label className="w-full text-brand-900">
        {label} {optional && <span className="text-gray-400">(Optional)</span>}
      </label>

      {prefix ? (
        <div className="flex gap-2">
          <div className="flex items-center px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-gray-50">
            <span className="text-brand-900">
              <label>{prefix}</label>
            </span>
          </div>
          <label className="flex-1">{renderInput()}</label>
        </div>
      ) : (
        <label>{renderInput()}</label>
      )}

      {error && (
        <span className="text-red-500 text-sm animate-shake">{error}</span>
      )}
    </div>
  );
};

// ─── SelectField Types ────────────────────────────────────────────────────────

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

// ─── SelectField Component ────────────────────────────────────────────────────

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onChange(e);
    setIsFilled(e.target.value.length > 0);
  };

  const baseSelectClasses =
    "w-full px-4 py-3 border-2 text-center md:text-left rounded-2xl focus:outline-none transition-all duration-200 appearance-none";

  const getSelectClasses = (): string => {
    if (error) return `${baseSelectClasses} border-red-500 bg-red-50`;
    if (isFocused)
      return `${baseSelectClasses} border-brand-900 bg-white shadow-sm`;
    if (isFilled) return `${baseSelectClasses} border-neutral-300 bg-white`;
    return `${baseSelectClasses} border-neutral-200 hover:border-neutral-300`;
  };

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <h6 className="font-HRegular w-full text-brand-900">{label}</h6>
      <div className="relative">
        <label>
          <select
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={getSelectClasses()}
            required={required}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <span className="text-red-500 text-sm animate-shake">{error}</span>
      )}
    </div>
  );
};

// ─── ComboSelectField Types ───────────────────────────────────────────────────

interface ComboSelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options: string[];
  error?: string;
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// ─── ComboSelectField Component ───────────────────────────────────────────────

export const ComboSelectField: React.FC<ComboSelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  optional = false,
  placeholder = "Search or select…",
  disabled = false,
  className = "",
}) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase()),
  );

  // Sync external value → input display
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        if (!options.includes(query)) setQuery(value);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, value, options]);

  const handleSelect = (option: string) => {
    setQuery(option);
    setOpen(false);
    onChange({
      target: { name, value: option },
    } as ChangeEvent<HTMLSelectElement>);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    if (!options.includes(e.target.value)) {
      onChange({
        target: { name, value: "" },
      } as ChangeEvent<HTMLSelectElement>);
    }
  };

  const isFilled = !!value;

  const baseClasses =
    "w-full px-4 py-3 border-2 text-center md:text-left rounded-2xl focus:outline-none transition-all duration-200 pr-10";

  const getClasses = (): string => {
    if (error) return `${baseClasses} border-red-500 bg-red-50`;
    if (open) return `${baseClasses} border-brand-900 bg-white shadow-sm`;
    if (isFilled) return `${baseClasses} border-neutral-300 bg-white`;
    if (disabled)
      return `${baseClasses} border-neutral-200 bg-gray-50 text-neutral-400 cursor-not-allowed`;
    return `${baseClasses} border-neutral-200 hover:border-neutral-300`;
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col gap-2 ${className}`}
    >
      <label className="w-full text-brand-900">
        {label} {optional && <span className="text-gray-400">(Optional)</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={getClasses()}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 pointer-events-none">
          {query ? <Search size={14} /> : <ChevronDown size={18} />}
        </div>

        {open && filtered.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-2xl shadow-lg max-h-56 overflow-y-auto">
            {filtered.map((option) => (
              <li
                key={option}
                onMouseDown={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer text-sm transition-colors first:rounded-t-2xl last:rounded-b-2xl
                  ${
                    option === value
                      ? "bg-brand-900 text-white"
                      : "hover:bg-gray-50 text-gray-800"
                  }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}

        {open && query.length > 0 && filtered.length === 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-2xl shadow-lg px-4 py-3 text-sm text-gray-400">
            No matches found
          </div>
        )}
      </div>

      {error && (
        <span className="text-red-500 text-sm animate-shake">{error}</span>
      )}
    </div>
  );
};
