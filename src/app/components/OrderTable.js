"use client"
import React, { useEffect, useState } from 'react';
import WooCommerce from '../woocommerce.js';
import OrderSearch from './OrderSearch.js';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OrdersTable() {
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
      const response = await fetch(
        `${WooCommerce.url}/wp-json/wc/v3/orders?status=click-and-collect&per_page=${itemsPerPage}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Basic ${btoa(`${WooCommerce.consumerKey}:${WooCommerce.consumerSecret}`)}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        console.log(data);
      } else {
        console.error('Error fetching orders:', response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      const response = await fetch(
        `${WooCommerce.url}/wp-json/wc/v3/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${WooCommerce.consumerKey}:${WooCommerce.consumerSecret}`)}`,
          },
          body: JSON.stringify({ status: 'collect-completed' }),
        }
      );
      if (response.ok) {
        console.log('Order status updated successfully.');

        fetchOrders();
        window.location.reload(); // Refresh the page

        toast.success('Order status updated successfully.'); // Display success toast
      } else {
        console.error('Error updating order status:', response.statusText);
        toast.error('Error updating order status.'); // Display error toast
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status.'); // Display error toast
    }
  };

  const readyForPickup = async (orderId) => {
    try {
      const response = await fetch(
        `${WooCommerce.url}/wp-json/wc/v3/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${WooCommerce.consumerKey}:${WooCommerce.consumerSecret}`)}`,
          },
          body: JSON.stringify({ status: 'ready-for-pickup' }),
        }
      );
      if (response.ok) {
        console.log('Order status updated successfully.');

        fetchOrders();
        window.location.reload(); // Refresh the page

        toast.success('Order status updated successfully.'); // Display success toast
      } else {
        console.error('Error updating order status:', response.statusText);
        toast.error('Error updating order status.'); // Display error toast
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status.'); // Display error toast
    }
    setButtonDisabled(true);
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
    <div className="container mx-auto bg-white">
      <h1 className="text-4xl font-bold mb-4 text-gray-700 text-center">Click & Collect Orders</h1>
      <OrderSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleClearFilter={handleClearFilter}
      />
      <table className="container mx-auto bg-white">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="py-2 px-4 border-b border-gray-200">Reference</th>
            <th className="py-2 px-4 border-b border-gray-200">Customer</th>
            <th className="py-2 px-4 border-b border-gray-200">Status</th>
            <th className="py-2 px-4 border-b border-gray-200">Contact</th>
            <th className="py-2 px-4 border-b border-gray-200">Store</th>
            <th className="py-2 px-4 border-b border-gray-200">View</th>
            <th className="py-2 px-4 border-b border-gray-200">Pickup</th>
            <th className="py-2 px-4 border-b border-gray-200">Completed</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b border-gray-200">{order.number}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-transform: capitalize">
                {order.billing.first_name} {order.billing.last_name}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">On route</td>
              <td className="py-2 px-4 border-b border-gray-200">{order.billing.phone}</td>
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
              <td className="py-2 px-4 border-b border-gray-200">
                <Link href={`/orders/${order.id}`}>
                  view order
                </Link>
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => readyForPickup(order.id)}
                  disabled={buttonDisabled}
                >
                  Ready for Pickup
                </button>
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleStatusUpdate(order.id)}
                  disabled={buttonDisabled}
                >
                  Completed
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {pageNumbers > 1 && (
          <ul className="flex pl-0 list-none rounded my-2">
            {Array.from(Array(pageNumbers).keys()).map((number) => (
              <li key={number}>
                <button
                  className={`${
                    currentPage === number + 1
                      ? 'bg-blue-500 text-white hover:bg-blue-700'
                      : 'bg-white text-blue-500 hover:bg-gray-200'
                  } font-semibold py-2 px-4 mx-1 border border-gray-300`}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
