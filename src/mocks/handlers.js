import { http, HttpResponse } from 'msw';
import { mockData } from '../mockData';

let employeeData = mockData;

export const handlers = [
    http.get('/api/employees', () => {
        console.log('MSW: GET /api/employees triggered');
        return HttpResponse.json(employeeData);
    }),

    http.put('/api/employees/:id', async ({ params, request }) => {
        const id = parseInt(params.id);
        const updated = await request.json();
        employeeData = employeeData.map(emp => (emp.id === id ? updated : emp));
        return HttpResponse.json(updated);
    }),
];
