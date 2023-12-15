// Input.js
const Input = (props) => {
  const { type, className, name, placeholder, value, onChange, defaultChecked, maxLength } = props;

  return (
    <input
      type={type}
      className={className}
      name={name}
      placeholder={placeholder}
      value={value}
      maxLength={maxLength}
      onChange={onChange}
      defaultChecked={defaultChecked && defaultChecked}
    />
  );
};

export default Input;
