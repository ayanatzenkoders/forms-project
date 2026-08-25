// "use client";
// import Page1 from "./Page1";
// import Page2 from "./Page2";
// import Page3 from "./Page3";
// import { usePractioner } from "@/context/PractitionerContext";

// export default function PractionerForm() {
//   const { currentPage, setCurrentPage, formData, updateSection } =
//     usePractioner();
//   return (
//     <>
//       {currentPage === 1 && (
//         <Page1
//           nextPage={() => setCurrentPage(2)}
//           updateSection={updateSection}
//           formData={formData}
//         />
//       )}
//       {currentPage === 2 && (
//         <Page2
//           nextPage={() => setCurrentPage(3)}
//           prevPage={() => setCurrentPage(1)}
//           updateSection={updateSection}
//           formData={formData}
//         />
//       )}
//       {/* {currentPage === 3 && (
//             <Page3
//               nextPage={() => setCurrentPage(4)}
//               prevPage={() => setCurrentPage(2)}
//               updateSection={updateSection}
//               formData={formData}
//             />) */}
//     </>
//   );
// }
