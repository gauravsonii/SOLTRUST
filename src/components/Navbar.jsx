import React, { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose, AiFillGithub } from "react-icons/ai";
import { TbLetterX } from "react-icons/tb";  // Import X icon
import logo from '../Images/logo.png';
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-2">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-80 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))}
        
        <WalletDisconnectButton />

        {/* Add X (Twitter) and GitHub icons with links */}
        <li className="mx-4 cursor-pointer">
          <a href="https://x.com/gauravsoniiii" target="_blank" rel="noopener noreferrer">
            <TbLetterX fontSize={24} className="text-white" />
          </a>
        </li>
        <li className="mx-4 cursor-pointer">
          <a href="https://github.com/gauravsonii" target="_blank" rel="noopener noreferrer">
            <AiFillGithub fontSize={24} className="text-white" />
          </a>
        </li>
      </ul>

      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />,
            )}
            {/* Add X (Twitter) and GitHub icons in the mobile menu */}
            <li className="my-2 text-lg">
              <a href="https://x.com/gauravsoniiii" target="_blank" rel="noopener noreferrer">
              <TbLetterX fontSize={28} className="text-white font-extrabold" />

              </a>
            </li>
            <li className="my-2 text-lg">
              <a href="https://github.com/gauravsonii" target="_blank" rel="noopener noreferrer">
                <AiFillGithub fontSize={24} className="text-white" />
              </a>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
