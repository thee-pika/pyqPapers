"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

const PaperById = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [token, settoken] = useState<string>("");
  const [menuOpen, setmenuOpen] = useState<boolean>(false);
  const [paper, setPaper] = useState<Paper>();
  const router = useRouter();

  useEffect(() => {
    const Token = sessionStorage.getItem("token");

    if (Token) {
      settoken(Token);
      getPaperBYId(Token);
    } else {
      alert("Please login to continue");
      router.push("/auth/login");
    }
  }, []);

  const getPaperBYId = async (Token: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/paper/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setPaper(res.data.pyqPaper);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading.........</div>;
  }

  const handleDelete = async () => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/paper/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      alert("DEleteed Succssfully!!");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {paper ? (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            {paper.title}
          </h1>

          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
            <div className="relative w-full h-[500px] mb-6">
              <Image
                src={paper.psurl}
                alt={paper.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            <div className="text-center">
              <div className="flex justify-between">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Subject:</span>{" "}
                  {paper.subject.replace("_", " ")}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Semester:</span>{" "}
                  {paper.semester}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Combination:</span>{" "}
                  {paper.combination}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Year:</span> {paper.year}
                </p>
              </div>
            </div>
            
            <div>
              <Link href={`/paper/edit/${paper.id}`}>
                <button className="bg-purple-700 p-4 px-8 rounded-md text-white font-bold cursor-pointer">
                  Edit
                </button>
              </Link>
              <button
                className="bg-red-700 p-4 px-8 rounded-md text-white font-bold ml-12 cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        "NO Paper Found!!"
      )}
    </div>
  );
};

export default PaperById;
