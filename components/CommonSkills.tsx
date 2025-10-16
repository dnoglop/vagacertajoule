import React from 'react';
import type { Skill } from '../types';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface CommonSkillsProps {
  skills: Skill[];
}

const CommonSkills: React.FC<CommonSkillsProps> = ({ skills }) => {
  const getImportanceClass = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'média':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section aria-labelledby="skills-title">
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <div className="flex items-center mb-4">
          <CheckBadgeIcon className="h-8 w-8 text-orange-500 mr-3" />
          <h2 id="skills-title" className="text-2xl font-bold text-gray-900">
            Habilidades em Comum
          </h2>
        </div>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center p-3 border rounded-lg bg-gray-50">
                 <span className="text-base font-semibold text-gray-800">{skill.skill}</span>
                 <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 ${getImportanceClass(skill.importance)}`}>
                    Importância: {skill.importance}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhuma habilidade em comum foi identificada com destaque.</p>
        )}
      </div>
    </section>
  );
};

export default CommonSkills;