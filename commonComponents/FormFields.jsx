import React, { useState } from "react";

const FormField = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  options,
  className,
  onSubmit,
  accept,
  placeholder,
  required,
  checked,
  ref,
  style,
  disabled,
  loadMore,
  isMulti,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="relative">
        {label && (
          <label style={{ paddingRight: "20px" }}>
            {label} {required && <span style={{ color: "red" }}>*</span>}
          </label>
        )}

        {type === "select" ? (
          <select
            name={name}
            onChange={onChange}
            value={value}
            className={className}
            style={style}
          >
            <option value="" disabled={disabled ? disabled : false}>
              Select {placeholder ? placeholder : label}
            </option>
            {options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type == "loadMoreSelect" ? (
          <CustomSelect
            name={name}
            value={value}
            className={className}
            onChange={onChange}
            placeholder={`Select ${placeholder ? placeholder : label}`}
            options={options}
            loadMore={loadMore}
            menuPosition="fixed"
            isMulti={isMulti ? isMulti : false}
          />
        ) : type === "selectbyname" ? (
          <select
            name={name}
            onChange={onChange}
            value={value}
            className={className}
            style={style}
          >
            <option value="" disabled>
              Select {placeholder}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "file" ? (
          <input
            type="file"
            name={name}
            ref={ref}
            accept={accept}
            onChange={onChange}
            className={className}
          />
        ) : type === "password" ? (
          <div className="flex items-center" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={label || placeholder}
              name={name}
              onChange={onChange}
              value={value}
              className={`${className} flex-grow`}
            />
            <button
              type="button"
              onClick={handleTogglePasswordVisibility}
              className="ml-2"
              style={{
                position: "absolute",
                right: "10px",
                top: "22%",
                border: "none",
                background: "transparent",
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {!showPassword ? (
                <i className="fas fa-eye-slash cursor-pointer"></i>
              ) : (
                <i className="fas fa-eye cursor-pointer"></i>
              )}
            </button>
          </div>
        ) : type === "email" ? (
          <input
            type="email"
            name={name}
            onChange={onChange}
            value={value}
            className={className}
            disabled={disabled}
          />
        ) : type === "textarea" ? (
          <textarea
            name={name}
            placeholder={label || placeholder}
            onChange={onChange}
            value={value}
            className={className}
            style={style}
          ></textarea>
        ) : type === "date" ? (
          <input
            type="date"
            name={name}
            onChange={onChange}
            placeholder={placeholder ? placeholder : label}
            value={value}
            className={className}
            style={style}
          />
        ) : type === "datetime" ? (
          <input
            type="datetime-local"
            name={name}
            onChange={onChange}
            placeholder={placeholder ? placeholder : label}
            value={value}
            className={className}
            style={style}
          />
        ) : type === "tel" ? (
          <input
            type="tel"
            name={name}
            onChange={onChange}
            value={value}
            className={className}
            pattern="\d{10}"
            maxLength="10"
            disabled={disabled}
          />
        ) : type === "radio" ? (
          <div className="row">
            {options?.map((option, index) => (
              <div
                key={index}
                className="form-radio col-4"
                style={{ display: "flex", alignItems: "center" }}
              >
                <label
                  htmlFor={`${name}-${option.value}`}
                  style={{ marginRight: "5px", color: "black" }}
                >
                  {option.label}
                </label>
                <input
                  style={{ width: "15%" }}
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  className={className}
                  id={`${name}-${option.value}`}
                />
              </div>
            ))}
          </div>
        ) : type === "checkbox" ? (
          <input
            type="checkbox"
            name={name}
            onChange={onChange}
            checked={checked}
            className="form-checkbox"
            id={name}
          />
        ) : (
          <input
            type={type}
            name={name}
            onChange={onChange}
            value={value}
            className={`${className} custom-input`}
            placeholder={placeholder}
            style={style}
            disabled={disabled}
          />
        )}
        {error && (
          <p className="error" style={{ color: "red", paddingTop: "3px" }}>
            {error}
          </p>
        )}
      </div>
      <div>
        {onSubmit && (
          <button className="applicants-search-btn" onClick={onSubmit}>
            Search
          </button>
        )}
      </div>
    </>
  );
};

export default FormField;
