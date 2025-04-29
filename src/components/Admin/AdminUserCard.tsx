"use client";

export default function AdminUserCard({ user }: { user: any }) {
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${user.username}?`)) return;

    const res = await fetch(`/api/admin/users/${user._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    alert(data.message || data.error);
    window.location.reload();
  };

  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="font-semibold">{user.username}</h3>
      <p>{user.email}</p>
      <button
        onClick={handleDelete}
        className="mt-2 text-sm text-red-600 hover:underline"
      >
        Delete User
      </button>
    </div>
  );
}
