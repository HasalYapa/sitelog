import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProjectContextType {
  projectTitle: string;
  setProjectTitle: (title: string) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  projectTitle: 'Downtown Plaza Phase 2',
  setProjectTitle: () => {},
});

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectTitle, setProjectTitleState] = useState<string>('Downtown Plaza Phase 2');

  useEffect(() => {
    const savedTitle = localStorage.getItem('project_title');
    if (savedTitle) {
      setProjectTitleState(savedTitle);
    }
  }, []);

  const setProjectTitle = (title: string) => {
    setProjectTitleState(title);
    localStorage.setItem('project_title', title);
  };

  return (
    <ProjectContext.Provider value={{ projectTitle, setProjectTitle }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
