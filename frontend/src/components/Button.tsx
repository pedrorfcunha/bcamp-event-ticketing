import React from 'react';

interface CustomButtonProps {
  type: string;
  label: string;
  onClick: () => void;
}

const CustomButton = ({ type, label, onClick }: CustomButtonProps) => {
  // Define CSS classes based on the 'type' prop
  let buttonClass = 'bg-gray-400 text-white font-semibold py-2 px-4 rounded';

  if (type === 'primary') {
    buttonClass =
      'w-full p-3 rounded-md bg-black-900 text-white cursor-pointer W2STMedium my-3 cursos-pointer';
  } else if (type === 'secondary') {
    buttonClass =
      'bg-zinc-600 text-white font-semibold py-2 px-4 rounded-md cursos-pointer';
  } else if (type === 'tertiary') {
    buttonClass =
      'bg-white text-gray-700 font-semibold py-2 px-4 rounded-md border-[1px] border-gray300 cursos-pointer';
  }

  return (
    <button className={buttonClass} onClick={onClick}>
      {label}
    </button>
  );
};

export default CustomButton;
