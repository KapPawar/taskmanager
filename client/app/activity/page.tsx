"use client"
import React, { useRef, useState } from "react";
import RadialChart from '../Components/RadialChart/RadialChart'
import { useUserContext } from '@/context/userContext';
import { useTasks } from '@/context/taskContext';

// Define the options type inline
interface Html2PdfOptions {
  margin?: number;
  filename?: string;
  image?: {
    type?: string;
    quality?: number;
  };
  html2canvas?: {
    scale?: number;
    [key: string]: any;
  };
  jsPDF?: {
    unit?: string;
    format?: string;
    orientation?: 'portrait' | 'landscape';
    [key: string]: any;
  };
}

const Page = () => {
  const { user } = useUserContext();
  const { tasks, activeTasks, completedTasks } = useTasks();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const convertToPdf = async () => {
    try {
      setIsExporting(true);
      // Dynamically import html2pdf only on client side
      const html2pdf = (await import('html2pdf.js')).default;
      
      const content = contentRef.current;
      const options: Html2PdfOptions = {
        filename: `${user?.name || "tasks"}-report.pdf`,
        margin: 1,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait',
        },
      };

      await html2pdf().set(options).from(content).save();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="mt-6 flex flex-col gap-8 w-full" ref={contentRef}>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-gray-400">
            <p>Total Tasks:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-purple-500 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {tasks.length}
              </span>
            </p>
          </div>
          <div className="text-gray-400">
            <p>In Progress:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-[#3AAFAE] rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {activeTasks.length}
              </span>
            </p>
          </div>
          <div className="text-gray-400">
            <p>Open Tasks:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-orange-400 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {activeTasks.length}
              </span>
            </p>
          </div>
          <div className="text-gray-400">
            <p>Completed:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-green-400 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {completedTasks.length}
              </span>
            </p>
          </div>
        </div>
        <RadialChart />
      </div>
      
      <button 
        id="analytics"
        className="px-8 py-3 bg-[#0064b1] hover:bg-[#7263F3] text-white rounded-[50px]
          hover:text-white transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={convertToPdf}
        disabled={isExporting}
      >
        {isExporting ? 'Generating PDF...' : 'Export to PDF'}
      </button>
    </div>
  );
};

export default Page;