"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
  };

  const isLoggedIn = !!token;

  return (
    <section>
      <div className="h-36 bg-purple-700 top-0 flex justify-center items-center">
        <Link href={"/"}>
          <h1 className="text-gray-50 font-bold text-3xl">PyqPapers</h1>
        </Link>
        {isLoggedIn ? (
          <button
            className="bg-gray-700 text-gray-100 p-4 font-bold ml-4 rounded-md cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button className="bg-gray-700 text-gray-100 p-4 font-bold ml-4 rounded-md cursor-pointer">
            <Link href="/auth/login">Login</Link>
          </button>
        )}
        <button className="bg-gray-700 text-gray-100 p-4 font-bold ml-4 rounded-md cursor-pointer">
          <Link href="/paper/new">New Papers</Link>
        </button>
        <button className="bg-gray-700 text-gray-100 p-4 font-bold ml-4 rounded-md cursor-pointer">
          <Link href="/paper">Papers</Link>
        </button>
      </div>
    </section>
  );
};

export default Navbar;
