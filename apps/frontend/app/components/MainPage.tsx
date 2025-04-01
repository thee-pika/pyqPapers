"use client";
import Link from "next/link";
import React, { useState } from "react";

const MainPage = () => {
  const [clickedComb, setClickedComb] = useState<keyof typeof subjects>("BSC");

  const subjects = {
    BSC: ["Mathematics_BSC", "Physics_BSC", "ComputerScience_BSC"],
    BCA: ["Computer Science", "Mathematics", "Statistics"],
    BCOM: ["Accounting", "Economics", "Business Studies"],
    BBA: ["Management", "Marketing", "Finance"],
    BA: ["History", "Political Science", "Sociology"],
    BCZ: ["Biology", "Chemistry", "Zoology"],
    NCZ: ["Nutrition", "Chemistry", "Zoology"],
  };

  const handleCombClick = (comb: keyof typeof subjects) => {
    setClickedComb(comb);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-1/5 bg-purple-700 text-white p-6 mb-6 lg:mb-0">
        <h2 className="text-2xl font-bold mb-6 text-center text-white p-4 bg-gray-950">Combinations</h2>
        {Object.keys(subjects).map((comb) => (
          <div
            className={`bg-gray-800 p-4 mt-2 rounded-md text-center cursor-pointer transition duration-300 ease-in-out hover:bg-purple-600 ${
              clickedComb === comb ? "bg-purple-600" : ""
            }`}
            key={comb}
            onClick={() => handleCombClick(comb as keyof typeof subjects)}
          >
            {comb}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-4/5 p-6">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">
            Selected Combination: {clickedComb}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Subjects & Semesters
          </h2>
          {subjects[clickedComb]?.length > 0 ? (
            <div>
              {subjects[clickedComb].map((subject, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    {subject}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, semIndex) => (
                      <Link
                        href={`/${clickedComb}/${subject}/${semIndex + 1}`}
                        key={semIndex}
                      >
                        <div className="bg-purple-600 font-bold text-white p-4 rounded-md text-center cursor-pointer transition duration-300 ease-in-out hover:bg-purple-500">
                          {clickedComb}-{subject}-Semester {semIndex + 1}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-500">No subjects available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
