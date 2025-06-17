import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Copy, LoaderCircle, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { deleteUserModel, getUserModels } from "@/services/api";

type Model = {
  id: string;
  name: string;
  key: string;
  createdDate: string;
};

const ModelsList = () => {
  const [isCopied, setIsCopied] = useState(false);
  const queryClient = useQueryClient();
  const { data: models } = useQuery({
    queryKey: ["user-models"],
    queryFn: getUserModels,
    retry: 1,
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUserModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-models"] });
    },
    onError: (error) => {
      console.error("Error deleting model:", error);
      // Optionally, you can show a toast or alert to inform the user
    },
  });

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Models</h1>
        <Button
          className="border border-white bg-accent cursor-pointer text-white hover:bg-neutral-900"
          onClick={() => {}}
        >
          <Plus /> Add New Model
        </Button>
      </div>
      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models?.map((model: Model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell className="flex gap-2 items-center text-ellipsis">
                <p className="max-w-52 text-ellipsis overflow-hidden whitespace-nowrap">
                  {model.key}{" "}
                </p>
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() => handleCopyKey(model.key)}
                >
                  {isCopied ? <Check /> : <Copy />}
                </Button>
              </TableCell>
              <TableCell>{model.createdDate}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="cursor-pointer">
                      {isPending ? (
                        <LoaderCircle className="animate-[spin_2s_linear_infinite]" />
                      ) : (
                        <Trash2 className="text-red-800" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your model and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => mutate(model.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModelsList;
