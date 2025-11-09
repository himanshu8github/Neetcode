import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'wrong': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-yellow-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-blue-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'wrong': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'error': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-sky-500"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Submission History</h2>
      
      {submissions.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center">
          <p className="text-slate-400">No submissions found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-slate-900/50 border border-slate-800 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/80">
                  <th className="px-4 py-3 text-left text-sky-400 font-semibold">#</th>
                  <th className="px-4 py-3 text-left text-sky-400 font-semibold">Language</th>
                  <th className="px-4 py-3 text-left text-sky-400 font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sky-400 font-semibold">Runtime</th>
                  <th className="px-4 py-3 text-left text-sky-400 font-semibold">Memory</th>
                  <th className="px-4 py-3 text-left text-sky-400 font-semibold">Test Cases</th>
                  <th className="px-4 py-3 text-left text-sky-400 font-semibold">Submitted</th>
                  <th className="px-4 py-3 text-left text-sky-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-all">
                    <td className="px-4 py-3 text-slate-300 font-mono">{index + 1}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono">{sub.language}</td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-lg border ${getStatusBg(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        <span className="font-medium text-sm">
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-sm">{sub.runtime}s</td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-sm">{formatMemory(sub.memory)}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-sm">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{formatDate(sub.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button 
                        className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 rounded text-sm font-medium transition-all"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-400 mt-4">
            Showing <span className="text-sky-400 font-semibold">{submissions.length}</span> submissions
          </p>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-slate-900/95 border-b border-slate-800 p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-white mb-2">
                  Submission: {selectedSubmission.language}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-lg border text-sm ${getStatusBg(selectedSubmission.status)}`}>
                    {getStatusIcon(selectedSubmission.status)}
                    <span className="font-medium">
                      {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-mono">
                    Runtime: {selectedSubmission.runtime}s
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-mono">
                    Memory: {formatMemory(selectedSubmission.memory)}
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-mono">
                    {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}
                  </div>
                </div>
              </div>
              <button 
                className="text-slate-400 hover:text-white transition-all text-2xl"
                onClick={() => setSelectedSubmission(null)}
              >
                ✕
              </button>
            </div>
            
            {selectedSubmission.errorMessage && (
              <div className="m-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <p className="font-semibold mb-2">Error:</p>
                <p>{selectedSubmission.errorMessage}</p>
              </div>
            )}
            
            <div className="p-6">
              <p className="text-slate-400 text-sm mb-3">Code:</p>
              <pre className="p-4 bg-black border border-slate-800 rounded overflow-x-auto text-sm text-slate-300 font-mono">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;