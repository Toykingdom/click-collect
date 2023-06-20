import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';


const WooCommerce = new WooCommerceRestApi({
    url: 'https://wordpress-670065-3435330.cloudwaysapps.com',
    consumerKey: 'ck_2f1e11dc1a363b683a784e0ade2d034f78ce562e',
    consumerSecret: 'cs_7a533a9528aa57b60237688720e47074aeb08a17',
    wpAPI: true,
    version: 'wc/v3'
  });

  export default WooCommerce;