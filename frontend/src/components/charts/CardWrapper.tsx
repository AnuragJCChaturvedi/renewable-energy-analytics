import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export const CardWrapper: React.FC<Props> = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="flex-1">{children}</div>
  </div>
);
