"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WooCommerce from '../woocommerce.js';
import OrderSearch from './OrderSearch.js';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function OrderComplete() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${WooCommerce.url}/wp-json/wc/v3/orders`, {
        params: {
          status: 'collect-completed',
          per_page: itemsPerPage,
          page: currentPage,
        },
        auth: {
          username: WooCommerce.consumerKey,
          password: WooCommerce.consumerSecret,
        },
      });
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filterOrders = () => {
    if (!searchQuery) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const storeName = order.shipping_lines
          .map((shippingLine) =>
            shippingLine.meta_data.find((meta) => meta.key === '_pickup_location_name')
          )
          .filter((meta) => meta)
          .map((meta) => meta.value.toLowerCase())
          .join(' ');
  
        return (
          storeName.includes(searchQuery.toLowerCase()) ||
          order.number.toString().includes(searchQuery)
        );
      });
  
      setFilteredOrders(filtered);
    }
  };
  

  const handleSearch = () => {
    filterOrders();
  };

  const handleClearFilter = () => {
    setSearchQuery('');
    setFilteredOrders(orders);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = Math.ceil(filteredOrders.length / itemsPerPage);

    return (
        <div className='container mx-auto bg-white'>
           
        <h1 className="text-4xl font-bold mb-4 text-gray-700 text-center">Click & Collect Completed</h1>
        <OrderSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleClearFilter={handleClearFilter}
        />
        <table className="container mx-auto bg-white">
          <thead className='bg-gray-100'>
            <tr className='text-left'>
              <th className="py-2 px-4 border-b border-gray-200">Order Number</th>
              <th className="py-2 px-4 border-b border-gray-200">Customer</th>
              <th className="py-2 px-4 border-b border-gray-200">Status</th>
              <th className="py-2 px-4 border-b border-gray-200">Store</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b border-gray-200">{order.number}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-transform: capitalize">
                  {order.billing.first_name} {order.billing.last_name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">Collected</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {order.shipping_lines.map((shippingLine) => (
                    <div key={shippingLine.id}>
                      {shippingLine.meta_data.map((meta) =>
                        meta.key === '_pickup_location_name' ? (
                          <span key={meta.id}>{meta.value}</span>
                        ) : null
                      )}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="pagination">
              {Array.from({ length: pageNumbers }, (_, index) => index + 1).map((number) => (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(number)}>
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    );
  };
  
  