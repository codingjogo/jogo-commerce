"use client";

import React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnVisibility,
			columnFilters,
		},
	});

	return (
		<>
		<Toaster 
			toastOptions={{
				duration: 2900
			}}
		/>
			<div className="flex items-center justify-between">
        {/* Search Input */}
				<div className="relative flex items-center py-4">
					<Input
						placeholder="Filter names..."
						value={
							(table
								.getColumn("name")
								?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table
								.getColumn("name")
								?.setFilterValue(event.target.value)
						}
						className="pl-10 max-w-sm shadow-md"
					/>

          <SearchIcon className="absolute left-2" />
				</div>

       <div className="flex gap-2">
					<Button type="button" variant={'outline'} asChild>
						<Link href={'/admin/inventory/featured-products'}>
							Featured Products
						</Link>
					</Button>

				 {/* Add Product Button */}
				 <Button type="button" asChild>
          <Link href={'/admin/inventory/create'}>
            <PlusCircleIcon />Add Product
          </Link>
        </Button>
			 </div>
			</div>
			<div className="rounded-md border mb-2">
				<Table>
					<TableHeader className="data-table-header">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-foreground"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="data-table-head"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</>
	);
}
