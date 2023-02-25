import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";

const Alert = ({ type, message, reset }) => {
  const colorClass = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`p-4 ${colorClass} text-white rounded-lg shadow-md flex justify-between items-center`}
    >
      {message || ""}
      <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={() => reset()} />
    </div>
  );
};

export default Alert;
