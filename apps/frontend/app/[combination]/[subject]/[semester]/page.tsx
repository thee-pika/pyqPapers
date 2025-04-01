"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Share2 } from "lucide-react";
import MoonLoader from "react-spinners/MoonLoader";
import toast, { Toaster } from "react-hot-toast";

interface Paper {
  id: string;
  title: string;
  year: number;
  imageUrl: string;
  semester: string;
  subject: string;
  combination: string;
  psurl: string;
  expiryDate: Date;
}

const GetPyqPaper = () => {
  const { combination, subject, semester } = useParams();
  const router = useRouter();
  const [pyqPapers, setPyqPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  const getPYQPaper = async (token: string) => {
    try {
      const data = { combination, subject, semester: "SEM" + semester };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/paper/get-paper`,
        { data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPyqPapers(res.data.pyqPapers);
    } catch (error:any) {
      toast.error("Error fetching papers:", error.msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl, { method: "GET" });

      if (!response.ok) {
        toast.error("Failed to fetch the file.");
      }

      const blob = await response.blob();
      const contentType = response.headers.get("content-type");

      let extension = "";
      if (contentType?.includes("image/jpeg")) extension = ".jpeg";
      else if (contentType?.includes("image/png")) extension = ".png";
      else if (contentType?.includes("image/webp")) extension = ".webp";
      else if (contentType?.includes("image/gif")) extension = ".gif";
      else if (contentType?.includes("application/pdf")) extension = ".pdf";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${fileName}${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      toast.success(`New File Downloaded!!`)
    } catch (error:any) {
      toast.error("Error downloading file:", error.msg);
    }
  };

  const handleShare = async (fileUrl: string, fileName: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fileName,
          text: `Check out this paper: ${fileName}`,
          url: fileUrl,
        });
      } catch (error:any) {
       toast.error("Error sharing:", error.msg);
      }
    } else {
      // Fallback if Web Share API is not supported
      navigator.clipboard.writeText(fileUrl);
      toast.success("Link copied to clipboard! Share it manually.");
    }
  };

  useEffect(() => {
    const Token = sessionStorage.getItem("token");
    if (Token) {
      getPYQPaper(Token);
    } else {
      toast.error("Please login to continue");
      router.push("/auth/login");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <MoonLoader 
        color="#8200DB"
        size={90}
        loading={loading}
        />
      </div>
    );
  }

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Papers</h1>

      {pyqPapers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pyqPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center transition-all cursor-pointer duration-300 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-center mb-3">
                {paper.title}
              </h2>

              <div className="relative w-[220px] h-[260px] mb-3">
                <Image
                  src={paper.psurl}
                  alt={paper.title}
                  fill
                  className=" rounded-md"
                />
              </div>

              <p className="text-gray-700 font-medium">
                {paper.subject.replace("_", " ")}
              </p>

              <div className="flex justify-between w-full mt-2 text-sm text-gray-600">
                <p>Group: {paper.combination}</p>
                <p>Year: {paper.year}</p>
              </div>

              <div className="mt-4 flex gap-3 w-full">
                <button
                  onClick={() => handleDownload(paper.psurl, `${paper.title}`)}
                  className="flex items-center gap-2 justify-center bg-purple-700 w-1/2 text-white px-4 py-2 rounded-md hover:bg-purple-900 transition"
                >
                  <Download size={18} /> Download
                </button>
                <button
                  onClick={() => handleShare(paper.psurl, paper.title)}
                  className="flex items-center gap-2 cursor-pointer justify-center w-1/2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-8 text-lg">
          No papers found.
        </div>
      )}
      <Toaster/>
    </section>
  );
};

export default GetPyqPaper;
