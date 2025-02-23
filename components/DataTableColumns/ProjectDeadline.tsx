import { Project } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import React, { useState, useEffect, useMemo } from "react";

interface ProjectDeadlineProps {
  row: Row<Project>;
}

export default function ProjectDeadline({ row }: ProjectDeadlineProps) {
  const projectData = row.original;

  const [timelineStats, setTimelineStats] = useState({
    daysRemaining: 0,
    progressPercentage: 0,
    status: "",
    statusColor: "",
  });

  // ✅ Use useMemo to prevent recalculating endDate on every render
  const endDate = useMemo(() => calculateEndDate(projectData.startDate, projectData.deadline), [
    projectData.startDate,
    projectData.deadline,
  ]);

  

  useEffect(() => {
    const calculateTimeline = () => {
      if (!projectData.startDate || !projectData.deadline) return;

      const start = new Date(projectData.startDate);
      const end = endDate;
      const today = new Date();

      const totalDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const daysElapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const progressPercentage = Math.min(Math.round((daysElapsed / totalDuration) * 100), 100);

      let status = "";
      let statusColor = "";

      if (daysRemaining < 0) {
        status = "Project Deadline Passed";
        statusColor = "text-red-500";
      } else if (daysRemaining === 0) {
        status = "Deadline is today!";
        statusColor = "text-yellow-500";
      } else if (daysRemaining <= 7) {
        status = "Deadline approaching soon";
        statusColor = "text-orange-500";
      } else {
        status = "On track";
        statusColor = "text-green-500";
      }

      setTimelineStats({
        daysRemaining: Math.max(daysRemaining, 0),
        progressPercentage,
        status,
        statusColor,
      });
    };

    calculateTimeline();
    const interval = setInterval(calculateTimeline, 60 * 60 * 1000); // Update every hour

    return () => clearInterval(interval);
  }, [projectData.startDate, endDate]);

  return (
    <div>
      <p className={`font-semibold ${timelineStats.statusColor}`}>{timelineStats.status}</p>
      <p className="text-sm text-gray-600">Days Remaining: {timelineStats.daysRemaining}</p>
    </div>
  );
}

// ✅ Function to calculate actual deadline date (Weeks → Date)
const calculateEndDate = (startDate: string | Date, weeks: number): Date => {
  const start = new Date(startDate);
  start.setDate(start.getDate() + weeks * 1); // Convert weeks to days
  return start;
};
