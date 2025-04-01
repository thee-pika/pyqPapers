"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/app/components/DropDown";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const [file, setFile] = useState<File | undefined>();
  const [token, settoken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const Token = sessionStorage.getItem("token");

    if (Token) {
      settoken(Token);
    } else {
      toast.error("Please login to continue");
      router.push("/auth/login");
    }
  }, []);

  const [pyqDetails, setPyqDetails] = useState({
    title: "",
    year: "",
    subject: "",
    combination: "",
    semester: "",
  });

  const combinations = ["BSC", "BCom", "BBA", "BA", "BZC", "BCA", "NCZ"];
  const subjects = [
    "Mathematics_BSC",
    "Physics_BSC",
    "Chemistry_BSC",
    "Biology_BSC",
    "ComputerScience_BSC",
    "Accounting_BCom",
    "Economics_BCom",
    "BusinessStudies_BCom",
    "Finance_BCom",
    "Taxation_BCom",
    "History_BA",
    "PoliticalScience_BA",
    "Psychology_BA",
    "Sociology_BA",
    "EnglishLiterature_BA",
    "Philosophy_MA",
    "Linguistics_MA",
    "FineArts_MA",
    "Literature_MA",
    "CulturalStudies_MA",
    "Marketing_MBA",
    "MachineLearning_PhD",
  ];
  const semesters = ["SEM1", "SEM2", "SEM3", "SEM4", "SEM5", "SEM6"];
  const years = [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
  
      const formData = new FormData();
  
      formData.append("image", file!);
  
      const data = {
        title: pyqDetails.title,
        year: parseInt(pyqDetails.year),
        subject: pyqDetails.subject,
        combination: pyqDetails.combination,
        semester: pyqDetails.semester,
      };
  
      formData.append("form", JSON.stringify(data));
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/paper`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.ok) {
        toast.success("New PyqPaper created Successfully!!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (error) {
      toast.error("Paper creation failed!!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Upload Previous Year Question Papers
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-3 mt-1 rounded-md border border-gray-300 bg-gray-100 focus:ring focus:ring-blue-300"
              placeholder="Enter the title"
              required
              value={pyqDetails.title}
              onChange={(e) =>
                setPyqDetails({ ...pyqDetails, title: e.target.value })
              }
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-600"
              htmlFor="file-upload"
            >
              Upload File
            </label>
            <div className="border-dashed border-2 border-gray-400 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition text-center">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15a4 4 0 100-8 4 4 0 000 8zm0 0v6m0-6h6m13-2l-5 5m0 0l-5-5m5 5V3"
                  />
                </svg>
                <span className="font-medium">Click to Upload</span>
              </label>
              <input
                id="file-upload"
                type="file"
                className=""
                onChange={handleChange}
              />
            </div>
            {file && (
              <p className="mt-4 text-sm text-gray-600">
                Selected File: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-[6rem]">
            <Dropdown
              options={combinations}
              value={pyqDetails.combination}
              onChange={(value) =>
                setPyqDetails({ ...pyqDetails, combination: value })
              }
              label="Select Combination"
            />
            <Dropdown
              options={subjects}
              value={pyqDetails.subject}
              onChange={(value) =>
                setPyqDetails({ ...pyqDetails, subject: value })
              }
              label="Select Subject"
            />
          </div>
          <div className="grid grid-cols-2 gap-[6rem]">
            <Dropdown
              options={semesters}
              value={pyqDetails.semester}
              onChange={(value) =>
                setPyqDetails({ ...pyqDetails, semester: value })
              }
              label="Select Semester"
            />
            <Dropdown
              options={years}
              value={pyqDetails.year}
              onChange={(value) =>
                setPyqDetails({ ...pyqDetails, year: value })
              }
              label="Select Year"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white font-bold py-3 cursor-pointer rounded-md hover:bg-purple-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
      </div>
      <Toaster />
    </section>
  );
};

export default Page;
