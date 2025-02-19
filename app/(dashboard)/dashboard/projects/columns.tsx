"use client";

import Image from "next/image";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import DateColumn from "@/components/DataTableColumns/DateColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InviteClient from "@/components/DataTableColumns/InviteClient";

export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableColumn column={column} title="Name" />,
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
        const project = row.original
        return (
          <p>{project.budget?.toLocaleString()}</p>
        )
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => {
        const project = row.original
        return (
          <p>{project.deadline}</p>
        )
    },
  },
  {
    accessorKey: "thumbnail",
    header: "Project Thumbnail",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="thumbnail" />,
  },

  {
    accessorKey: "startDate",
    header: "Project Start Date",
    cell: ({ row }) => <DateColumn row={row} accessorKey="startDate" />,
  },
  {
    accessorKey: "view",
    header: "View",
    cell: ({ row }) => {
      const project = row.original
      return (
        <Button size="sm">
        <Link href={`/project/${project.slug}`}>
        View
      </Link>
      </Button>
      )
    },
  },

  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <ActionColumn
          row={row}
          model="project"
          editEndpoint={`projects/update/${project.id}`}
          id={project.id}
        />
      );
    },
  },
];
