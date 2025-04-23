"use client";
import React from "react";
import InputWithIcon from "@/components/LoginSignupUI/InputWithIcon";
import Button from "@/components/Button";

interface Field {
  name: string;
  type: string;
  placeholder: string;
  iconSrc: string;
  value: string;
  rows?: number;
}

interface FormProps {
  fields: Field[];
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  buttonText: string;
}

export default function Form({
  fields,
  onChange,
  onSubmit,
  loading,
  buttonText,
}: FormProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-gray-700 font-medium mb-2 capitalize"
          >
            {field.name}
          </label>
          <InputWithIcon
            iconSrc={field.iconSrc}
            value={field.value}
            onChange={(val) => onChange(field.name, val)}
            placeholder={field.placeholder}
            type={field.type}
          />
        </div>
      ))}
      <Button
        onClick={onSubmit}
        type="button"
        loading={loading}
        title={loading ? "Loading..." : buttonText}
        variant="btn_gradient_green_blue"
        full
      />
    </div>
  );
}
