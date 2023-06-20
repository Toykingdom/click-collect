import React, { useEffect, useState } from 'react';
import WooCommerce from '../woocommerce.js';

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(
        `${WooCommerce.url}/wp-json/wc/v3/orders/${orderId}`,
        {
          headers: {
            Authorization: `Basic ${btoa(`${WooCommerce.consumerKey}:${WooCommerce.consumerSecret}`)}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        console.log(data);
      } else {
        console.error('Error fetching order details:', response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      {/* Render other order details as needed */}
    </div>
  );
}
