import PropTypes from 'prop-types';
import React from 'react';

const Button = ({ label, onClick, color }) => {
  return (
    <button
      className={` text-white border-1 border-gray-300 hover:bg-gray-500 w-[70px] h-[30px] text-center flex justify-center items-center`}
      style={{ backgroundColor: color ?? 'rgb(64, 88, 113)', color: 'white' }}
      onClick={onClick}
      color= {color ?? "red"}
    >
      <span className="truncate w-full text-sm">{label}</span>
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default Button;
