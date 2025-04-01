"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("token");
      const storedRole = sessionStorage.getItem("role");
      if (storedRole === "Admin") {
        setIsAdmin(true);
      }
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setToken(null);
    setIsAdmin(false);
    router.push("/auth/login");
  };

  const isLoggedIn = !!token;

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="h-28 bg-purple-700 flex w-[100vw] justify-between items-center px-6 sm:px-8 md:px-12">

        <Link href={"/"}>
          <h1 className="text-gray-50 font-bold text-3xl">PyqPapers</h1>
        </Link>

        <button
          className="lg:hidden text-white cursor-pointer"
          onClick={toggleMobileMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden lg:flex items-center space-x-6">
          {isAdmin && (
            <>
              <Link href="/paper">
                <div className="bg-gray-700 text-gray-100 p-2 sm:p-4 font-semibold rounded-md transition duration-300 ease-in-out hover:bg-gray-600">
                  Papers
                </div>
              </Link>
              <Link href="/paper/new">
                <div className="bg-gray-700 text-gray-100 p-2 sm:p-4 font-semibold rounded-md transition duration-300 ease-in-out hover:bg-gray-600">
                  New Papers
                </div>
              </Link>
            </>
          )}
          {isLoggedIn ? (
            <div
              className="bg-gray-700 text-gray-100 p-2 sm:p-4 font-semibold rounded-md cursor-pointer transition duration-300 ease-in-out hover:bg-gray-600"
              onClick={handleLogout}
            >
              Logout
            </div>
          ) : (
            <Link href="/auth/login">
              <div className="bg-gray-700 text-gray-100 p-2 sm:p-4 font-semibold rounded-md transition duration-300 ease-in-out hover:bg-gray-600">
                Login
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col bg-purple-700 text-white px-6 py-4 space-y-4 lg:hidden">
        
          {isAdmin && (
            <>
              <Link href="/paper">
                <div className="bg-gray-700 text-gray-100 p-2 sm:p-4 font-semibold rounded-md transition duration-300 ease-in-out hover:bg-gray-600">
                  Papers
                </div>
              </Link>
              <Link href="/paper/new">
                <div className="bg-gray-700 text-gray-100 p-2 sm:p-4 font-semibold rounded-md transition duration-300 ease-in-out hover:bg-gray-600">
                  New Papers
                </div>
              </Link>
            </>
          )}
          {isLoggedIn ? (
            <div
              className="px-4 py-2 hover:bg-gray-200 hover:text-black font-semibold rounded-md cursor-pointer transition duration-300 ease-in-out"
              onClick={handleLogout}
            >
              Logout
            </div>
          ) : (
            <Link href="/auth/login">
              <div
                className="px-4 py-2 hover:bg-gray-200 hover:text-black font-semibold rounded-md transition duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </div>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
