import React, { useRef, useState } from "react";
import axios from "axios";

export default function UploadImage() {
  const [selectedImages, setSelectedImages] = useState([]); // State to store local image previews
  const [imageFiles, setImageFiles] = useState([]); // State to store file objects for later upload

  // Handle image selection and preview with resizing
  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array

    const resizeAndCompressImages = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes

            // Scale down dimensions
            let width = img.width;
            let height = img.height;
            const maxDimension = 1920; // Adjust this based on desired max resolution

            if (width > height && width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            } else if (height > width && height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }

            // Set canvas dimensions and draw the image on it
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Adjust quality to fit within 10MB limit
            let quality = 0.9;
            let imageDataUrl = canvas.toDataURL("image/jpeg", quality);

            while (imageDataUrl.length > maxFileSize && quality > 0.1) {
              quality -= 0.1;
              imageDataUrl = canvas.toDataURL("image/jpeg", quality);
            }

            // Convert data URL back to File object for upload
            fetch(imageDataUrl)
              .then((res) => res.blob())
              .then((blob) => {
                const resizedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve({ preview: imageDataUrl, file: resizedFile });
              });
          };
        };
      });
    });

    Promise.all(resizeAndCompressImages).then((images) => {
      setSelectedImages(images.map((img) => img.preview));
      setImageFiles(images.map((img) => img.file));
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
