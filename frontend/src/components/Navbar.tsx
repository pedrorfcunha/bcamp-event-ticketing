import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between space-between p-4 text-white border-b-[1px] border-gray-700">
      <p className="font-bold">LOGO</p>
      <span className="flex gap-5">
        <button>Sign up</button>
        <button className="bg-white px-4 py-3 text-black rounded-md font-bold">
          Log in
        </button>
      </span>
    </nav>
  );
};

export default Navbar;
