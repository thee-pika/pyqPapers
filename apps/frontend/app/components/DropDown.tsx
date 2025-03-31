"use client";
import { useEffect, useRef, useState } from "react";

const Dropdown = ({
  options,
  label,
  value,
  onChange,
}: {
  options: string[];
  label: string;
  value: string;
  onChange: (selectedOption: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setselectedOption] = useState<string>(label);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const handleDropDown = () => setIsOpen(!isOpen);

  useEffect(() => {
    setselectedOption(value || label);
  }, [value, label]);

  const handleOption = (option: string) => {
    setselectedOption(option);
    setIsOpen(!isOpen);
    onChange(option);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropDownRef}>
      <button
        id="dropdownDefaultButton"
        type="button"
        className="bg-gray-900 w-full justify-between mb-1 inline-flex items-center focus:ring-4 focus:ring-[#D9D9D9] rounded-md hover:bg-[#153943] focus:outline-none p-3 text-[#D9D9D9] cursor-pointer"
        onClick={handleDropDown}
      >
        {selectedOption}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          id="dropdown"
          className="divide-y divide-gray-100 rounded-lg bg-[#D9D9D9] ml-8 w-[15vw] h-auto cursor-pointer"
        >
          <ul className="dropdown-menu absolute w-[30vw] h-[40vh] z-10 bg-gray-300 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOption(option)}
                className=" p-3 hover:bg-[#B2AEAE] "
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
