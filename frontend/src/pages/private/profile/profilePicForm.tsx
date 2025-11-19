import { useState } from "react";
import { useNavigate } from "react-router";
import { IoClose } from "react-icons/io5";
import type { ProfileData } from "../../../hook/useSendRequest";
const URL = import.meta.env.VITE_BACKEND_URL;

type ProfilePicFormProps = {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | undefined>>;
  showPicForm: boolean;
  showPicFormFunction: () => void;
};

function ProfilePicForm({
  profileData,
  setProfileData,
  showPicForm,
  showPicFormFunction,
}: ProfilePicFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleNewFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  async function newProfilePic(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("newFile", file);
    try {
      const response = await fetch(`${URL}/newProfilePic`, {
        method: "POST",

        credentials: "include",
        body: formData,
      });
      if (response.status === 401) {
        navigate("/");
        return;
      }
      if (!response.ok) {
        throw new Error("Error uploading profile pic");
      }
      const data = await response.json();
      setProfileData({ ...profileData, profilePic: data.imageUrl });
      setFile(null);
      showPicFormFunction();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className={
        showPicForm ? "profile-pic-container active" : "profile-pic-container"
      }
    >
      <button
        type="button"
        className="close-form-button"
        onClick={showPicFormFunction}
      >
        <IoClose />
      </button>
      <form
        className="profile-pic-form"
        action=""
        encType="multipart/form-data"
        onSubmit={newProfilePic}
      >
        <div>
          <label htmlFor="file">Image:</label>
          <input
            type="file"
            name="file"
            id="file"
            onChange={handleNewFile}
            required
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default ProfilePicForm;
