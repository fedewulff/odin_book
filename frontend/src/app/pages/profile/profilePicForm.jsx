import { useState } from "react"
import { useNavigate } from "react-router"
import { IoClose } from "react-icons/io5"
const URL = import.meta.env.VITE_BACKEND_URL

function ProfilePicForm({ profileData, setProfileData, showPicForm, showPicFormFunction }) {
  const [file, setFile] = useState(null)

  const handleNewFile = (event) => setFile(event.target.files[0])

  const formData = new FormData()
  formData.append("newFile", file)

  async function newProfilePic(e) {
    e.preventDefault()

    try {
      const response = await fetch(`${URL}/newProfilePic`, {
        method: "POST",

        credentials: "include",
        body: formData,
      })
      if (response.status === 401) {
        navigate("/")
        return
      }
      if (!response.ok) {
        throw new Error("Error uploading profile pic")
      }
      const data = await response.json()
      setProfileData({ ...profileData, profilePic: data.imageUrl })
      setFile(null)
      showPicFormFunction()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={showPicForm ? "profile-pic-container active" : "profile-pic-container"}>
      <button type="button" className="close-form-button" onClick={showPicFormFunction}>
        <IoClose />
      </button>
      <form className="profile-pic-form" action="" encType="multipart/form-data" onSubmit={newProfilePic}>
        <div>
          <label htmlFor="file">Image:</label>
          <input type="file" name="file" id="file" onChange={handleNewFile} required />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

export default ProfilePicForm
