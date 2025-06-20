import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/Button";

import { useLoadingState } from "@/lib/hooks/useLoadingState";

type ProfileEditFormProps = {
  currentUsername: string;
  currentAbout: string;
  currentSpecialties: string[];
  currentProfileImage: string | null;
  onSave: (updatedData: {
    username: string;
    about: string;
    specialties: string[];
    profileImage: File | null;
  }) => void;
};

const ProfileEditForm = ({
  currentUsername,
  currentAbout,
  currentSpecialties,
  currentProfileImage,
  onSave,
}: ProfileEditFormProps) => {
  const [formData, setFormData] = useState<{
    username: string;
    about: string;
    specialties: string;
    profileImage: File | null;
  }>({
    username: currentUsername,
    about: currentAbout,
    specialties: currentSpecialties.join(", "),
    profileImage: null,
  });

  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.about.length > 500) {
      toast.error("About section cannot exceed 500 characters.");
      return;
    }

    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (specialtiesArray.length > 10) {
      toast.error("You can specify up to 10 specialties.");
      return;
    }

    try {
      startLoading();

      onSave({
        username: formData.username,
        about: formData.about,
        specialties: specialtiesArray,
        profileImage: formData.profileImage,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      stopLoading();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-6 mb-8"
    >
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="about">
          About
        </label>
        <textarea
          id="about"
          name="about"
          value={formData.about}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="specialties"
        >
          Cooking Specialties
        </label>
        <input
          type="text"
          id="specialties"
          name="specialties"
          value={formData.specialties}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="profileImage"
        >
          Profile Image
        </label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        {currentProfileImage && (
          <div className="mt-4">
            <img
              src={currentProfileImage}
              alt="Current profile"
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          </div>
        )}
      </div>

      <Button
        loading={isLoading}
        title="Save Changes"
        variant="bg-blue-500 text-white py-2 px-4 mt-4"
        type="submit"
      />
    </form>
  );
};

export default ProfileEditForm;
