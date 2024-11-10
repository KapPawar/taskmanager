// Create this file at: src/types/html2pdf.d.ts

declare module 'html2pdf.js' {
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
  
    interface Html2PdfInstance {
      set: (options: Html2PdfOptions) => Html2PdfInstance;
      from: (element: HTMLElement | null) => Html2PdfInstance;
      save: () => Promise<void>;
    }
  
    function html2pdf(): Html2PdfInstance;
    export default html2pdf;
  }