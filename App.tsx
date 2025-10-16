import React, { useState, useCallback, useEffect, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { analyzeResume, searchForJobs } from './services/geminiService';
import type { AnalysisResult, SavedAnalysis, JobSuggestion } from './types';
import CompatibilityScore from './components/CompatibilityScore';
import CommonSkills from './components/CommonSkills';
import ImprovementSuggestions from './components/ImprovementSuggestions';
import StarMethodGuide from './components/StarMethodGuide';
import { 
  SparklesIcon, 
  DocumentTextIcon, 
  UserCircleIcon, 
  BriefcaseIcon,
  BookmarkIcon,
  ArchiveBoxIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  BoltIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  PhotoIcon
} from '@heroicons/react/24/outline';

declare const mammoth: any;
declare const pdfjsLib: any;

const STORAGE_KEY = 'jouleAcademySavedAnalyses';

const JouleLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img 
        src="https://academy.institutojoule.org/wp-content/uploads/2025/04/logo-3-e1759664774941.png"
        alt="Joule Academy Logo"
        className={`h-10 w-auto ${className}`}
    />
);

const Header: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => (
    <header className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <JouleLogo />
            <button 
                onClick={onCTAClick}
                className="bg-white/10 backdrop-blur-md text-white font-semibold py-2 px-5 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
                Testar Agora
            </button>
        </div>
    </header>
);

const HeroSection: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => {
    const [copyStatus, setCopyStatus] = useState('Compartilhar');

    const handleShare = useCallback(() => {
        navigator.clipboard.writeText('http://academy.institutojoule.org/vagacerta').then(() => {
            setCopyStatus('Link Copiado!');
            setTimeout(() => setCopyStatus('Compartilhar'), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            setCopyStatus('Erro ao copiar');
            setTimeout(() => setCopyStatus('Compartilhar'), 2000);
        });
    }, []);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden p-4">
            <div className="absolute inset-0 bg-[#0A0A0A] z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 items-center gap-12">
                <div className="text-left">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                        Deixe de ser só mais um. <br/>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                            Torne-se a escolha óbvia.
                        </span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-300">
                        Sua carreira não é um jogo de sorte. Use IA para analisar seu currículo contra qualquer vaga, receber um plano de melhorias e ainda encontrar as oportunidades certas para você.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <button 
                            onClick={onCTAClick}
                            className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Começar
                        </button>
                        <button 
                            onClick={handleShare}
                            className="bg-white/10 backdrop-blur-md text-white font-semibold py-3 px-8 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                            <LinkIcon className="h-5 w-5" />
                            {copyStatus}
                        </button>
                    </div>
                </div>

                <div className="hidden md:flex justify-center items-center h-96">
                    <div className="relative w-96 h-96">
                        {/* Central glowing orb */}
                        <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 bg-orange-500/30 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center">
                            <SparklesIcon className="h-16 w-16 text-orange-400 opacity-90 animate-pulse"/>
                        </div>

                        {/* Orbit 1 - CV */}
                        <div className="absolute inset-0 animate-spin-slow">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 p-3 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                                <DocumentTextIcon className="h-10 w-10 text-white"/>
                            </div>
                        </div>
                        
                        {/* Orbit 2 - Work */}
                        <div className="absolute inset-12 animate-spin-medium-reverse">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 p-3 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                                <BriefcaseIcon className="h-10 w-10 text-white"/>
                            </div>
                        </div>

                        {/* Orbit 3 - Future */}
                        <div className="absolute inset-4 animate-spin-slow-reverse">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2 p-3 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                                <RocketLaunchIcon className="h-10 w-10 text-white"/>
                            </div>
                        </div>

                        {/* Orbit 4 - Education */}
                        <div className="absolute inset-16 animate-spin-fast">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 ml-2 p-3 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                                <AcademicCapIcon className="h-10 w-10 text-white"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
                 <ChevronDownIcon className="h-8 w-8 text-white animate-bounce" />
            </div>
    </section>
)};

const HowItWorksSection: React.FC = () => (
    <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Como a Mágica Acontece?</h2>
            <p className="text-gray-400 text-lg mb-12">Em 4 passos, você transforma incerteza em estratégia.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left transform hover:-translate-y-2 transition-transform duration-300">
                    <CubeTransparentIcon className="h-10 w-10 text-orange-400 mb-4" />
                    <h3 className="font-bold text-xl text-white mb-2">1. Cole a Vaga dos Sonhos</h3>
                    <p className="text-gray-400">Pegue aquela descrição de vaga que parece impossível. Copie e cole. Sim, só isso.</p>
                </div>
                 <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left transform hover:-translate-y-2 transition-transform duration-300">
                    <BoltIcon className="h-10 w-10 text-orange-400 mb-4" />
                    <h3 className="font-bold text-xl text-white mb-2">2. Jogue Seu Currículo</h3>
                    <p className="text-gray-400">Agora, o seu currículo atual. Sem filtros, sem edições. Deixe a IA ver quem você é.</p>
                </div>
                 <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left transform hover:-translate-y-2 transition-transform duration-300">
                    <RocketLaunchIcon className="h-10 w-10 text-orange-400 mb-4" />
                    <h3 className="font-bold text-xl text-white mb-2">3. Receba o Dossiê</h3>
                    <p className="text-gray-400">Receba uma análise completa: sua nota, o que melhorar e como reescrever suas experiências para impressionar.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left transform hover:-translate-y-2 transition-transform duration-300">
                    <MagnifyingGlassIcon className="h-10 w-10 text-orange-400 mb-4" />
                    <h3 className="font-bold text-xl text-white mb-2">4. Encontre sua Vaga</h3>
                    <p className="text-gray-400">Após a análise, encontre vagas abertas e alinhadas com seu perfil, com links diretos para se candidatar.</p>
                </div>
            </div>
        </div>
    </section>
);

const JobSuggestionsComponent: React.FC<{ resume: string; jobDescription: string; }> = ({ resume, jobDescription }) => {
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!resume) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const results = await searchForJobs(resume, jobDescription);
      if (results.length === 0) {
        setError("Nenhuma vaga compatível foi encontrada no momento. Tente refinar seu currículo e buscar novamente.");
      }
      setSuggestions(results);
    } catch (err) {
      setError('Ocorreu um erro ao buscar as vagas. Por favor, tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [resume, jobDescription]);

  const getPlatformLogo = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return 'https://static.licdn.com/sc/h/al2o9zrvru7skd8hechagnumj';
    if (p.includes('gupy')) return 'https://s3.amazonaws.com/gupy5/production/companies/334/career/419/images/2021-08-11_15-46_logo.png';
    if (p.includes('infojobs')) return 'https://media.infojobs.com.br/static/media/infojobs-logo.269ee99c.svg';
    if (p.includes('99jobs')) return 'https://s3.amazonaws.com/gupy5/production/companies/567/career/1368/images/2022-05-18_17-25_logo.png';
    if (p.includes('vagas.com')) return 'https://media.vagas.com.br/logos/vagas-logo-azul.svg';
    if (p.includes('indeed')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Indeed_logo.svg/2560px-Indeed_logo.svg.png';
    if (p.includes('catho')) return 'https://static.catho.com.br/new-design/images/catho-logo-h-color.svg';
    return null;
  }

  return (
    <section aria-labelledby="job-suggestions-title" className="mt-12">
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-center">
                <MagnifyingGlassIcon className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h2 id="job-suggestions-title" className="text-2xl font-bold text-gray-900 mb-2">
                    Encontre Vagas Compatíveis
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Com base na sua análise, podemos buscar vagas abertas que se alinham ao seu perfil.
                </p>
                {!searched && (
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-bold text-base rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-orange-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Buscando...
                            </>
                        ) : (
                            <>
                                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                                Buscar Vagas Agora
                            </>
                        )}
                    </button>
                )}
            </div>

            {loading && searched && (
                <div className="text-center py-8">
                    <svg className="animate-spin mx-auto h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Buscando as melhores oportunidades para você...</p>
                </div>
            )}
            
            {error && !loading && (
                 <p className="mt-6 text-center text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>
            )}

            {!loading && suggestions.length > 0 && (
                <div className="mt-8 space-y-4">
                    {suggestions.map((job, index) => (
                        <a 
                            key={index} 
                            href={job.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block p-4 bg-gray-50 hover:bg-orange-50 border border-gray-200 rounded-lg transition-all duration-200 group"
                        >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 truncate" title={job.title}>{job.title}</h4>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                        <BuildingOffice2Icon className="h-4 w-4 flex-shrink-0" />
                                        <span>{job.company}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    {getPlatformLogo(job.platform) ? (
                                        <img src={getPlatformLogo(job.platform)!} alt={job.platform} className="h-6 max-w-[80px] object-contain" />
                                    ) : (
                                        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{job.platform}</span>
                                    )}
                                    <LinkIcon className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    </section>
  );
};

const AnalysisTool: React.FC = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFileParsing, setIsFileParsing] = useState(false);
    const [isOcrProcessing, setIsOcrProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showModalCloseButton, setShowModalCloseButton] = useState(false);

    const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
    const [showSavedList, setShowSavedList] = useState(false);

    useEffect(() => {
        try {
            const storedAnalyses = localStorage.getItem(STORAGE_KEY);
            if (storedAnalyses) {
                setSavedAnalyses(JSON.parse(storedAnalyses));
            }
        } catch (error) {
            console.error("Failed to load saved analyses from localStorage", error);
        }
    }, []);

    const runAnalysis = useCallback(async () => {
        if (!jobDescription.trim() || !resume.trim()) {
            setError('Por favor, preencha a descrição da vaga e o seu currículo.');
            return;
        }
        setError(null);
        setLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeResume(jobDescription, resume);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro ao analisar os dados. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [jobDescription, resume]);
    
    const handleAnalyzeClick = () => {
        if (!jobDescription.trim() || !resume.trim()) {
            setError('Por favor, preencha a descrição da vaga e o seu currículo.');
            return;
        }
        setError(null);
        setShowWarningModal(true);
        setShowModalCloseButton(false);
        setTimeout(() => {
            setShowModalCloseButton(true);
        }, 2000);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsOcrProcessing(true);
        setError(null);
        setJobDescription('Extraindo texto da imagem...');

        try {
            const worker = await Tesseract.createWorker('por');
            const { data: { text } } = await worker.recognize(file);
            setJobDescription(text);
            await worker.terminate();
        } catch (err) {
            console.error("Error processing image with OCR:", err);
            setError('Ocorreu um erro ao extrair o texto da imagem.');
            setJobDescription('');
        } finally {
            setIsOcrProcessing(false);
        }
        event.target.value = '';
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsFileParsing(true);
        setError(null);
        setResume('Processando arquivo...');

        try {
            const reader = new FileReader();
            if (file.name.endsWith('.docx')) {
                reader.onload = async (e) => {
                    const arrayBuffer = e.target?.result;
                    if (arrayBuffer) {
                        const result = await mammoth.extractRawText({ arrayBuffer });
                        setResume(result.value);
                    }
                    setIsFileParsing(false);
                };
                reader.readAsArrayBuffer(file);
            } else if (file.name.endsWith('.pdf')) {
                reader.onload = async (e) => {
                    const arrayBuffer = e.target?.result;
                    if (arrayBuffer) {
                        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer as ArrayBuffer) }).promise;
                        let fullText = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map((item: { str: string }) => item.str).join(' ');
                            fullText += pageText + '\n';
                        }
                        setResume(fullText);
                    }
                    setIsFileParsing(false);
                };
                reader.readAsArrayBuffer(file);
            } else {
                setError('Formato de arquivo não suportado. Use .pdf ou .docx');
                setResume('');
                setIsFileParsing(false);
            }
        } catch (err) {
            console.error("Error parsing file:", err);
            setError('Ocorreu um erro ao ler o arquivo.');
            setResume('');
            setIsFileParsing(false);
        }

        event.target.value = '';
    };
    
    const handleSaveAnalysis = useCallback(() => {
        if (!analysisResult || !jobDescription || !resume) return;

        const newSave: SavedAnalysis = {
            id: Date.now().toString(),
            savedAt: new Date().toLocaleString('pt-BR'),
            analysisResult,
            jobDescription,
            resume,
        };

        const updatedAnalyses = [newSave, ...savedAnalyses];
        setSavedAnalyses(updatedAnalyses);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
        alert('Análise salva com sucesso!');
    }, [analysisResult, jobDescription, resume, savedAnalyses]);

    const handleLoadAnalysis = useCallback((id: string) => {
        const analysisToLoad = savedAnalyses.find(a => a.id === id);
        if (analysisToLoad) {
            setJobDescription(analysisToLoad.jobDescription);
            setResume(analysisToLoad.resume);
            setAnalysisResult(analysisToLoad.analysisResult);
            setError(null);
            setShowSavedList(false);
        }
    }, [savedAnalyses]);

    const handleDeleteAnalysis = useCallback((id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta análise?')) {
        const updatedAnalyses = savedAnalyses.filter(a => a.id !== id);
        setSavedAnalyses(updatedAnalyses);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnalyses));
        }
    }, [savedAnalyses]);

    const handleStartOver = useCallback(() => {
        setJobDescription('');
        setResume('');
        setAnalysisResult(null);
        setError(null);
    }, []);

    const handleConfirmAnalysis = useCallback(() => {
        setShowWarningModal(false);
        setShowModalCloseButton(false);
        runAnalysis();
    }, [runAnalysis]);

    const handleCloseModal = useCallback(() => {
        setShowWarningModal(false);
        setShowModalCloseButton(false);
    }, []);

    const handleDownloadReport = useCallback(() => {
        if (!analysisResult) return;

        let reportContent = `Relatório de Análise - Joule Academy\n`;
        reportContent += `========================================\n\n`;
        reportContent += `COMPATIBILIDADE GERAL: ${analysisResult.compatibility.totalScore}%\n`;
        reportContent += `Feedback: ${analysisResult.compatibility.feedback}\n\n`;
        reportContent += `DETALHAMENTO DA COMPATIBILIDADE\n---------------------------------\n`;
        if (analysisResult.compatibility.breakdown && analysisResult.compatibility.breakdown.length > 0) {
            analysisResult.compatibility.breakdown.forEach(factor => {
                reportContent += `- ${factor.factor}: ${factor.score}%\n  Justificativa: ${factor.justification}\n\n`;
            });
        }
        if (analysisResult.compatibility.focusedImprovementSuggestions && analysisResult.compatibility.focusedImprovementSuggestions.length > 0) {
            reportContent += `SUGESTÕES FOCADAS (PONTO DE MELHORIA)\n-------------------------------------------\n`;
            analysisResult.compatibility.focusedImprovementSuggestions.forEach(suggestion => {
                reportContent += `Área: ${suggestion.area}\nSugestão: ${suggestion.suggestion}\n\n`;
            });
        }
        reportContent += `HABILIDADES EM COMUM\n--------------------\n`;
        if (analysisResult.commonSkills.length > 0) {
            analysisResult.commonSkills.forEach(skill => {
                reportContent += `- ${skill.skill} (Importância: ${skill.importance})\n`;
            });
        } else {
            reportContent += `Nenhuma habilidade em comum identificada.\n`;
        }
        reportContent += `\n`;
        reportContent += `SUGESTÕES DE MELHORIA (GERAL)\n------------------------------\n`;
        if (analysisResult.improvementSuggestions.length > 0) {
            analysisResult.improvementSuggestions.forEach(suggestion => {
                reportContent += `Área: ${suggestion.area}\nSugestão: ${suggestion.suggestion}\n\n`;
            });
        }
        reportContent += `APLICANDO MELHORIAS (MÉTODO STAR)\n------------------------------------\n`;
        if (analysisResult.starMethodGuides.length > 0) {
            analysisResult.starMethodGuides.forEach(guide => {
                reportContent += `Para a sugestão: "${guide.suggestionTitle}"\n  S (Situação): ${guide.situation}\n  T (Tarefa): ${guide.task}\n  A (Ação): ${guide.action}\n  R (Resultado): ${guide.result}\n\n`;
            });
        }
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio-joule-academy.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [analysisResult]);

    return (
        <section id="tool" className="py-24 px-4 bg-gray-50 text-gray-800">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                            <div className="flex-shrink-0">
                                <div className="p-5 bg-orange-100 rounded-full">
                                    <BriefcaseIcon className="h-16 w-16 text-orange-500" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">Analisador de Vaga</h1>
                                <p className="mt-3 text-lg text-gray-600">
                                    Chegou a hora. Cole a vaga e seu currículo para receber a análise completa.
                                </p>
                            </div>
                        </div>
                        
                        {savedAnalyses.length > 0 && (
                            <div className="flex-shrink-0">
                                <button onClick={() => setShowSavedList(true)} className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-100 transition-all">
                                    <ArchiveBoxIcon className="h-5 w-5 mr-2" />
                                    Análises Salvas
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="job-description" className="flex items-center text-lg font-semibold text-gray-700">
                                <DocumentTextIcon className="h-6 w-6 mr-2 text-orange-500" />
                                Descrição da Vaga
                            </label>
                            <label htmlFor="job-image-upload" className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-wait" aria-disabled={isOcrProcessing}>
                                <PhotoIcon className="h-5 w-5 mr-1" />
                                {isOcrProcessing ? 'Lendo imagem...' : 'Enviar Print'}
                            </label>
                            <input
                                id="job-image-upload"
                                type="file"
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleImageUpload}
                                disabled={isOcrProcessing}
                            />
                        </div>
                        <textarea
                            id="job-description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Cole aqui a descrição da vaga ou envie um print"
                            className="w-full h-96 p-4 rounded-lg border-2 border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 resize-none text-base shadow-sm"
                            aria-label="Descrição da Vaga"
                        />
                    </div>
                    <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="resume" className="flex items-center text-lg font-semibold text-gray-700">
                        <UserCircleIcon className="h-6 w-6 mr-2 text-orange-500" />
                        Seu Currículo
                        </label>
                        <label htmlFor="resume-upload" className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-wait" aria-disabled={isFileParsing}>
                        <ArrowUpTrayIcon className="h-5 w-5 mr-1" />
                        {isFileParsing ? 'Carregando...' : 'Carregar PDF/DOCX'}
                        </label>
                        <input
                            id="resume-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            disabled={isFileParsing}
                        />
                    </div>
                    <textarea
                        id="resume"
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                        placeholder="Cole seu currículo ou carregue um arquivo"
                        className="w-full h-96 p-4 rounded-lg border-2 border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 resize-none text-base shadow-sm"
                        aria-label="Seu Currículo"
                    />
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-4">
                    <button
                    onClick={handleAnalyzeClick}
                    disabled={loading || isFileParsing || isOcrProcessing}
                    className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-orange-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                    {loading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analisando...
                        </>
                    ) : (
                        <>
                        <SparklesIcon className="h-6 w-6 mr-2" />
                        Analisar
                        </>
                    )}
                    </button>
                </div>

                {error && <p className="mt-6 text-red-600 w-full text-center text-lg">{error}</p>}

                {analysisResult && (
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-200">
                        <div className="mb-12 py-6 bg-gray-50 rounded-xl flex flex-wrap justify-center items-center gap-4 border border-gray-200">
                            <button onClick={handleSaveAnalysis} className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold text-base rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                                <BookmarkIcon className="h-5 w-5 mr-2" /> Salvar Análise
                            </button>
                            <button onClick={handleDownloadReport} className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold text-base rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                                <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Baixar Relatório
                            </button>
                            <button onClick={handleStartOver} className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-100 text-orange-600 font-semibold text-base rounded-lg hover:bg-orange-200 transition-all transform hover:scale-105">
                                <ArrowPathIcon className="h-5 w-5 mr-2" /> Fazer Nova Análise
                            </button>
                        </div>
                        <div className="space-y-12">
                            <CompatibilityScore compatibility={analysisResult.compatibility} />
                            <CommonSkills skills={analysisResult.commonSkills} />
                            <ImprovementSuggestions suggestions={analysisResult.improvementSuggestions} />
                            <StarMethodGuide starGuides={analysisResult.starMethodGuides} />
                            <JobSuggestionsComponent resume={resume} jobDescription={jobDescription} />
                        </div>
                    </div>
                )}
            </div>
            {showSavedList && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 text-gray-800" role="dialog" aria-modal="true" aria-labelledby="saved-analyses-title">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-3xl max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h3 id="saved-analyses-title" className="text-2xl font-bold text-gray-900">Análises Salvas</h3>
                            <button onClick={() => setShowSavedList(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Fechar">
                            <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto space-y-4">
                            {savedAnalyses.length > 0 ? (
                                savedAnalyses.map(item => (
                                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 truncate" title={item.jobDescription}>{item.jobDescription.substring(0, 80)}...</p>
                                            <p className="text-sm text-gray-500">Salvo em: {item.savedAt}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button onClick={() => handleLoadAnalysis(item.id)} className="p-2 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors" title="Carregar">
                                                <ArrowUturnLeftIcon className="h-5 w-5 text-orange-600" />
                                            </button>
                                            <button onClick={() => handleDeleteAnalysis(item.id)} className="p-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors" title="Excluir">
                                                <TrashIcon className="h-5 w-5 text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 py-8">Nenhuma análise salva encontrada.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showWarningModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 text-gray-800" role="dialog" aria-modal="true" aria-labelledby="warning-modal-title">
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg text-center transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-in">
                        {showModalCloseButton && (
                            <button 
                                onClick={handleCloseModal} 
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors" 
                                aria-label="Fechar"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        )}
                        <SparklesIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                        <h3 id="warning-modal-title" className="text-2xl font-bold text-gray-900">Atenção!</h3>
                        <p className="mt-4 text-lg text-gray-600">
                            O resultado é apenas uma analise da IA. Refaça pelo menos 3x o processo e encontre os padrões de resposta. <span className="font-bold">O ouro está ali.</span>
                        </p>
                        <div className="mt-8">
                            <button 
                                onClick={handleConfirmAnalysis}
                                className="w-full inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-bold text-base rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
                            >
                                Entendi, Analisar Agora
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

const Footer: React.FC = () => (
    <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
            <JouleLogo className="mx-auto mb-4" />
            <div className="flex justify-center gap-6 mb-4">
                <a href="https://academy.institutojoule.org/cursos/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    Conheça nossos cursos
                </a>
                <a href="https://institutojoule.org/instituto" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    Conheça o Instituto
                </a>
            </div>
            <p>&copy; 2025 Joule Academy. Mais do que cursos, somos um movimento.</p>
        </div>
    </footer>
)

const App: React.FC = () => {
    const toolRef = useRef<HTMLElement>(null);

    const handleCTAClick = () => {
        toolRef.current?.scrollIntoView({ behavior: 'smooth' });
    };



    return (
        <div className="bg-[#0A0A0A] text-gray-300 font-sans animate-fade-in" style={{fontFamily: "'Inter', sans-serif"}}>
            <Header onCTAClick={handleCTAClick} />
            <main>
                <HeroSection onCTAClick={handleCTAClick} />
                <HowItWorksSection />
                <div ref={toolRef}>
                    <AnalysisTool />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;