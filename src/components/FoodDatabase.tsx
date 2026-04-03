import React from 'react';

// Placeholder for FoodDatabase implementation
const FoodDatabase: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div>
      <button onClick={onBack}>Back</button>
      Food Database (to be implemented)
    </div>
  );
};

export default FoodDatabase;
