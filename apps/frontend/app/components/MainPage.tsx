"use client";
import React, { useState } from "react";

const MainPage = () => {
  const [clickedComb, setclickedComb] = useState<keyof typeof subjects>("BSC");

  const subjects = {
    BSC: ["Mathematics", "Physics", "Chemistry"],
    BCA: ["Computer Science", "Mathematics", "Statistics"],
    BCOM: ["Accounting", "Economics", "Business Studies"],
    BBA: ["Management", "Marketing", "Finance"],
    BA: ["History", "Political Science", "Sociology"],
    BCZ: ["Biology", "Chemistry", "Zoology"],
    NCZ: ["Nutrition", "Chemistry", "Zoology"],
  };

  const handlCombClick = (comb: keyof typeof subjects) => {
    setclickedComb(comb);
  };

  return (
    <div className="w-full flex">
      {/* sidebar */}
      <div className="w-1/5 bg-gray-700 m-12">
        {Object.keys(subjects).map((comb) => (
          <div
            className="bg-gray-600 p-4 mt-2 hover:bg-gray-900 hover:text-white cursor-pointer"
            key={comb}
            onClick={() => handlCombClick(comb as keyof typeof subjects)}
          >
            {comb}
          </div>
        ))}
      </div>
      {/* showbar */}
      <div className="w-4/5 m-12">
        <div className="bg-gray-400 text-gray-800 h-[70vh] text-2xl">
          <h1 className="text-xl font-bold mb-4">
            Selected Combination: {clickedComb}
          </h1>
          <div>
            {subjects[clickedComb]?.length > 0 ? (
              <ul className="list-disc ml-6">
                {subjects[clickedComb].map((subject:string, index:number) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            ) : (
              <p>No subjects available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
