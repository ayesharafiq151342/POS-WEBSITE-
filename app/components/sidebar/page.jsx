"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true); // Sidebar active by default

  return (
    <div className="flex">
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white text-[var(--foreground)] transition-transform z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logoo.png"
              alt="POS Logo"
              width={50}
              height={50}
              className="p-1"
            />
            <span className="text-3xl font-bold text-[var(--accent)]">
              ApexPOS
            </span>
          </div>

          {/* Navigation */}
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/"
                className="block px-2 py-1 hover:bg-[var(--accent)] hover:text-white rounded"
              >
                Dashboard
              </Link>
            </li>   <li>
              <Link
                href="/AllProducts"
                className="block px-2 py-1 hover:bg-[var(--accent)] hover:text-white rounded"
              >
                All Product
              </Link>
            </li>
            <li>
              <Link
                href="/product"
                className="block px-2 py-1 hover:bg-[var(--accent)] hover:text-white rounded"
              >
                Product
              </Link>
            </li>
            <li>
              <Link
                href="/createproduct"
                className="block px-2 py-1 hover:bg-[var(--accent)] hover:text-white rounded"
              >
                Create Product
              </Link>
            </li>
            <li>
              <Link
                href="/expire"
                className="block px-2 py-1 hover:bg-[var(--accent)] hover:text-white rounded"
              >
                Expire Date
              </Link>
            </li>
            <li>
              <Link
                href="/lowstocks"
                className="block px-2 py-1 hover:bg-[var(--accent)] hover:text-white rounded"
              >
                Low Stocks
              </Link>
            </li>
            <li>
              <Link
                href="/category-list"
                className="block px-2 py-1 hover:bg-[var(--accent)] hover:text-white rounded"
              >
                Category
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 sm:ml-64">
        {/* Toggle button only visible on small screens */}
        <button
          className="mb-4 px-4 py-2 bg-[var(--primary)] text-white rounded sm:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close Sidebar" : "Open Sidebar"}
        </button>

        {children}
      </div>
    </div>
  );
}
