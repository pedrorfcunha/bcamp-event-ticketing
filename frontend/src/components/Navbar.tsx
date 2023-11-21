const Navbar = () => {
  return (
    <nav className="flex items-center justify-between space-between p-4 text-white border-b-[1px] border-gray-700">
      <img
        src="https://pliant.io/wp-content/uploads/2022/08/jira-logo.png"
        alt="event banner"
        className="h-[50px]  rounded-md"
      />
      <span className="flex gap-5">
        <button className="bg-white px-4 py-3 text-black rounded-md font-bold">
          Connect Wallet
        </button>
      </span>
    </nav>
  );
};

export default Navbar;
