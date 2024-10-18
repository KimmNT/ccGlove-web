// import React, { useEffect, useRef, useState } from "react";

// export default function UploadImage() {
//   const cloudinaryRef = useRef();
//   const widgetRef = useRef();

//   const [uploadImages, setUploadImages] = useState([]);

//   useEffect(() => {
//     // Ensure Cloudinary library is available in the window object
//     cloudinaryRef.current = window.cloudinary;

//     // Create upload widget with correct parameters
//     widgetRef.current = cloudinaryRef.current.createUploadWidget(
//       {
//         cloudName: "dovp2f63c", // Your Cloudinary cloud name
//         uploadPreset: "do5bjhe9", // Corrected: uploadPreset (your preset)
//       },
//       function (error, result) {
//         if (result.event === "success") {
//           const newImage = {
//             imageURL: result.info.secure_url, // Store the image URL
//             isHomeHeadline: 0,
//             isContact: 0,
//             isHome: 0,
//             isAbout: 0,
//             isGallery: 0,
//           };
//           setUploadImages((prevUrls) => [...prevUrls, newImage]);
//         }
//         if (error) {
//           console.error("Upload Error:", error);
//         }
//       }
//     );
//   }, []);

//   return (
//     <div>
//       {uploadImages.map((image, index) => (
//         <div key={index}>
//           <img
//             src={image.imageURL}
//             alt="upload image"
//             width={200}
//             height={200}
//           />
//         </div>
//       ))}
//       <button onClick={() => widgetRef.current.open()}>Upload Image</button>
//     </div>
//   );
// }
import React, { useRef, useState } from "react";
import axios from "axios";

export default function UploadImage() {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [selectedImages, setSelectedImages] = useState([]); // State to store local image previews
  const [imageFiles, setImageFiles] = useState([]); // State to store file objects for later upload

  // Handle image selection and preview
  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    setImageFiles(files); // Store files for later upload

    const imagePreviews = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read the image as a data URL
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result); // Set the preview data
        };
      });
    });

    // Once all previews are loaded, set them to the state
    Promise.all(imagePreviews).then((previews) => {
      setSelectedImages(previews);
    });
  };

  // Handle the upload to Cloudinary
  const handleSubmit = () => {
    imageFiles.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "do5bjhe9"); // Your upload preset

      axios
        .post(
          "https://api.cloudinary.com/v1_1/dovp2f63c/image/upload",
          formData
        )
        .then((response) => {
          console.log("Image uploaded successfully:", response.data.secure_url);
        })
        .catch((error) => {
          console.error("Upload Error:", error);
        });
    });
  };

  return (
    <div>
      {/* Input to select images */}
      <input type="file" multiple onChange={handleImageSelection} />

      {/* Preview the selected images */}
      <div style={{ marginTop: "20px" }}>
        {selectedImages.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Preview ${index}`}
            style={{ margin: "10px", maxWidth: "200px", maxHeight: "200px" }}
          />
        ))}
      </div>

      {/* Submit button to upload images to Cloudinary */}
      {selectedImages.length > 0 && (
        <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
          Upload to Cloudinary
        </button>
      )}
    </div>
  );
}
