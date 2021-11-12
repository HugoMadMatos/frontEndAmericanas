import axios from 'axios';

const api = axios.create({
  baseURL:'https://restql-server-api-v2-americanas.b2w.io/run-query/catalogo/product-without-installment/2?'

});

export default api;