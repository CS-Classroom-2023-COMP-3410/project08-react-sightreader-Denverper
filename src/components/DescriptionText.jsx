import React from 'react';
import PropTypes from 'prop-types';

const DescriptionText = ({ message }) => {
  return (
    <div className="my-4 text-center text-gray-400 self-start">
      <p className="text-lg">{message}</p>
    </div>
  );
};

DescriptionText.propTypes = {
  message: PropTypes.string.isRequired,
};

export default DescriptionText;
