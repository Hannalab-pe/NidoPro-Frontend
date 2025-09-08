// Debug temporal
console.log('📋 Contactos del formulario COMPLETO:', data);
console.log('📋 contactosEmergencia específico:', data.contactosEmergencia);
console.log('📋 Longitud array:', data.contactosEmergencia?.length);
if (data.contactosEmergencia && data.contactosEmergencia.length > 0) {
  console.log('📋 Primer contacto:', data.contactosEmergencia[0]);
  console.log('📋 Campos del primer contacto:', Object.keys(data.contactosEmergencia[0]));
} else {
  console.log('❌ PROBLEMA: Array de contactos está vacío!');
}
