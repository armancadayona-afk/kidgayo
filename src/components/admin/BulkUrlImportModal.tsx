import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Plus
} from 'lucide-react';
import { Property } from '../../types';
import { parseBulkUrls, generateSampleCsv } from '../../utils/urlParser';

interface BulkUrlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBulk: (properties: Property[]) => void;
}

export const BulkUrlImportModal: React.FC<BulkUrlImportModalProps> = ({
  isOpen,
  onClose,
  onImportBulk
}) => {
  const [csvContent, setCsvContent] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedResults, setParsedResults] = useState<{
    successful: Property[];
    failed: { url: string; reason: string }[];
  } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setCsvContent(text);
      processCsv(text);
    };
    reader.readAsText(file);
  };

  const processCsv = (content: string) => {
    if (!content.trim()) return;

    setParsing(true);
    setTimeout(() => {
      const results = parseBulkUrls(content);
      setParsedResults({
        successful: results.successful,
        failed: results.failed
      });
      setParsing(false);
    }, 400);
  };

  const handleLoadSample = () => {
    const sample = generateSampleCsv();
    setCsvContent(sample);
    processCsv(sample);
  };

  const handleDownloadSample = () => {
    const sample = generateSampleCsv();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'apartmentlisting_boston_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    if (parsedResults && parsedResults.successful.length > 0) {
      onImportBulk(parsedResults.successful);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Landlord Console • Bulk Import
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Bulk Add Properties via CSV (Compass & Apartments.com)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5 text-xs">
          {/* CSV Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 cursor-pointer shadow-2xs transition">
                <Upload className="w-4 h-4 text-[#0066FF]" />
                <span>Upload .CSV File</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl font-semibold text-[#0066FF] transition"
              >
                Load Sample Boston CSV
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadSample}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Paste Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">
                Or paste CSV / URLs directly:
              </label>
              <span className="text-[11px] text-slate-400">
                Supported domains: compass.com & apartments.com
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="url,monthly_rent,notes&#10;https://www.compass.com/homedetails/...&#10;https://www.apartments.com/..."
              value={csvContent}
              onChange={e => {
                setCsvContent(e.target.value);
                processCsv(e.target.value);
              }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#0066FF] focus:bg-white resize-none"
            />
          </div>

          {/* Parsing Results Preview */}
          {parsing ? (
            <div className="p-8 text-center text-slate-500">
              <div className="w-8 h-8 border-3 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Parsing Compass & Apartments.com property links...</span>
            </div>
          ) : parsedResults ? (
            <div className="space-y-4 pt-2 border-t border-slate-200 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs">
                    {parsedResults.successful.length} Ready to Import
                  </span>
                  {parsedResults.failed.length > 0 && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg font-bold text-xs">
                      {parsedResults.failed.length} Skipped / Unsupported
                    </span>
                  )}
                </div>
              </div>

              {/* Table of Parsed Properties */}
              {parsedResults.successful.length > 0 && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-3">Property</th>
                        <th className="p-3">Source Portal</th>
                        <th className="p-3">Rent / Mo</th>
                        <th className="p-3">Beds / Baths</th>
                        <th className="p-3">Neighborhood</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedResults.successful.map((prop, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{prop.streetAddress} {prop.unit}</div>
                            <div className="text-[11px] text-slate-500">{prop.city}, {prop.state} {prop.zipCode}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                              prop.sourcePortal === 'compass'
                                ? 'bg-slate-900 text-white'
                                : 'bg-blue-900 text-white'
                            }`}>
                              {prop.sourcePortal}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            ${prop.monthlyRent.toLocaleString()}
                          </td>
                          <td className="p-3 text-slate-700">
                            {prop.bedrooms} Bed / {prop.bathrooms} Bath
                          </td>
                          <td className="p-3 text-slate-600">
                            {prop.neighborhood}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Failed URLs list if any */}
              {parsedResults.failed.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-amber-900 block">Skipped URLs:</span>
                  <ul className="space-y-1">
                    {parsedResults.failed.map((fail, i) => (
                      <li key={i} className="text-amber-800 text-[11px] truncate">
                        • {fail.url} — {fail.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!parsedResults || parsedResults.successful.length === 0}
            onClick={handleConfirmImport}
            className="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>
              Import {parsedResults?.successful.length || 0} Properties to Portfolio
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
