type FormFieldProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormField({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}