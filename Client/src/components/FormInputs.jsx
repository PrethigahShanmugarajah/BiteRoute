// Client / src / components / FormInputs.jsx
import { Controller } from "react-hook-form";
import Select from "react-select";

export const Input = ({
  label,
  name,
  type = "text",
  control,
  placeholder,
  required = false,
  errors,
  className = "",
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black">{label}</label>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) =>
          type === "textarea" ? (
            <textarea
              {...field}
              placeholder={placeholder}
              className={`mt-1 p-2 block w-full border border-gray-300 rounded-md placeholder-gray-400 focus:ring-1 focus:ring-primary/50 focus:outline-none resize-none ${className}`}
            />
          ) : (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`mt-1 p-2 block w-full border border-gray-300 rounded-md placeholder-gray-400 focus:ring-1 focus:ring-primary/50 focus:outline-none ${className}`}
            />
          )
        }
      />
      {errors && errors[name] && (
        <span className="text-red-500 text-sm mt-1">{label} is required</span>
      )}
    </div>
  );
};

export const SelectInput = ({
  label,
  name,
  control,
  options = [],
  required = false,
  errors,
  themeColor = "#5B21B6",
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <Select
            options={options}
            placeholder={`Select ${label}`}
            isSearchable
            value={options.find((opt) => opt.value === field.value) || null}
            onChange={(selected) => field.onChange(selected?.value)}
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? themeColor : base.borderColor,
                boxShadow: state.isFocused
                  ? `0 0 0 2px ${themeColor}33`
                  : base.boxShadow,
                "&:hover": { borderColor: themeColor },
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? `${themeColor}33`
                  : state.isSelected
                  ? themeColor
                  : base.backgroundColor,
                color: state.isSelected ? "#fff" : "#000",
                cursor: "pointer",
              }),
              singleValue: (base) => ({ ...base, color: "#000" }),
            }}
          />
        )}
      />
      {errors && errors[name] && (
        <span className="text-red-500 text-sm mt-1">{label} is required</span>
      )}
    </div>
  );
};

export const FileInput = ({
  label,
  name,
  control,
  required = false,
  errors,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black">{label}</label>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              field.onChange(file);
              if (onChange && file) onChange(file);
            }}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
          />
        )}
      />
      {errors && errors[name] && (
        <span className="text-red-500 text-sm mt-1">{label} is required</span>
      )}
    </div>
  );
};

export const CheckboxInput = ({
  label,
  name,
  control,
  required = false,
  errors,
}) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <input
            type="checkbox"
            {...field}
            checked={field.value || false}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-1 focus:ring-primary/50"
          />
        )}
      />
      <label className="text-sm text-black">{label}</label>
      {errors && errors[name] && (
        <span className="text-red-500 text-sm mt-1 block">
          {label} is required
        </span>
      )}
    </div>
  );
};

export const MultiCheckboxInput = ({
  label,
  name,
  control,
  options = [],
  required = false,
  errors,
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-black mb-1">{label}</p>
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2 mb-1">
          <Controller
            name={name}
            control={control}
            rules={{ required }}
            render={({ field }) => {
              const isChecked = field.value?.includes(opt.value) || false;
              return (
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={isChecked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      field.onChange([...(field.value || []), opt.value]);
                    } else {
                      field.onChange(
                        field.value.filter((v) => v !== opt.value)
                      );
                    }
                  }}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-1 focus:ring-primary/50"
                />
              );
            }}
          />
          <label className="text-sm text-black">{opt.label}</label>
        </div>
      ))}
      {errors && errors[name] && (
        <span className="text-red-500 text-sm mt-1">{label} is required</span>
      )}
    </div>
  );
};

export const RadioInput = ({
  label,
  name,
  control,
  options = [],
  required = false,
  errors,
}) => {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-black mb-1">{label}</p>
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2 mb-1">
          <Controller
            name={name}
            control={control}
            rules={{ required }}
            render={({ field }) => (
              <input
                type="radio"
                {...field}
                value={opt.value}
                checked={field.value === opt.value}
                className="h-4 w-4 text-primary border-gray-300 focus:ring-1 focus:ring-primary/50"
              />
            )}
          />
          <label className="text-sm text-black">{opt.label}</label>
        </div>
      ))}
      {errors && errors[name] && (
        <span className="text-red-500 text-sm mt-1">{label} is required</span>
      )}
    </div>
  );
};
