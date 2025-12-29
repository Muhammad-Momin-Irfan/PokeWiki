import React from 'react';
import './TypeBadge.css';

const TypeBadge = ({ type }) => {
  // Guard clause: if type is undefined/null, render nothing
  if (!type) return null;

  return (
    <span className={`type-badge ${type.toLowerCase()}`}>
      {type}
    </span>
  );
};

export default TypeBadge;