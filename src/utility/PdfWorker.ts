import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Use the worker from the local build
// This path must match the 'dest' configuration in vite.config.ts
pdfjs.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.mjs';

// Configure options for PDF rendering
export const PDF_OPTIONS = {
  // Use local paths for cMaps and standard fonts
  cMapUrl: '/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: '/standard_fonts/',
  // Optimize rendering performance
  disableAutoFetch: true,
  disableStream: false, // Allow streaming for better performance with large PDFs
  isEvalSupported: false,
  // Add caching to improve performance for subsequent views
  cacheSize: 10, // Cache up to 10 pages
  enableXfa: false, // Disable XFA to improve performance
  // Enable these options for better performance
  useSystemFonts: false,
  disableFontFace: false,
  rangeChunkSize: 65536, // 64KB chunks for better streaming
  maxImageSize: 1024 * 1024 * 10,
};
