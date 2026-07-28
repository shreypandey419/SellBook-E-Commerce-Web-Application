import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import apiClient from "../api/client";

function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    rating: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadProgress(0);
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    selectImage(event.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      let image = "";

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const { data: uploadResponse } = await apiClient.post(
          "/api/books/upload",
          uploadData,
          {
            onUploadProgress: (event) => {
              if (!event.total) return;
              setUploadProgress(Math.round((event.loaded * 100) / event.total));
            },
          }
        );

        image = `${apiClient.defaults.baseURL}${uploadResponse.image}`;
      }

      const { data } = await apiClient.post(
        "/api/books",
        {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          rating: Number(formData.rating),
          image,
        }
      );

      if (data.success) {
        toast.success("Book Added Successfully 📚");

        setFormData({
          title: "",
          author: "",
          category: "",
          description: "",
          price: "",
          stock: "",
          rating: "",
        });
        removeImage();
      }
    } catch {
      toast.error("Failed to add book");
    }

    setLoading(false);
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8"
    >
      <h1 className="text-3xl font-bold mb-6">
        Add New Book
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <input
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <input
          name="rating"
          type="number"
          step="0.1"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <div className="md:col-span-2">
          <label
            htmlFor="book-image"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-center transition hover:border-blue-500 hover:bg-blue-100"
          >
            <FaCloudUploadAlt className="mb-2 text-3xl text-blue-600" />
            <span className="font-medium text-gray-700">Drop a cover image here or click to browse</span>
            <span className="mt-1 text-sm text-gray-500">PNG, JPG, WEBP up to 5 MB</span>
            <input
              id="book-image"
              type="file"
              accept="image/*"
              onChange={(event) => selectImage(event.target.files[0])}
              className="sr-only"
            />
          </label>

          {imagePreview && (
            <div className="relative mt-4 flex items-center gap-4 rounded-lg border p-3">
              <img src={imagePreview} alt="Selected book cover preview" className="h-24 w-16 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{imageFile?.name}</p>
                <p className="text-sm text-gray-500">{Math.ceil((imageFile?.size || 0) / 1024)} KB</p>
                {loading && imageFile && (
                  <div className="mt-2 h-2 overflow-hidden rounded bg-gray-200">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>
              <button type="button" onClick={removeImage} className="p-2 text-red-600 hover:text-red-800" aria-label="Remove selected image">
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          className="border rounded-lg p-3 md:col-span-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </Motion.div>
  );
}

export default AddBook;
