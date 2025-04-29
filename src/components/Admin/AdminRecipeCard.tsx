"use client";

export default function AdminRecipeCard({ recipe }: { recipe: any }) {
  const handleDelete = async () => {
    if (!confirm(`Delete recipe: ${recipe.title}?`)) return;

    const res = await fetch(`/api/admin/recipes/${recipe._id}`, {
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
      <h3 className="font-semibold">{recipe.title}</h3>
      <p>Difficulty: {recipe.difficulty}</p>
      <button
        onClick={handleDelete}
        className="mt-2 text-sm text-red-600 hover:underline"
      >
        Delete Recipe
      </button>
    </div>
  );
}
