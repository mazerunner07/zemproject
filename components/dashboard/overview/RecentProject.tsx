'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentProjectsProps {
  recentProjects?: Project[];
}

export default function RecentProjects({ recentProjects = [] }: RecentProjectsProps) {
  console.log("Projects: ",recentProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 2; // Display 2 projects per page
  
  // Calculate the correct project indices for current page
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = recentProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(recentProjects.length / projectsPerPage) || 1;

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <Card className="w-full dark:bg-[#323232] shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Recent Projects</CardTitle>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore our latest projects and see what we've been working on.
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="bg-white dark:bg-[#121212] rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={project.thumbnail ?? '/placeholder.svg'}
                        alt={project.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 dark:text-white">{project.name}</h3>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${project.budget?.toLocaleString() ?? 'N/A'}
                        </span>
                        <Link
                          href={`/project/${project.slug}`}
                          className="w-full sm:w-auto bg-blue-500 dark:bg-[#1e1e1e] dark:hover:bg-[#333333] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-center"
                        >
                          View Project
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">No projects found.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {recentProjects.length > projectsPerPage && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="w-full sm:w-auto bg-gray-200 dark:bg-[#1e1e1e] dark:hover:bg-[#121212] text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300  transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-center dark:text-white">
                Page {currentPage} of {totalPages} (Total Projects: {recentProjects.length})
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto bg-gray-200 dark:bg-[#1e1e1e] dark:hover:bg-[#121212]  text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300  transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}