// Script de debug para verificar localStorage
console.log('=== DEBUG LOCALSTORAGE ===');
console.log('entidadId:', localStorage.getItem('entidadId'));
console.log('token:', localStorage.getItem('token') ? 'Presente' : 'No encontrado');
console.log('user:', localStorage.getItem('user'));

// Verificar si entidadId es válido
const entidadId = localStorage.getItem('entidadId');
console.log('entidadId type:', typeof entidadId);
console.log('entidadId length:', entidadId ? entidadId.length : 0);
console.log('entidadId is UUID-like:', entidadId && entidadId.includes('-'));

// Verificar si es el mismo ID que funciona en la API manual
const expectedId = '39c3a64f-676e-42d6-9555-25cea3174bed';
console.log('Expected ID:', expectedId);
console.log('Matches expected:', entidadId === expectedId);