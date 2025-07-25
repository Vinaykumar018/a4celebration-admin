import React, { useEffect, useState } from 'react';
import { getAllContacts } from '../../Services/contact-api-service';
import GetTable from '../../Component/GetTable';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const Contact = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllContacts()
      .then(response => {
        setProducts(response?.data || []);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleView = (id) => {
    console.log('View', id);
  };

  const handleUpdate = (id) => {
    console.log('Update', id);
  };

  const confirmDelete = (row) => {
    if (window.confirm(`Delete ${row.name}?`)) {
      console.log('Delete', row._id);
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Phone',
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: 'Message',
      selector: row => row.message,
      wrap: true,
    },
    {
      name: 'Date',
      selector: row => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
   
  ];

  return (
    <div>
      <GetTable
        columns={columns}
        data={products}
        title="Contact List"
      />
    </div>
  );
};

export default Contact;
