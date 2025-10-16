import React from 'react';
import type { Suggestion } from '../types';
import { LightBulbIcon } from '@heroicons/react/24/solid';

interface ImprovementSuggestionsProps {
  suggestions: Suggestion[];
}

const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({ suggestions }) => {
  return (
    <section aria-labelledby="suggestions-title">
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <LightBulbIcon className="h-8 w-8 text-orange-500 mr-3" />
          <h2 id="suggestions-title" className="text-2xl font-bold text-gray-900">
            Sugestões de Melhoria
          </h2>
        </div>
        <div className="space-y-4">
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <div key={index} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h3 className="font-bold text-lg text-orange-800">{item.area}</h3>
                <p className="mt-1 text-gray-700">{item.suggestion}</p>
              </div>
            ))
          ) : (
             <p className="text-gray-600">Nenhuma sugestão de melhoria específica foi gerada.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImprovementSuggestions;