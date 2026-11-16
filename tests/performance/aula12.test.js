import http from 'k6/http';
import { check, sleep } from 'k6';


export const options = {
  stages: [
    
    { duration: '30s', target: 10 },
    { duration: '1m',  target: 20 },
    
    
    { duration: '1m',  target: 40 },
    { duration: '1m',  target: 60 },
    
    
    { duration: '30s', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    
    http_req_duration: ['p(95)<2000'], 
    http_req_failed: ['rate<0.01'],    
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';

export default function () {
  
  const res = http.get(`${BASE_URL}/#catalogo`);
  
  
  check(res, {
    'Status é 200': (r) => r.status === 200,
    'Conteúdo carregado': (r) => r.body && r.body.length > 0,
  });

  
  sleep(Math.random() * 2 + 1);
}