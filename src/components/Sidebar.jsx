// "use client";

// import React, { useEffect, useState } from "react";

// const Sidebar = () => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const callApi = async () => {
//       try {
//         const res = await fetch(
//           "https://ml-models-backend-wh0k.onrender.com/"
//         );

//         if (!res.ok) {
//           throw new Error(`HTTP error ${res.status}`);
//         }

//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     callApi();
//   }, []);

//   return (
//     <div>
//       <h2>Sidebar</h2>

//       {data && (
//         <pre style={{ color: "green" }}>
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       )}

//       {error && (
//         <pre style={{ color: "red" }}>
//           {error}
//         </pre>
//       )}
//     </div>
//   );
// };

// export default Sidebar;
// components/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Model Metrics", href: "/metrics" },
  { name: "Predict Attack", href: "/predict" },
  { name: "All Models", href: "/models" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: 220, padding: 20, borderRight: "1px solid #ddd" }}>
      <h3>ML Dashboard</h3>
      <nav>
        {links.map(link => (
          <div key={link.href} style={{ margin: "12px 0" }}>
            <Link
              href={link.href}
              style={{
                fontWeight: pathname === link.href ? "bold" : "normal"
              }}
            >
              {link.name}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}
