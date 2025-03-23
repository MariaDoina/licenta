"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

//Have a useEffect hook to directly display the information on the page when the use visits the page

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      // Not proper implementation
      console.log(error.message);
      toast.error("Failed to logout");
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/myUser");
    console.log(res.data);
    setData(res.data.data._id);
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Profile</h1>
      <hr />
      <p>Profile Page</p>
      <h2 className="p-3 rounded bg-green-500">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className="bg-purple-600 mt-4 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Get user Details
      </button>
    </div>
  );
}
