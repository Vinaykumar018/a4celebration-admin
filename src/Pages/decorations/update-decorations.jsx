// import { useEffect, useState, useCallback } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from "react-router-dom";
// import { fetchProductById, modifyProduct } from '../../redux/decorationSlice';
// import { fetchCategories } from '../../redux/categoriesSlice';
// import { FaRupeeSign } from "react-icons/fa";
// import RichTextEditor from "react-rte";

// const UpdateDecorations = () => {
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const { currentProduct, loading, error } = useSelector((state) => state.products);
//   const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

//   const [availableChildCategories, setAvailableChildCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     product_id: "",
//     name: "",
//     slug_url: "",
//     description: RichTextEditor.createEmptyValue(),
//     short_description: "",
//     category: "",
//     category_name: "",
//     price: "",
//     mrp_price: "",
//     unit: "pcs",
//     stock_left: "",
//     isOffer: false,
//     status: "active",
//     featured_image: null,
//     other_images: [],
//     child_categories: []
//   });

//   const [imagePreviews, setImagePreviews] = useState({
//     featured: null,
//     others: []
//   });

//   // Fetch product and categories data
//   useEffect(() => {
//     if (id) {
//       dispatch(fetchProductById(id));
//       dispatch(fetchCategories());
//     }
//   }, [dispatch, id]);

//   // Update form data when currentProduct changes
//   useEffect(() => {
//     if (currentProduct) {
//       setFormData(prev => ({
//         ...prev,
//         product_id: currentProduct.product_id || "",
//         name: currentProduct.name || "",
//         slug_url: currentProduct.slug_url || "",
//         description: RichTextEditor.createValueFromString(currentProduct.description, 'html') || "",
//         short_description: currentProduct.short_description || "",
//         category: currentProduct.category || "",
//         category_name: currentProduct.category_name || "",
//         price: currentProduct.price || "",
//         mrp_price:currentProduct.mrp_price || "",
//         unit: currentProduct.unit || "pcs",
//         stock_left: currentProduct.stock_left || "",
//         isOffer: currentProduct.isOffer || false,
//         status: currentProduct.status || "active",
//         child_categories: currentProduct.child_categories || []
//       }));

//       setImagePreviews({
//         featured: currentProduct.featured_image
//           ? `https://a4celebration.com/api/${currentProduct.featured_image}`
//           : null,
//         others: currentProduct.other_images?.length > 0
//           ? currentProduct.other_images.map(img => `https://a4celebration.com/api/${img}`)
//           : []
//       });

//       // Find and set available child categories if category is already selected
//       if (currentProduct.category) {
//         const selectedCategory = categories.find(cat => cat._id === currentProduct.category);
//         if (selectedCategory) {
//           const childCategories = selectedCategory.child_category
//             ? Object.entries(selectedCategory.child_category).map(([id, child]) => ({
//               id,
//               name: child.name,
//               image: child.image
//             }))
//             : [];
//           setAvailableChildCategories(childCategories);
//         }
//       }
//     }
//   }, [currentProduct, categories]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // Handle category selection from dropdown
//   const handleCategoryChange = (e) => {
//     const selectedCategoryId = e.target.value;
//     const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);

//     if (selectedCategory) {
//       // Convert the Map-like child_category object to an array
//       const childCategories = selectedCategory.child_category
//         ? Object.entries(selectedCategory.child_category).map(([id, child]) => ({
//           id,
//           name: child.name,
//           image: child.image
//         }))
//         : [];

//       setAvailableChildCategories(childCategories);

//       setFormData(prev => ({
//         ...prev,
//         category: selectedCategory._id,
//         category_name: selectedCategory.category_name,
//         child_categories: [] // Reset child categories when parent changes
//       }));
//     }
//   };

//   // Handle child category selection
//   const handleChildCategoryChange = (e) => {
//     const selectedOptions = Array.from(e.target.selectedOptions);
//     const selectedChildren = selectedOptions.map(option => ({
//       id: option.value,
//       name: option.label
//     }));

//     setFormData(prev => ({
//       ...prev,
//       child_categories: selectedChildren
//     }));
//   };

//   const handleFeaturedImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData(prev => ({
//         ...prev,
//         featured_image: file
//       }));
//       setImagePreviews(prev => ({
//         ...prev,
//         featured: URL.createObjectURL(file)
//       }));
//     }
//   };

//   const handleOtherImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       setFormData(prev => ({
//         ...prev,
//         other_images: [...prev.other_images, ...files]
//       }));
//       setImagePreviews(prev => ({
//         ...prev,
//         others: [...prev.others, ...files.map(file => URL.createObjectURL(file))]
//       }));
//     }
//   };

//   // Generate slug from product name
//   useEffect(() => {
//     if (formData.name) {
//       const generatedSlug = formData.name
//         .toLowerCase()
//         .replace(/[^\w\s]/gi, '')
//         .replace(/\s+/g, '-')
//         .replace(/-+/g, '-');

//       setFormData(prev => ({
//         ...prev,
//         slug_url: generatedSlug
//       }));
//     }
//   }, [formData.name]);

//   const removeOtherImage = useCallback((index) => {
//     setFormData(prev => {
//       const newOtherImages = [...prev.other_images];
//       const removedImage = newOtherImages.splice(index, 1)[0];

//       // Clean up object URL if it exists
//       if (removedImage instanceof Blob) {
//         URL.revokeObjectURL(URL.createObjectURL(removedImage));
//       }

//       return { ...prev, other_images: newOtherImages };
//     });

//     setImagePreviews(prev => {
//       const newOtherPreviews = [...prev.others];
//       const removedPreview = newOtherPreviews.splice(index, 1)[0];

//       // Clean up object URL
//       if (removedPreview.startsWith('blob:')) {
//         URL.revokeObjectURL(removedPreview);
//       }

//       return { ...prev, others: newOtherPreviews };
//     });
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();

//       // Convert RichTextEditor content to HTML string
//       const descriptionHTML = formData.description.toString('html');

//       // Append all form fields
//       data.append('product_id', formData.product_id);
//       data.append('name', formData.name);
//       data.append('slug_url', formData.slug_url);
//       data.append('description', descriptionHTML);
//       data.append('short_description', formData.short_description);
//       data.append('category', formData.category);
//       data.append('category_name', formData.category_name);
//       data.append('price', formData.price);
//       data.append('mrp_price', formData.mrp_price);
//       data.append('unit', formData.unit);
//       data.append('stock_left', formData.stock_left);
//       data.append('isOffer', formData.isOffer);
//       data.append('status', formData.status);

//       // Handle child categories
//       if (formData.child_categories.length > 0) {
//         data.append('child_categories', JSON.stringify(formData.child_categories));
//       }

//       // Handle images
//       if (formData.featured_image) {
//         data.append('featured_image', formData.featured_image);
//       }

//       formData.other_images.forEach(file => {
//         data.append('other_images', file);
//       });

//       await dispatch(modifyProduct({ id, formData: data })).unwrap();
//       toast.success("Product updated successfully!");
//     } catch (error) {
//       console.error("Update product error:", error);
//       toast.error(error.message || "Failed to update product");
//     }
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="text-center py-8">
//       <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
//         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         Error: {error}
//       </div>
//     </div>
//   );

//   const handleEditorChange = (value, fieldName) => {
//     setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
//   };

//   return (
//     <div className="mt-4 px-4 sm:px-6 lg:px-8">
//       <ToastContainer position="top-center" autoClose={3000} />
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h4 className="text-xl font-semibold text-center mb-6">Update Product</h4>

//         <form onSubmit={handleSubmit}>
//           {/* Product Name and Slug */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Product Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g. Rose Gold Decorations"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Slug URL
//               </label>
//               <input
//                 type="text"
//                 name="slug_url"
//                 value={formData.slug_url}
//                 onChange={handleChange}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//                 placeholder="Auto-generated from product name"
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Category Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Category <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleCategoryChange}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 required
//                 disabled={categoriesLoading}
//               >
//                 <option value="">Select a category</option>
//                 {categoriesLoading ? (
//                   <option>Loading categories...</option>
//                 ) : (
//                   categories.map((category) => (
//                     <option key={category._id} value={category._id}>
//                       {category.category_name}
//                     </option>
//                   ))
//                 )}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Category Name
//               </label>
//               <input
//                 type="text"
//                 name="category_name"
//                 value={formData.category_name}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Child Category Selection */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Child Categories (Optional)
//             </label>
//             <select
//               multiple
//               size={Math.min(availableChildCategories.length, 4)}
//               name="child_categories"
//               value={formData.child_categories.map(child => child.id)}
//               onChange={handleChildCategoryChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               disabled={!formData.category || availableChildCategories.length === 0}
//             >
//               {availableChildCategories.length > 0 ? (
//                 availableChildCategories.map((child) => (
//                   <option key={child.id} value={child.id}>
//                     {child.name}
//                   </option>
//                 ))
//               ) : (
//                 <option disabled>No child categories available</option>
//               )}
//             </select>
//             {formData.child_categories.length > 0 && (
//               <div className="mt-2">
//                 <p className="text-sm text-gray-600">Selected:</p>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {formData.child_categories.map((child, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//                     >
//                       {child.name}
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setFormData(prev => ({
//                             ...prev,
//                             child_categories: prev.child_categories.filter(c => c.id !== child.id)
//                           }));
//                         }}
//                         className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
//                       >
//                         <span className="sr-only">Remove</span>
//                         <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                         </svg>
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <p className="mt-1 text-sm text-gray-500">
//               {availableChildCategories.length > 0
//                 ? "Hold Ctrl/Cmd to select multiple"
//                 : "Select a category first"}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// <div>
//             <label className="block text-sm font-medium text-gray-700">
//                 MRP Price <span className="text-red-500">*</span>
//               </label>
//               <div className="relative mt-1 rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-500 sm:text-sm"><FaRupeeSign></FaRupeeSign></span>
//                 </div>
//                 <input
//                   type="number"
//                   name="mrp_price"
//                   value={formData.mrp_price}
//                   onChange={handleChange}
//                   onKeyDown={(e) => {
//                     // Block: '-', 'e', 'E', '+', '.'
//                     if (['-', 'e', 'E', '+', '.'].includes(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="0"
//                   min="0"
//                   step="1"  // Ensures only whole numbers
//                   required

//                 />
//               </div>
//               </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Price <span className="text-red-500">*</span>
//               </label>
//               <div className="relative mt-1 rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-500 sm:text-sm"><FaRupeeSign></FaRupeeSign></span>
//                 </div>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleChange}
//                   onKeyDown={(e) => {
//                     // Block: '-', 'e', 'E', '+', '.' (no decimals or invalid chars)
//                     if (['-', 'e', 'E', '+', '.'].includes(e.key)) {
//                       e.preventDefault();
//                     }
//                   }}
//                   className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="0"  // Changed from "0.00" since no decimals allowed
//                   min="0"
//                   step="1"  // Forces whole numbers only
//                   required

//                 />
//               </div>
//             </div>

          
//           </div>

//           {/* Stock and Status */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Stock Left <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="stock_left"
//                 value={formData.stock_left}
//                 onChange={handleChange}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g. 100"
//                 min="0"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Status <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 required
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//                 <option value="out_of_stock">Out of Stock</option>
//               </select>
//             </div>
//           </div>

//           {/* Descriptions */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Short Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               name="short_description"
//               value={formData.short_description}
//               onChange={handleChange}
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               rows="2"
//               placeholder="Brief product description (max 150 characters)"
//               maxLength="150"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Full Description <span className="text-red-500">*</span>
//             </label>
//             <RichTextEditor

//               placeholder="enter description & kit e.g description: your description,kit: your kits nd materials"
//               value={formData.description}
//               onChange={(value) => handleEditorChange(value, "description")}
//               toolbarConfig={{
//                 display: [
//                   'INLINE_STYLE_BUTTONS',
//                   'BLOCK_TYPE_DROPDOWN',
//                   'BLOCK_TYPE_BUTTONS',
//                   'LINK_BUTTONS',
//                   'HISTORY_BUTTONS',
//                 ],
//                 INLINE_STYLE_BUTTONS: [
//                   { label: 'Bold', style: 'BOLD' },
//                   { label: 'Italic', style: 'ITALIC' },
//                   { label: 'Underline', style: 'UNDERLINE' },
//                   { label: 'Code', style: 'CODE' },
//                 ],
//                 BLOCK_TYPE_DROPDOWN: [
//                   { label: 'Normal', style: 'unstyled' },
//                   { label: 'Heading Large', style: 'header-one' },
//                   { label: 'Heading Medium', style: 'header-two' },
//                   { label: 'Heading Small', style: 'header-three' },
//                 ],
//                 BLOCK_TYPE_BUTTONS: [
//                   { label: 'UL', style: 'unordered-list-item' },
//                   { label: 'OL', style: 'ordered-list-item' },
//                   { label: 'Blockquote', style: 'blockquote' },
//                 ],
//                 LINK_BUTTONS: [
//                   { label: 'Add Link', style: 'link' },
//                   { label: 'Remove Link', style: 'remove-link' },
//                 ],
//                 HISTORY_BUTTONS: [
//                   { label: 'Undo', style: 'undo' },
//                   { label: 'Redo', style: 'redo' },
//                 ]
//               }}
//             />
//           </div>

//           {/* Featured Image */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Featured Image <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="file"
//               name="featured_image"
//               onChange={handleFeaturedImageChange}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               accept="image/*"
//             />
//             {imagePreviews.featured && (
//               <div className="mt-2">
//                 <p className="text-sm text-gray-600 mb-1">
//                   {formData.featured_image instanceof File
//                     ? `New file: ${formData.featured_image.name}`
//                     : "Current featured image"}
//                 </p>
//                 <img
//                   src={imagePreviews.featured}
//                   alt="Featured Preview"
//                   className="w-32 h-32 object-contain border rounded"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Other Images */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Additional Images
//             </label>
//             <input
//               type="file"
//               name="other_images"
//               onChange={handleOtherImagesChange}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               accept="image/*"
//               multiple
//             />
//             {imagePreviews.others.length > 0 && (
//               <div className="mt-2">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   {formData.other_images.length > 0
//                     ? `Selected images (${formData.other_images.length})`
//                     : "Current product images"}
//                 </p>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                   {imagePreviews.others.map((img, index) => (
//                     <div key={index} className="relative group">
//                       <div className="border rounded p-1">
//                         <img
//                           src={img}
//                           alt={`Preview ${index + 1}`}
//                           className="h-24 w-full object-contain"
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => removeOtherImage(index)}

//                       >

//                         remove
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Offer Checkbox */}
//           <div className="flex items-center mb-6">
//             <input
//               type="checkbox"
//               name="isOffer"
//               checked={formData.isOffer}
//               onChange={handleChange}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               id="isOfferCheckbox"
//             />
//             <label htmlFor="isOfferCheckbox" className="ml-2 block text-sm text-gray-700">
//               This product is on special offer
//             </label>
//           </div>

//           {/* Submit Button */}
//           <div className="text-center">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
//             >
//               Update Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateDecorations;




import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { fetchProductById, modifyProduct } from '../../redux/decorationSlice';
import { fetchCategories } from '../../redux/categoriesSlice';
import { FaRupeeSign } from "react-icons/fa";
import RichTextEditor from "react-rte";

const UpdateDecorations = () => {


  const availableCities = [
  "Delhi NCR",
  "Jaipur",
  "Kolkata",
  "Indore",
  "Pune",
  "Hyderabad",
  "Kanpur",
  "Bangalore"
];
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  const [availableChildCategories, setAvailableChildCategories] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    slug_url: "",
    description: RichTextEditor.createEmptyValue(),
    short_description: "",
    category: "",
    category_name: "",
    price: "",
    mrp_price: "",
    unit: "pcs",
    stock_left: "",
    isOffer: false,
    status: "active",
    featured_image: null,
    other_images: [],
    child_categories: [],
     available_cities: []
  });

  const [imagePreviews, setImagePreviews] = useState({
    featured: null,
    others: []
  });

  // Fetch product and categories data
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchCategories());
    }
  }, [dispatch, id]);

  // Update form data when currentProduct changes
  useEffect(() => {
    if (currentProduct) {
      setFormData(prev => ({
        ...prev,
        product_id: currentProduct.product_id || "",
        name: currentProduct.name || "",
        slug_url: currentProduct.slug_url || "",
        description: RichTextEditor.createValueFromString(currentProduct.description, 'html') || "",
        short_description: currentProduct.short_description || "",
        category: currentProduct.category || "",
        category_name: currentProduct.category_name || "",
        price: currentProduct.price || "",
        mrp_price:currentProduct.mrp_price || "",
        unit: currentProduct.unit || "pcs",
        stock_left: currentProduct.stock_left || "",
        isOffer: currentProduct.isOffer || false,
        status: currentProduct.status || "active",
        child_categories: currentProduct.child_categories || [],
         available_cities: currentProduct.available_cities || []
      }));

      setImagePreviews({
        featured: currentProduct.featured_image
          ? `https://a4celebration.com/api/${currentProduct.featured_image}`
          : null,
        others: currentProduct.other_images?.length > 0
          ? currentProduct.other_images.map(img => `https://a4celebration.com/api/${img}`)
          : []
      });

      // Find and set available child categories if category is already selected
      if (currentProduct.category) {
        const selectedCategory = categories.find(cat => cat._id === currentProduct.category);
        if (selectedCategory) {
          const childCategories = selectedCategory.child_category
            ? Object.entries(selectedCategory.child_category).map(([id, child]) => ({
              id,
              name: child.name,
              image: child.image
            }))
            : [];
          setAvailableChildCategories(childCategories);
        }
      }
    }
  }, [currentProduct, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle category selection from dropdown
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);

    if (selectedCategory) {
      // Convert the Map-like child_category object to an array
      const childCategories = selectedCategory.child_category
        ? Object.entries(selectedCategory.child_category).map(([id, child]) => ({
          id,
          name: child.name,
          image: child.image
        }))
        : [];

      setAvailableChildCategories(childCategories);

      setFormData(prev => ({
        ...prev,
        category: selectedCategory._id,
        category_name: selectedCategory.category_name,
        child_categories: [] // Reset child categories when parent changes
      }));
    }
  };

  // Handle child category selection
  const handleChildCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedChildren = selectedOptions.map(option => ({
      id: option.value,
      name: option.label
    }));

    setFormData(prev => ({
      ...prev,
      child_categories: selectedChildren
    }));
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        featured_image: file
      }));
      setImagePreviews(prev => ({
        ...prev,
        featured: URL.createObjectURL(file)
      }));
    }
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        other_images: [...prev.other_images, ...files]
      }));
      setImagePreviews(prev => ({
        ...prev,
        others: [...prev.others, ...files.map(file => URL.createObjectURL(file))]
      }));
    }
  };

  // Generate slug from product name
  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      setFormData(prev => ({
        ...prev,
        slug_url: generatedSlug
      }));
    }
  }, [formData.name]);

  const removeOtherImage = useCallback((index) => {
    setFormData(prev => {
      const newOtherImages = [...prev.other_images];
      const removedImage = newOtherImages.splice(index, 1)[0];

      // Clean up object URL if it exists
      if (removedImage instanceof Blob) {
        URL.revokeObjectURL(URL.createObjectURL(removedImage));
      }

      return { ...prev, other_images: newOtherImages };
    });

    setImagePreviews(prev => {
      const newOtherPreviews = [...prev.others];
      const removedPreview = newOtherPreviews.splice(index, 1)[0];

      // Clean up object URL
      if (removedPreview.startsWith('blob:')) {
        URL.revokeObjectURL(removedPreview);
      }

      return { ...prev, others: newOtherPreviews };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Convert RichTextEditor content to HTML string
      const descriptionHTML = formData.description.toString('html');

      // Append all form fields
      data.append('product_id', formData.product_id);
      data.append('name', formData.name);
      data.append('slug_url', formData.slug_url);
      data.append('description', descriptionHTML);
      data.append('short_description', formData.short_description);
      data.append('category', formData.category);
      data.append('category_name', formData.category_name);
      data.append('price', formData.price);
      data.append('mrp_price', formData.mrp_price);
      data.append('unit', formData.unit);
      data.append('stock_left', formData.stock_left);
      data.append('isOffer', formData.isOffer);
      data.append('status', formData.status);


      if (formData.available_cities.length > 0) {
      data.append('available_cities', JSON.stringify(formData.available_cities));
    }

      // Handle child categories
      if (formData.child_categories.length > 0) {
        data.append('child_categories', JSON.stringify(formData.child_categories));
      }

      // Handle images
      if (formData.featured_image) {
        data.append('featured_image', formData.featured_image);
      }

      formData.other_images.forEach(file => {
        data.append('other_images', file);
      });

      await dispatch(modifyProduct({ id, formData: data })).unwrap();
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Update product error:", error);
      toast.error(error.message || "Failed to update product");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Error: {error}
      </div>
    </div>
  );

  const handleEditorChange = (value, fieldName) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };


  

  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-xl font-semibold text-center mb-6">Update Product</h4>

        <form onSubmit={handleSubmit}>
          {/* Product Name and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Rose Gold Decorations"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug URL
              </label>
              <input
                type="text"
                name="slug_url"
                value={formData.slug_url}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Auto-generated from product name"
                readOnly
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={categoriesLoading}
              >
                <option value="">Select a category</option>
                {categoriesLoading ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                name="category_name"
                value={formData.category_name}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                readOnly
              />
            </div>
          </div>

          {/* Child Category Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Child Categories (Optional)
            </label>
            <select
              multiple
              size={Math.min(availableChildCategories.length, 4)}
              name="child_categories"
              value={formData.child_categories.map(child => child.id)}
              onChange={handleChildCategoryChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!formData.category || availableChildCategories.length === 0}
            >
              {availableChildCategories.length > 0 ? (
                availableChildCategories.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))
              ) : (
                <option disabled>No child categories available</option>
              )}
            </select>
            {formData.child_categories.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.child_categories.map((child, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {child.name}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            child_categories: prev.child_categories.filter(c => c.id !== child.id)
                          }));
                        }}
                        className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                      >
                        <span className="sr-only">Remove</span>
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {availableChildCategories.length > 0
                ? "Hold Ctrl/Cmd to select multiple"
                : "Select a category first"}
            </p>
          </div>



          {/* Available Cities */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Available Cities
  </label>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
    {availableCities.map((city) => (
      <div key={city} className="flex items-center">
        <input
          type="checkbox"
          id={`city-${city}`}
          checked={formData.available_cities.includes(city)}
          onChange={() => {
            setFormData(prev => {
              const newCities = prev.available_cities.includes(city)
                ? prev.available_cities.filter(c => c !== city)
                : [...prev.available_cities, city];
              return { ...prev, available_cities: newCities };
            });
          }}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={`city-${city}`} className="ml-2 text-sm text-gray-700">
          {city}
        </label>
      </div>
    ))}
  </div>
  {formData.available_cities.length > 0 && (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700 mb-1">Selected Cities:</p>
      <div className="flex flex-wrap gap-2">
        {formData.available_cities.map((city) => (
          <span
            key={city}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {city}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  available_cities: prev.available_cities.filter(c => c !== city)
                }));
              }}
              className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  )}
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
<div>
            <label className="block text-sm font-medium text-gray-700">
                MRP Price <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm"><FaRupeeSign></FaRupeeSign></span>
                </div>
                <input
                  type="number"
                  name="mrp_price"
                  value={formData.mrp_price}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    // Block: '-', 'e', 'E', '+', '.'
                    if (['-', 'e', 'E', '+', '.'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  step="1"  // Ensures only whole numbers
                  required

                />
              </div>
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm"><FaRupeeSign></FaRupeeSign></span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    // Block: '-', 'e', 'E', '+', '.' (no decimals or invalid chars)
                    if (['-', 'e', 'E', '+', '.'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"  // Changed from "0.00" since no decimals allowed
                  min="0"
                  step="1"  // Forces whole numbers only
                  required

                />
              </div>
            </div>

          
          </div>

          {/* Stock and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock Left <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock_left"
                value={formData.stock_left}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 100"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Descriptions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              placeholder="Brief product description (max 150 characters)"
              maxLength="150"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Full Description <span className="text-red-500">*</span>
            </label>
            <RichTextEditor

              placeholder="enter description & kit e.g description: your description,kit: your kits nd materials"
              value={formData.description}
              onChange={(value) => handleEditorChange(value, "description")}
              toolbarConfig={{
                display: [
                  'INLINE_STYLE_BUTTONS',
                  'BLOCK_TYPE_DROPDOWN',
                  'BLOCK_TYPE_BUTTONS',
                  'LINK_BUTTONS',
                  'HISTORY_BUTTONS',
                ],
                INLINE_STYLE_BUTTONS: [
                  { label: 'Bold', style: 'BOLD' },
                  { label: 'Italic', style: 'ITALIC' },
                  { label: 'Underline', style: 'UNDERLINE' },
                  { label: 'Code', style: 'CODE' },
                ],
                BLOCK_TYPE_DROPDOWN: [
                  { label: 'Normal', style: 'unstyled' },
                  { label: 'Heading Large', style: 'header-one' },
                  { label: 'Heading Medium', style: 'header-two' },
                  { label: 'Heading Small', style: 'header-three' },
                ],
                BLOCK_TYPE_BUTTONS: [
                  { label: 'UL', style: 'unordered-list-item' },
                  { label: 'OL', style: 'ordered-list-item' },
                  { label: 'Blockquote', style: 'blockquote' },
                ],
                LINK_BUTTONS: [
                  { label: 'Add Link', style: 'link' },
                  { label: 'Remove Link', style: 'remove-link' },
                ],
                HISTORY_BUTTONS: [
                  { label: 'Undo', style: 'undo' },
                  { label: 'Redo', style: 'redo' },
                ]
              }}
            />
          </div>

          {/* Featured Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Featured Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="featured_image"
              onChange={handleFeaturedImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
            {imagePreviews.featured && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">
                  {formData.featured_image instanceof File
                    ? `New file: ${formData.featured_image.name}`
                    : "Current featured image"}
                </p>
                <img
                  src={imagePreviews.featured}
                  alt="Featured Preview"
                  className="w-32 h-32 object-contain border rounded"
                />
              </div>
            )}
          </div>

          {/* Other Images */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Additional Images
            </label>
            <input
              type="file"
              name="other_images"
              onChange={handleOtherImagesChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
              multiple
            />
            {imagePreviews.others.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {formData.other_images.length > 0
                    ? `Selected images (${formData.other_images.length})`
                    : "Current product images"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {imagePreviews.others.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="border rounded p-1">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOtherImage(index)}

                      >

                        remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Offer Checkbox */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              name="isOffer"
              checked={formData.isOffer}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              id="isOfferCheckbox"
            />
            <label htmlFor="isOfferCheckbox" className="ml-2 block text-sm text-gray-700">
              This product is on special offer
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDecorations;