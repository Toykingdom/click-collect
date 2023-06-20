import axios from 'axios';
import WooCommerce from '../../woocommerce';

const getOrder = async (orderId) => {
  try {
    // Make a GET request to the WooCommerce API endpoint for the specified order ID
    const response = await axios.get(`${WooCommerce.url}/wp-json/wc/v3/orders/${orderId}`, {
      auth: {
        username: WooCommerce.consumerKey,
        password: WooCommerce.consumerSecret,
      },
    });

    // Return the order data
    return response.data;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error fetching order:', error);
    return null;
  }
};

export default getOrder;
