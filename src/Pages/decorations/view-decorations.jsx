// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProductById } from '../../redux/decorationSlice';
// import { fetchCategories } from '../../redux/categoriesSlice';
// import { FaRupeeSign } from "react-icons/fa";
// import RichTextEditor from "react-rte";

// const DecorationPreview = () => {
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const { currentProduct, loading, error } = useSelector((state) => state.products);
//   const { categories } = useSelector((state) => state.categories);

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

//   const [availableChildCategories, setAvailableChildCategories] = useState([]);

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
//       setFormData({
//         product_id: currentProduct.product_id || "",
//         name: currentProduct.name || "",
//         slug_url: currentProduct.slug_url || "",
//         description: RichTextEditor.createValueFromString(currentProduct.description || '', 'html'),
//         short_description: currentProduct.short_description || "",
//         category: currentProduct.category || "",
//         category_name: currentProduct.category_name || "",
//         price: currentProduct.price || "",
//         mrp_price: currentProduct.mrp_price || "",
//         unit: currentProduct.unit || "pcs",
//         stock_left: currentProduct.stock_left || "",
//         isOffer: currentProduct.isOffer || false,
//         status: currentProduct.status || "active",
//         child_categories: currentProduct.child_categories || []
//       });

//       setImagePreviews({
//         featured: currentProduct.featured_image
//           ? `https://a4celebration.com/api/${currentProduct.featured_image}`
//           : null,
//         others: currentProduct.other_images?.length > 0
//           ? currentProduct.other_images.map(img => `https://a4celebration.com/api/${img}`)
//           : []
//       });

//       // Set available child categories
//       if (currentProduct.category) {
//         const selectedCategory = categories.find(cat => cat._id === currentProduct.category);
//         if (selectedCategory && selectedCategory.child_category) {
//           const childCategories = Object.entries(selectedCategory.child_category).map(([id, child]) => ({
//             id,
//             name: child.name,
//             image: child.image
//           }));
//           setAvailableChildCategories(childCategories);
//         }
//       }
//     }
//   }, [currentProduct, categories]);

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

//   return (
//     <div className="mt-4 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h4 className="text-xl font-semibold text-center mb-6">Product Preview</h4>

//         <div>
//           {/* Product Name and Slug */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Product Name
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 readOnly
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Slug URL
//               </label>
//               <input
//                 type="text"
//                 value={formData.slug_url}
//                 readOnly
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>
//           </div>

//           {/* Category Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Category
//               </label>
//               <input
//                 type="text"
//                 value={formData.category_name}
//                 readOnly
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Category ID
//               </label>
//               <input
//                 type="text"
//                 value={formData.category}
//                 readOnly
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>
//           </div>

//           {/* Child Category Selection */}
//           {formData.child_categories.length > 0 && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Child Categories
//               </label>
//               <div className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 min-h-10">
//                 {formData.child_categories.map((child, index) => (
//                   <span
//                     key={index}
//                     className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
//                   >
//                     {child.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Pricing */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 MRP Price
//               </label>
//               <div className="relative mt-1 rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaRupeeSign className="text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   value={formData.mrp_price}
//                   readOnly
//                   className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md bg-gray-100"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Price
//               </label>
//               <div className="relative mt-1 rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaRupeeSign className="text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   value={formData.price}
//                   readOnly
//                   className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md bg-gray-100"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Stock and Status */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Stock Left
//               </label>
//               <input
//                 type="text"
//                 value={formData.stock_left}
//                 readOnly
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Status
//               </label>
//               <input
//                 type="text"
//                 value={formData.status}
//                 readOnly
//                 className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 capitalize"
//               />
//             </div>
//           </div>

//           {/* Descriptions */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Short Description
//             </label>
//             <textarea
//               value={formData.short_description}
//               readOnly
//               className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
//               rows="2"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Full Description
//             </label>
//             <div className="mt-1 border border-gray-300 rounded-md p-2 bg-gray-50">
//               <RichTextEditor
//                 value={formData.description}
//                 readOnly
//                 toolbarHidden
//               />
//             </div>
//           </div>

//           {/* Featured Image */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Featured Image
//             </label>
//             {imagePreviews.featured && (
//               <div className="mt-2">
//                 <img
//                   src={imagePreviews.featured}
//                   alt="Featured Preview"
//                   className="w-32 h-32 object-contain border rounded"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Other Images */}
//           {imagePreviews.others.length > 0 && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Additional Images
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
//                 {imagePreviews.others.map((img, index) => (
//                   <div key={index} className="border rounded p-1">
//                     <img
//                       src={img}
//                       alt={`Preview ${index + 1}`}
//                       className="h-24 w-full object-contain"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Offer Checkbox */}
//           <div className="flex items-center mb-6">
//             <input
//               type="checkbox"
//               checked={formData.isOffer}
//               readOnly
//               className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//             />
//             <label className="ml-2 block text-sm text-gray-700">
//               This product is on special offer
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DecorationPreview;




import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/decorationSlice';
import { fetchCategories } from '../../redux/categoriesSlice';
import { FaRupeeSign } from "react-icons/fa";
import RichTextEditor from "react-rte";

const DecorationPreview = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

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
    available_cities:[]
  });

  const [imagePreviews, setImagePreviews] = useState({
    featured: null,
    others: []
  });

  const [availableChildCategories, setAvailableChildCategories] = useState([]);

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
      setFormData({
        product_id: currentProduct.product_id || "",
        name: currentProduct.name || "",
        slug_url: currentProduct.slug_url || "",
        description: RichTextEditor.createValueFromString(currentProduct.description || '', 'html'),
        short_description: currentProduct.short_description || "",
        category: currentProduct.category || "",
        category_name: currentProduct.category_name || "",
        price: currentProduct.price || "",
        mrp_price: currentProduct.mrp_price || "",
        unit: currentProduct.unit || "pcs",
        stock_left: currentProduct.stock_left || "",
        isOffer: currentProduct.isOffer || false,
        status: currentProduct.status || "active",
        child_categories: currentProduct.child_categories || [],
        available_cities: currentProduct.available_cities || []
      });
      console.log(formData.available_cities[0])

      setImagePreviews({
        featured: currentProduct.featured_image
          ? `https://a4celebration.com/api/${currentProduct.featured_image}`
          : null,
        others: currentProduct.other_images?.length > 0
          ? currentProduct.other_images.map(img => `https://a4celebration.com/api/${img}`)
          : []
      });

      // Set available child categories
      if (currentProduct.category) {
        const selectedCategory = categories.find(cat => cat._id === currentProduct.category);
        if (selectedCategory && selectedCategory.child_category) {
          const childCategories = Object.entries(selectedCategory.child_category).map(([id, child]) => ({
            id,
            name: child.name,
            image: child.image
          }));
          setAvailableChildCategories(childCategories);
        }
      }
    }
  }, [currentProduct, categories]);

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

  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-xl font-semibold text-center mb-6">Product Preview</h4>

        <div>
          {/* Product Name and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                readOnly
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug URL
              </label>
              <input
                type="text"
                value={formData.slug_url}
                readOnly
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                value={formData.category_name}
                readOnly
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category ID
              </label>
              <input
                type="text"
                value={formData.category}
                readOnly
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          {/* Child Category Selection */}
          {formData.child_categories.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Child Categories
              </label>
              <div className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 min-h-10">
                {formData.child_categories.map((child, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                  >
                    {child.name}
                  </span>
                ))}
              </div>
            </div>
          )}


           {formData.available_cities.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Available Cities
              </label>
              <div className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 min-h-10">
                {formData.available_cities.map((child, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                  >
                   
                    {child}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                MRP Price
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRupeeSign className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={formData.mrp_price}
                  readOnly
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRupeeSign className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={formData.price}
                  readOnly
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Stock and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock Left
              </label>
              <input
                type="text"
                value={formData.stock_left}
                readOnly
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                value={formData.status}
                readOnly
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 capitalize"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              value={formData.short_description}
              readOnly
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
              rows="2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Full Description
            </label>
            <div className="mt-1 border border-gray-300 rounded-md p-2 bg-gray-50">
              <RichTextEditor
                value={formData.description}
                readOnly
                toolbarHidden
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            {imagePreviews.featured && (
              <div className="mt-2">
                <img
                  src={imagePreviews.featured}
                  alt="Featured Preview"
                  className="w-32 h-32 object-contain border rounded"
                />
              </div>
            )}
          </div>

          {/* Other Images */}
          {imagePreviews.others.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Additional Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                {imagePreviews.others.map((img, index) => (
                  <div key={index} className="border rounded p-1">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offer Checkbox */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={formData.isOffer}
              readOnly
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              This product is on special offer
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecorationPreview;