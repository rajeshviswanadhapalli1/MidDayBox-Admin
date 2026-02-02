import React from "react";

export const Tabs = ({ active, onChange, children }) => {
  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            active,
            onChange,
          })
        )}
      </div>
    </div>
  );
};

export const Tab = ({ label, value, active, onChange }) => {
  return (
    <button
      onClick={() => onChange(value)}
      className={`
        px-4 py-2 font-medium text-sm
        transition-all duration-300
        border-b-2
        ${
          active === value
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-gray-600 hover:text-blue-500"
        }
      `}
    >
      {label}
    </button>
  );
};
