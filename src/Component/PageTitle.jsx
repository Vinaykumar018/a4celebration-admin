import React from 'react';
import { useLocation } from 'react-router-dom';

function PageTitle() {
  const location = useLocation();
  
  const isLikelyId = (str) => {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str) || 
           /^\d+$/.test(str);
  };

  const formatTitle = (str) => {
    if (!str) return '';
    if (isLikelyId(str)) return '';
    const withSpaces = str.replace(/-/g, ' ');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    
    const titleMap = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/e-rickshaw/add-user': 'Add User',
      '/project-list': 'Project List',
      '/project-details': 'Project Details',
      '/create-new': 'Create New Project',
      '/file-manager': 'File Manager',
      '/kanban': 'Kanban Board',
      '/ecommerce': 'Ecommerce',
      '/products': 'Products',
      '/add-product': 'Add Product',
      '/product-grid': 'Product Grid',
      '/products-list': 'Products List',
      '/product-details': 'Product Details',
      '/category': 'Categories',
      '/seller-list': 'Sellers',
      '/seller-details': 'Seller Details',
      '/order-history': 'Order History',
      '/order-details': 'Order Details',
      '/cart': 'Shopping Cart',
      '/wishlist': 'Wishlist',
      '/checkout': 'Checkout',
      '/manage-review': 'Manage Reviews',
      '/settings': 'Settings',
      '/login': 'Login'
    };
    
    for (const [route, title] of Object.entries(titleMap)) {
      if (path === route || (route !== '/' && path.startsWith(route))) {
        return title;
      }
    }
    
    const pathParts = path.split('/').filter(part => part !== '');
    if (pathParts.length === 0) return 'Dashboard';
    
    const lastPart = pathParts[pathParts.length - 1];
    return isLikelyId(lastPart) && pathParts.length > 1 
      ? formatTitle(pathParts[pathParts.length - 2]) 
      : formatTitle(lastPart);
  };
  
  const getBreadcrumbs = () => {
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    
    if (pathParts.length === 0) return [];
    
    const breadcrumbs = [];
    let accumulatedPath = '';
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      accumulatedPath += `/${part}`;
      
      if (isLikelyId(part)) continue;
      
      breadcrumbs.push({
        name: formatTitle(part),
        path: accumulatedPath
      });
    }
    
    return breadcrumbs;
  };

  return (
    <div className="container">
      <div className="page-title">
        <div className="grid grid-cols-12 mx-2 items-center">
          <div className="col-span-6 sm:col-span-12">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {getPageTitle()}
            </h3>
          </div>
          <div className="col-span-6 sm:col-span-12">
            <ol className="breadcrumb flex flex-wrap items-center gap-2 text-sm">
              <li className="breadcrumb-item">
                <a href="/" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  {/* Font Awesome icon instead of SVG */}
                  <i className="fa fa-home mr-1"></i> Home
                </a>
              </li>
              {getBreadcrumbs().length > 0 && (
                <li className="breadcrumb-separator text-gray-400 dark:text-gray-500">
                  /
                </li>
              )}
              {getBreadcrumbs().map((crumb, index) => (
                <React.Fragment key={index}>
                  <li 
                    className={`breadcrumb-item ${
                      index === getBreadcrumbs().length - 1 
                        ? 'text-primary dark:text-primary font-medium' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {index === getBreadcrumbs().length - 1 ? (
                      crumb.name
                    ) : (
                      <a href={crumb.path} className="hover:text-primary dark:hover:text-primary">
                        {crumb.name}
                      </a>
                    )}
                  </li>
                  {index < getBreadcrumbs().length - 1 && (
                    <li className="breadcrumb-separator text-gray-400 dark:text-gray-500">
                      /
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageTitle;
