"use client";

import { useApi } from "@/lib/helpers/ApiRequests";
import { toast } from "react-hot-toast";
import { useLoadingState } from "@/lib/hooks/useLoadingState";

export default function AdminUserCard({
  user,
  onDelete,
}: {
  user: any;
  onDelete: (id: string) => void;
}) {
  const { deleteUser } = useApi();
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${user.username}?`)) return;

    try {
      startLoading();
      await deleteUser(user._id);
      toast.success("User deleted successfully.");
      onDelete(user._id);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className=" border p-4 rounded-xl shadow-md  space-y-2 bg-white">
      <h3 className="text-lg font-semibold">{user.username}</h3>
      <p className="text-sm text-gray-600">{user.email}</p>
      <button
        onClick={handleDelete}
        className="text-red-600 text-sm hover:underline"
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete User"}
      </button>
    </div>
  );
}
