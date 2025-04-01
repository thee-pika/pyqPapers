"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MoonLoader from "react-spinners/MoonLoader";

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

const AllPapers = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllPapers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/paper`
      );
      console.log("res", res);

      setPapers(res.data.allPyqPaper);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPapers();
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
      <h1 className="text-3xl font-bold text-center mb-6">All Papers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {papers.map((paper) => (
          <Link href={`/paper/${paper.id}`}>
            <div
              key={paper.id}
              className="border rounded-lg flex flex-col h-[60vh] items-center justify-evenly shadow-lg p-4"
            >
              <h2 className="text-xl font-semibold mb-2">{paper.title}</h2>
              <div className="flex justify-center">
                <Image
                  src={`${paper.psurl}`}
                  alt={paper.title}
                  width={220}
                  height={260}
                  layout="fixed"
                  className="object-cover rounded-md mb-2"
                />
              </div>
              <p className="text-gray-700 font-medium">
                {paper.subject.replace("_", " ")}
              </p>
              <div className="flex w-full justify-between">
                <p className="text-gray-500">Group: {paper.combination}</p>
                <p className="text-gray-500">Year: {paper.year}</p>
              
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AllPapers;
