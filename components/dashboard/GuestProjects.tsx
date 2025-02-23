'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { GuestProject } from '@prisma/client';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function GuestProjects({ projects, isOwner = false }: { projects: GuestProject[], isOwner?: boolean }) {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchGuestProjects() {
      try {
        setLoading(true);
        const response = await fetch('/api/guest-projects');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
      } catch (error) {
        console.error('Error fetching guest projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGuestProjects();
  }, []);

  return (
    <div className="flex flex-col bg-gray-100 rounded-lg w-full h-full dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isOwner ? "Members" : "Guest Projects"}
        </h1>
        <h2 className="text-sm text-gray-500">
          {isOwner
            ? "These are Members You have Invited to Collaborate with"
            : "These are Projects You Have been Invited to Collaborate"}
        </h2>
      </div>
      
      {loading ? (
        <div className="min-h-screen min-w-full flex items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <p>You don't have any members</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => {
            const link = project.projectLink.split("=")[1]; // Moved inside the function scope
            console.log(link)
            return (
              <div 
                key={index} 
                className="flex md:flex-row justify-between items-center md:items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {project.projectName}
                  </h2>
                  {isOwner ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Member: {project.guestName}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      From: {project.projectOwner}
                    </p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-4">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                    <Link className="flex items-center justify-center" href={link}>
                      View Project
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
