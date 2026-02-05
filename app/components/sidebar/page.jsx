"use client";

import Image from "next/image";
import { useState } from "react";

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white text-[var(--foreground)]   transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="p-4">
<div className="flex items-center space-x-2">
  <Image
    src="/images/logoo.png"
    alt="POS Logo"
    width={50}
    height={50}
    className=" p-1"
  />
  <span className="text-3xl font-bold text-[var(--accent)]">ApexPOS</span>
</div>


        <ul className="mt-4 space-y-2">
            <li>
              <a href="#" className="block px-2 py-1 hover:bg-[var(--hover)] rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="../product" className="block px-2 py-1 hover:bg-[var(--hover)] rounded">
                Product
              </a>
            </li>
            <li>
              <a href="../createproduct" className="block px-2 py-1 hover:bg-[var(--hover)] rounded">
              Create Product
              </a>
            </li> <li>
              <a href="../expire" className="block px-2 py-1 hover:bg-[var(--hover)] rounded">
             Expire Date 
              </a>
                 <a href="../lowstocks" className="block px-2 py-1 hover:bg-[var(--hover)] rounded">
            Low Stoks
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 sm:ml-64">
        <button
          className="mb-4 px-4 py-2 bg-[var(--primary)] text-white rounded sm:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Sidebar
        </button>

        {children}
      </div>
    </div>
  );
}
