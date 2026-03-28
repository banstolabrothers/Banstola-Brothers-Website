"use client";

import React, { useState, ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

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
      return `${baseInputClasses} border-brand-500 bg-white shadow-sm`;
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
      <h6 className="font-HRegular w-full text-neutral-700">
        {label} {optional && <span className="text-gray-400">(Optional)</span>}
      </h6>

      {prefix ? (
        <div className="flex gap-2">
          <div className="flex items-center px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-gray-50">
            <span className="text-gray-700">
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
      return `${baseSelectClasses} border-brand-500 bg-white shadow-sm`;
    if (isFilled) return `${baseSelectClasses} border-neutral-300 bg-white`;
    return `${baseSelectClasses} border-neutral-200 hover:border-neutral-300`;
  };

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <h6 className="font-HRegular w-full text-neutral-700">{label}</h6>
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
