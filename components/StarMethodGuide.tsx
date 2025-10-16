import React from 'react';
import type { StarGuide } from '../types';
import { StarIcon } from '@heroicons/react/24/solid';

interface StarMethodGuideProps {
  starGuides: StarGuide[];
}

const StarMethodGuide: React.FC<StarMethodGuideProps> = ({ starGuides }) => {
  return (
    <section aria-labelledby="star-guide-title">
       <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
         <div className="flex items-center mb-4">
           <StarIcon className="h-8 w-8 text-orange-500 mr-3" />
           <h2 id="star-guide-title" className="text-2xl font-bold text-gray-900">
            Aplicando Melhorias (Método STAR)
           </h2>
         </div>
         <div className="space-y-6">
          {starGuides.length > 0 ? (
            starGuides.map((guide, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <h3 className="text-xl font-semibold p-4 bg-gray-100 text-gray-800">
                  {guide.suggestionTitle}
                </h3>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50">
                  <div className="p-3 bg-white rounded-md">
                    <p className="font-bold text-blue-600">S (Situação)</p>
                    <p className="text-gray-600">{guide.situation}</p>
                  </div>
                  <div className="p-3 bg-white rounded-md">
                    <p className="font-bold text-green-600">T (Tarefa)</p>
                    <p className="text-gray-600">{guide.task}</p>
                  </div>
                  <div className="p-3 bg-white rounded-md">
                    <p className="font-bold text-purple-600">A (Ação)</p>
                    <p className="text-gray-600">{guide.action}</p>
                  </div>
                  <div className="p-3 bg-white rounded-md">
                    <p className="font-bold text-yellow-600">R (Resultado)</p>
                    <p className="text-gray-600">{guide.result}</p>
                  </div>
                </div>
              </div>
            ))
           ) : (
              <p className="text-gray-600">Nenhum guia prático foi gerado.</p>
           )}
         </div>
       </div>
    </section>
  );
};

export default StarMethodGuide;