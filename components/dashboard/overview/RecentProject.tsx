'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';

interface RecentProjectsProps {
  recentProjects?: Project[];
}

export default function RecentProjects({ recentProjects = [] }: RecentProjectsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 2; // Changed to 2 projects per page
  
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = recentProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(recentProjects.length / projectsPerPage) || 1;

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <Card>
      <CardContent>
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Recent Projects</h2>
      <p className="text-gray-600 mb-8">Explore our latest projects and see what we've been working on.</p>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {currentProjects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={project.thumbnail ?? '/placeholder.svg'}
                alt={project.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className="text-2xl font-bold">${project.budget?.toLocaleString() ?? 'N/A'}</span>
                  <a 
                    href={`/project/${project.slug}`}
                    className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-center"
                  >
                    View Project
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-center">
          Page {currentPage} of {totalPages} (Total Projects: {recentProjects.length})
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="w-full sm:w-auto bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    </CardContent>
    </Card>
  );
}