import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { target: 10, duration: '60s' },     // start from 10 VUs for 60s
        { target: 20, duration: '60s' },       // ramp up to 20VUs for following 60s
        { target: 10, duration: '60s' },      // ramp down to 10 VUs for last 60s
    ],
    /*scenarios: {
        contacts: {
            executor: 'ramping-arrival-rate',
            startRate: 10,
            timeUnit: '1m',
            preAllocatedVUs: 10,
            maxVUs: 20,
            stages: [
                { target: 10, duration: '60s' },     // linearly go from 2 VUs to 10 VUs for 60s
                { target: 20, duration: '60s' },       // start to jump to 20VUs for following 60s
                { target: 10, duration: '60s' },      // continue with 10 VUs for 60s
            ],
        },       
    },*/
    thresholds: {
      http_req_failed: ['rate<0.01'], // http errors should be less than 1%
      http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    },
  };
  

export default function () {
    var user_id = '61bec2ba-3cff-4b2a-90f5-e63ba9960b3e';
    
    const baseUrl = 'http://pretest-qa.dcidev.id/api/v1/message/'+user_id;
    
    const params = {
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'd7ef39693fe29257ae89ecde0cd50df7c321d2de56e8d3954806a9e8a96deee5',
      },

    };
  
    const res = http.get(baseUrl,params);
    sleep(1)
    //console.log(res);
    check(res, {
        'is status 200': (r) => r.status === 200,
      });
  }