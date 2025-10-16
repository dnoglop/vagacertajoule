import React from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  CpuChipIcon,
  UsersIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/solid';
import type { Compatibility } from '../types';

interface CompatibilityScoreProps {
  compatibility: Compatibility;
}

const factorIcons: { [key: string]: React.ReactElement } = {
  'experiência profissional': <BriefcaseIcon className="h-6 w-6" />,
  'habilidades técnicas': <CpuChipIcon className="h-6 w-6" />,
  'habilidades interpessoais (soft skills)': <UsersIcon className="h-6 w-6" />,
  'formação/certificações': <AcademicCapIcon className="h-6 w-6" />,
};

const CompatibilityScore: React.FC<CompatibilityScoreProps> = ({ compatibility }) => {
  const { totalScore, feedback, breakdown, focusedImprovementSuggestions } = compatibility;

  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-orange-500';
    if (s >= 50) return 'text-orange-500';
    return 'text-orange-400';
  };

  const getProgressBarColor = (s: number) => {
    if (s >= 75) return 'bg-orange-500';
    if (s >= 50) return 'bg-orange-400';
    return 'bg-orange-300';
  };
  
  const getIconForFactor = (factor: string) => {
    const normalizedFactor = factor.toLowerCase();
    for (const key in factorIcons) {
        if (normalizedFactor.includes(key)) {
            return factorIcons[key];
        }
    }
    return <QuestionMarkCircleIcon className="h-6 w-6" />;
  };

  return (
    <section aria-labelledby="compatibility-title">
      <div className="space-y-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-center mb-2">
            <ChartBarIcon className="h-8 w-8 text-orange-500 mr-3" />
            <h2 id="compatibility-title" className="text-2xl font-bold text-gray-900">
              Compatibilidade Geral
            </h2>
          </div>
           <p className={`text-6xl font-extrabold my-2 ${getScoreColor(totalScore)}`}>
              {totalScore}%
            </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {feedback}
          </p>
        </div>
        
        {breakdown && breakdown.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Detalhamento da Pontuação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {breakdown.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className="flex-shrink-0 text-orange-500">
                            {getIconForFactor(item.factor)}
                        </div>
                        <h4 className="font-bold text-lg text-gray-800">{item.factor}</h4>
                      </div>
                       <span className={`font-bold text-2xl ${getScoreColor(item.score)}`}>{item.score}%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">{item.justification}</p>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${getProgressBarColor(item.score)} transition-all duration-1000 ease-out`} 
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {focusedImprovementSuggestions && focusedImprovementSuggestions.length > 0 && (
            <div className="mt-8">
                 <div className="flex items-center justify-center mb-4">
                    <ArrowTrendingUpIcon className="h-7 w-7 text-orange-500 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Foco para Melhoria</h3>
                </div>
                <div className="space-y-4">
                    {focusedImprovementSuggestions.map((item, index) => (
                        <div key={index} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                            <h4 className="font-bold text-lg text-orange-800">{item.area}</h4>
                            <p className="mt-1 text-gray-700">{item.suggestion}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </section>
  );
};

export default CompatibilityScore;
