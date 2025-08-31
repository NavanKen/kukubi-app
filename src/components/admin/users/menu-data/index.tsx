"use client";

interface MenuDataProps {
  search: string;
  limit: number;
  page: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteDialog from "../dialog/delete-dialog";
import EditDialog from "../dialog/edit-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useUsers } from "@/hooks/use-users";

const MenuData = ({
  search,
  limit,
  page,
  onPageChange,
  onLimitChange,
}: MenuDataProps) => {
  const { menuData, isLoading, total } = useUsers(search, limit, page);
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 dark:bg-neutral-800">
                <TableHead className="py-5">No</TableHead>
                <TableHead className="py-5">Id</TableHead>
                <TableHead className="py-5">Nama</TableHead>
                <TableHead className="py-5">Role</TableHead>
                <TableHead className="py-5 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="bg-neutral-50 dark:bg-neutral-900"
                  >
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-6 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-32 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-20 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-20 py-3" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-6 py-3" />
                    </TableCell>
                  </TableRow>
                ))
              ) : menuData.length === 0 ? (
                <TableRow className="bg-neutral-50 dark:bg-neutral-900">
                  <TableCell colSpan={5} className="text-center py-4">
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                menuData.map((menu, index) => (
                  <TableRow
                    key={index}
                    className="bg-neutral-50 dark:bg-neutral-900"
                  >
                    <TableCell className="py-3">{index + 1}</TableCell>
                    <TableCell className="py-3">{menu.id}</TableCell>
                    <TableCell className="py-3">{menu.name}</TableCell>
                    <TableCell className="py-3">
                      {menu.role === "admin" ? "Admin" : "Kasir"}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-3">
                        <EditDialog
                          data={{
                            id: menu.id,
                            name: menu.name,
                            role: menu.role,
                          }}
                        />

                        <DeleteDialog id={menu.id!} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center gap-2 justify-between mt-4 pb-7">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Limit
            </span>
            <Select
              value={String(limit)}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};
export default MenuData;
