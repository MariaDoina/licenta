export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: any }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl mt-10">
        Profile Page{" "}
        <span className="p-2 rounded bg-orange-500 text-black">{id}</span>
      </p>
    </div>
  );
}
