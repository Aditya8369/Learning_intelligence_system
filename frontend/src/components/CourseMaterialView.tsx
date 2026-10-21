import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Upload, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import type { CourseDocument, Topic } from '../types';
import { COURSE_DOCUMENTS } from '../data/mockData';

interface CourseMaterialViewProps {
  topics: Topic[];
  onOpenTutorForTopic: (topicName: string) => void;
}

export const CourseMaterialView: React.FC<CourseMaterialViewProps> = ({
  topics,
  onOpenTutorForTopic,
}) => {
  const [documents, setDocuments] = useState<CourseDocument[]>(COURSE_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || 'doc-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      const newDoc: CourseDocument = {
        id: `doc-${Date.now()}`,
        title: 'Distributed Systems & 2PC Consensus Notes',
        filename: 'Distributed_Transactions_Consensus.pdf',
        size: '3.8 MB',
        totalPages: 48,
        topicsCovered: ['acid_transactions', 'concurrency_serializability'],
        chunksCount: 84,
        status: 'indexed',
        summary: 'Coverage of distributed commits, Two-Phase Commit (2PC) protocol, Paxos, and replication consistency models.',
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDocId(newDoc.id);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/50 to-slate-900/60 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Course Ingestion & Semantic Retrieval Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Course Materials & Grounding Documents
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The tutor does not hallucinate from broad web data. All explanations and questions are mathematically
            indexed into semantic chunks directly extracted from your uploaded lecture notes and textbooks.
          </p>
        </div>
      </div>

      {/* Upload & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-glass)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syllabus passages, chapters, or concepts..."
            className="w-full bg-slate-900/80 text-white text-xs rounded-xl pl-10 pr-4 py-2.5 border border-[var(--border-glass)] focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleSimulateUpload}
          disabled={isUploading}
          className="btn btn-primary text-xs py-2.5 px-4 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Chunking & Generating Embeddings...' : 'Upload Course PDF / Notes'}</span>
        </button>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>New course notes successfully ingested! Extracted 84 text chunks and updated topic prerequisite linkages.</span>
        </div>
      )}

      {/* Documents Grid & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Document List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">
            Uploaded Documents ({documents.length})
          </div>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;

              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                      : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border-[var(--border-glass)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{doc.title}</h4>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate font-mono">
                          {doc.filename} • {doc.size}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      Indexed
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Document Detail & Ingested Chunks */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDoc && (
            <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-glass)] p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-glass)] pb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedDoc.title}</h3>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    {selectedDoc.totalPages} Pages • {selectedDoc.chunksCount} Semantic Chunks • Status: Fully Indexed
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-300 font-mono bg-indigo-950/40 px-3 py-1 rounded-xl border border-indigo-500/20">
                    pgvector ready
                  </span>
                </div>
              </div>

              {/* Document Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Document Syllabus Scope
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-[var(--border-glass)]">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Topics Linked */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Associated Learning Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDoc.topicsCovered.map((topicId) => {
                    const topic = topics.find((t) => t.id === topicId);
                    return (
                      <button
                        key={topicId}
                        onClick={() => topic && onOpenTutorForTopic(topic.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{topic ? topic.name : topicId}</span>
                        <ChevronRight className="w-3 h-3 text-indigo-400" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sample Chunks Inspection */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center justify-between">
                  <span>Sample Ingested Chunks & Metadata</span>
                  <span className="text-[10px] text-indigo-300 font-mono">1536-dim embeddings</span>
                </h4>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-[var(--border-glass)] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                      <span>Chunk #042 • Section 3.4.1 (Page 78)</span>
                      <span className="text-emerald-400">Cosine Match 0.94</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed italic">
                      "In SQL three-valued logic, logical predicates evaluate to TRUE, FALSE, or UNKNOWN. The WHERE clause of an SQL query strictly discards rows unless the qualification predicate evaluates to TRUE. Comparisons with NULL (such as col = NULL) evaluate to UNKNOWN and thus fail."
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-[var(--border-glass)] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                      <span>Chunk #089 • Section 4.2.3 (Page 112)</span>
                      <span className="text-emerald-400">Cosine Match 0.88</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed italic">
                      "A relation R is in Boyce-Codd Normal Form (BCNF) if and only if every non-trivial functional dependency X → Y satisfies the condition that X is a superkey of R. Unlike 3NF, BCNF eliminates all redundancy arising from functional dependencies."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
