import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { generateSchedule, APIError } from '../services/api';
import { getSampleCollegeData } from '../utils/sampleData';
import { parseExcelToCollegeData } from '../utils/excelParser';

const CreateTimetable = () => {
  const [dataSource, setDataSource] = useState<'sample' | 'file' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dataLoaded = dataSource !== null;

  const handleUseSampleData = () => {
    setDataSource('sample');
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file extension
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (extension === '.csv') {
      setError("CSV upload requires a multi-file import format and is not supported for complete college data yet. Please upload an Excel workbook with the required sheets.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (!validExtensions.includes(extension)) {
      setError(`Unsupported file type: ${extension}. Please upload an .xlsx or .xls workbook.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    setDataSource('file');
    setError(null);
  };

  const handleProceed = async () => {
    if (!dataLoaded || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      let collegeData;
      
      if (dataSource === 'sample') {
        collegeData = getSampleCollegeData();
      } else if (dataSource === 'file' && selectedFile) {
        try {
          collegeData = await parseExcelToCollegeData(selectedFile);
        } catch (parseErr: any) {
          setError(`Parse Error: ${parseErr.message}`);
          setIsGenerating(false);
          return; // Stop generation flow
        }
      } else {
        throw new Error('No valid data source found.');
      }

      const result = await generateSchedule(collegeData);
      
      if (result.status === 'INFEASIBLE') {
        throw new Error('The scheduling engine determined the constraints are INFEASIBLE.');
      }
      
      // Store the real result for subsequent pages
      sessionStorage.setItem('realTimetableResult', JSON.stringify(result));
      
      // Continue the existing UI flow
      navigate('/constraints');
      
    } catch (err: any) {
      if (err instanceof APIError) {
        if (err.status === 422) {
          setError('Validation Error: The submitted timetable data is invalid.');
        } else if (err.status === 0) {
          setError('Network Error: The scheduling backend is currently unavailable.');
        } else {
          setError(`Server Error: Timetable generation failed (${err.message})`);
        }
      } else {
        setError(err.message || 'An unexpected error occurred during generation.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slot-cream text-slot-charcoal font-sans selection:bg-slot-indigo selection:text-white flex flex-col relative overflow-hidden">
      
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 pt-32 pb-20 flex flex-col z-10">
        
        {/* Breadcrumb / Step Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs font-extrabold tracking-widest text-slot-indigo/40 mb-12"
        >
          <div className="flex items-center gap-2 text-slot-indigo pb-1 border-b-2 border-slot-orange">
            <span className="text-slot-orange">01</span> CREATE
          </div>
          <span className="hidden sm:inline opacity-50">—</span>
          <div className="hidden sm:flex items-center gap-2 pb-1">
            <span>02</span> CONSTRAINTS
          </div>
          <span className="hidden sm:inline opacity-50">—</span>
          <div className="hidden sm:flex items-center gap-2 pb-1">
            <span>03</span> OPTIMIZE
          </div>
          <span className="hidden sm:inline opacity-50">—</span>
          <div className="hidden sm:flex items-center gap-2 pb-1">
            <span>04</span> VERIFY
          </div>
        </motion.div>

        {/* Central Composition */}
        <div className="flex flex-col gap-8 md:gap-10">
          
          {/* Main Drop Zone */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full bg-white border border-slot-indigo/10 rounded-3xl p-10 md:p-16 flex flex-col items-center text-center relative hover:border-slot-indigo/30 transition-colors shadow-sm group"
          >
            {/* Subtle Document Motif */}
            <div className="w-20 h-20 bg-slot-cream rounded-full flex items-center justify-center mb-6 text-slot-indigo group-hover:scale-110 transition-transform duration-500 ease-out">
              <FileText size={36} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-slot-indigo mb-3">
              Import college data
            </h2>
            <p className="text-slot-charcoal/60 font-medium max-w-md mb-2">
              Upload your existing scheduling data or start with sample data.
            </p>
            <p className="text-slot-charcoal/40 text-sm mb-10 font-medium">
              Drop your file here
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <input 
                type="file"
                accept=".csv,.xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />

              {dataSource === 'file' && selectedFile ? (
                <div className="bg-green-50 text-green-700 border-2 border-green-200 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} className="text-green-600" />
                  <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating || dataSource === 'sample'}
                  className="bg-slot-indigo text-slot-cream px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slot-indigo/90 transition-all hover:shadow-paper-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={20} />
                  Upload Excel Workbook
                </button>
              )}
              
              {dataSource === 'sample' ? (
                <div className="bg-green-50 text-green-700 border-2 border-green-200 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} className="text-green-600" />
                  Sample Loaded
                </div>
              ) : (
                <button 
                  onClick={handleUseSampleData}
                  disabled={isGenerating || dataSource === 'file'}
                  className="bg-transparent text-slot-indigo border-2 border-slot-indigo/10 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slot-indigo/5 hover:border-slot-indigo/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use sample data
                </button>
              )}
            </div>
          </motion.div>

          {/* Compact Data Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap gap-px bg-slot-indigo/10 border border-slot-indigo/10 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Category 1 */}
            <div className="flex-1 w-full sm:w-[calc(50%-1px)] md:w-[calc(25%-1px)] min-w-[200px] bg-white p-6 flex flex-col justify-between min-h-[140px] hover:bg-slot-cream/30 transition-colors">
              <div>
                <h4 className="font-extrabold text-slot-indigo text-xs uppercase tracking-wider mb-2">Exams</h4>
                <p className="text-xs text-slot-charcoal/50 leading-relaxed font-medium">Subjects, duration and registrations</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slot-indigo/5">
                {dataSource === 'sample' ? (
                  <div className="text-slot-orange font-bold text-xl leading-none">3 <span className="text-sm font-medium text-slot-charcoal/60">subjects</span></div>
                ) : dataSource === 'file' ? (
                  <span className="text-slot-orange font-bold text-sm">Ready to parse</span>
                ) : (
                  <span className="text-slot-charcoal/40 text-xs font-semibold">No data yet</span>
                )}
              </div>
            </div>

            {/* Category 2 */}
            <div className="flex-1 w-full sm:w-[calc(50%-1px)] md:w-[calc(25%-1px)] min-w-[200px] bg-white p-6 flex flex-col justify-between min-h-[140px] hover:bg-slot-cream/30 transition-colors">
              <div>
                <h4 className="font-extrabold text-slot-indigo text-xs uppercase tracking-wider mb-2">Students</h4>
                <p className="text-xs text-slot-charcoal/50 leading-relaxed font-medium">Student groups and exam registrations</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slot-indigo/5">
                {dataSource === 'sample' ? (
                  <div className="text-slot-orange font-bold text-xl leading-none">5 <span className="text-sm font-medium text-slot-charcoal/60">students</span></div>
                ) : dataSource === 'file' ? (
                  <span className="text-slot-orange font-bold text-sm">Ready to parse</span>
                ) : (
                  <span className="text-slot-charcoal/40 text-xs font-semibold">No data yet</span>
                )}
              </div>
            </div>

            {/* Category 3 */}
            <div className="flex-1 w-full sm:w-[calc(50%-1px)] md:w-[calc(25%-1px)] min-w-[200px] bg-white p-6 flex flex-col justify-between min-h-[140px] hover:bg-slot-cream/30 transition-colors">
              <div>
                <h4 className="font-extrabold text-slot-indigo text-xs uppercase tracking-wider mb-2">Rooms</h4>
                <p className="text-xs text-slot-charcoal/50 leading-relaxed font-medium">Room capacity and availability</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slot-indigo/5">
                {dataSource === 'sample' ? (
                  <div className="text-slot-orange font-bold text-xl leading-none">2 <span className="text-sm font-medium text-slot-charcoal/60">rooms</span></div>
                ) : dataSource === 'file' ? (
                  <span className="text-slot-orange font-bold text-sm">Ready to parse</span>
                ) : (
                  <span className="text-slot-charcoal/40 text-xs font-semibold">No data yet</span>
                )}
              </div>
            </div>

            {/* Category 4 */}
            <div className="flex-1 w-full sm:w-[calc(50%-1px)] md:w-[calc(25%-1px)] min-w-[200px] bg-white p-6 flex flex-col justify-between min-h-[140px] hover:bg-slot-cream/30 transition-colors">
              <div>
                <h4 className="font-extrabold text-slot-indigo text-xs uppercase tracking-wider mb-2">Faculty</h4>
                <p className="text-xs text-slot-charcoal/50 leading-relaxed font-medium">Invigilators and availability</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slot-indigo/5">
                {dataSource === 'sample' ? (
                  <div className="text-slot-orange font-bold text-xl leading-none">2 <span className="text-sm font-medium text-slot-charcoal/60">faculty</span></div>
                ) : dataSource === 'file' ? (
                  <span className="text-slot-orange font-bold text-sm">Ready to parse</span>
                ) : (
                  <span className="text-slot-charcoal/40 text-xs font-semibold">No data yet</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700"
          >
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="font-medium text-sm leading-relaxed">{error}</p>
          </motion.div>
        )}

        {/* Action Area */}
        <div className="mt-10 md:mt-12 w-full flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="ml-auto flex items-center gap-4"
            style={{ marginLeft: 'auto' }}
          >
            {isGenerating && (
              <div className="text-slot-indigo/60 font-medium text-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Generating timetable...
              </div>
            )}
            
            <button 
              onClick={handleProceed}
              disabled={!dataLoaded || isGenerating}
              className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                dataLoaded && !isGenerating
                  ? 'bg-slot-orange text-white hover:bg-slot-orange/90 shadow-paper-hover hover:-translate-y-1'
                  : 'bg-slot-indigo/10 text-slot-indigo/50 cursor-not-allowed'
              }`}
            >
              {isGenerating ? 'Processing' : 'Continue'}
              {!isGenerating && <ArrowRight size={20} />}
            </button>
          </motion.div>
        </div>

      </main>
    </div>
  );
};

export default CreateTimetable;
