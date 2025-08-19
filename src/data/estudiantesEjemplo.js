// Datos de ejemplo para estudiantes con integración de Cloudinary

export const estudiantesEjemplo = [
  {
    id: 1,
    name: "Ana María González",
    age: "8",
    grade: "2do Grado",
    parent: "Carlos González",
    phone: "+51 987654321",
    email: "carlos.gonzalez@email.com",
    address: "Av. Los Alamos 123, San Isidro",
    birthDate: "2015-03-15",
    dni: "12345678",
    emergencyContact: "María González",
    emergencyPhone: "+51 987654322",
    allergies: "Ninguna",
    medicalNotes: "Saludable",
    status: "active",
    attendance: 95,
    // Ejemplo con foto de Cloudinary
    photo: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg",
      publicId: "estudiantes/ana_maria_gonzalez",
      thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/c_fill,w_100,h_100,q_auto,f_auto/v1234567890/sample.jpg",
      detailUrl: "https://res.cloudinary.com/demo/image/upload/c_fill,w_400,h_400,q_auto,f_auto/v1234567890/sample.jpg"
    }
  },
  {
    id: 2,
    name: "Luis Alberto Pérez",
    age: "7",
    grade: "1ro Grado",
    parent: "Rosa Pérez",
    phone: "+51 987654323",
    email: "rosa.perez@email.com",
    address: "Jr. Las Flores 456, Miraflores",
    birthDate: "2016-07-22",
    dni: "23456789",
    emergencyContact: "Alberto Pérez",
    emergencyPhone: "+51 987654324",
    allergies: "Lactosa",
    medicalNotes: "Intolerante a la lactosa",
    status: "active",
    attendance: 88,
    // Ejemplo sin foto (mostrará iniciales)
    photo: null
  },
  {
    id: 3,
    name: "Sofía Isabel Rodriguez",
    age: "9",
    grade: "3ro Grado",
    parent: "Patricia Rodriguez",
    phone: "+51 987654325",
    email: "patricia.rodriguez@email.com",
    address: "Calle Los Rosales 789, Surco",
    birthDate: "2014-11-08",
    dni: "34567890",
    emergencyContact: "Miguel Rodriguez",
    emergencyPhone: "+51 987654326",
    allergies: "Ninguna",
    medicalNotes: "Usa lentes",
    status: "active",
    attendance: 92,
    // Ejemplo con URL simple (compatibilidad hacia atrás)
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Diego Alejandro Torres",
    age: "10",
    grade: "4to Grado",
    parent: "Fernando Torres",
    phone: "+51 987654327",
    email: "fernando.torres@email.com",
    address: "Av. Principal 321, La Molina",
    birthDate: "2013-05-12",
    dni: "45678901",
    emergencyContact: "Carmen Torres",
    emergencyPhone: "+51 987654328",
    allergies: "Maní",
    medicalNotes: "Alérgico al maní",
    status: "active",
    attendance: 97,
    // Ejemplo sin foto
    photo: null
  },
  {
    id: 5,
    name: "Valentina Paz Morales",
    age: "11",
    grade: "5to Grado",
    parent: "Andrea Morales",
    phone: "+51 987654329",
    email: "andrea.morales@email.com",
    address: "Jr. Los Pinos 654, San Borja",
    birthDate: "2012-09-30",
    dni: "56789012",
    emergencyContact: "Ricardo Morales",
    emergencyPhone: "+51 987654330",
    allergies: "Ninguna",
    medicalNotes: "Saludable",
    status: "active",
    attendance: 89,
    // Ejemplo con foto de Cloudinary completa
    photo: {
      url: "https://res.cloudinary.com/demo/image/upload/v1234567891/sample2.jpg",
      publicId: "estudiantes/valentina_morales",
      thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/c_fill,w_100,h_100,q_auto,f_auto/v1234567891/sample2.jpg",
      detailUrl: "https://res.cloudinary.com/demo/image/upload/c_fill,w_400,h_400,q_auto,f_auto/v1234567891/sample2.jpg"
    }
  }
];

// Función helper para simular el guardado de un nuevo estudiante
export const agregarEstudiante = (nuevoEstudiante) => {
  console.log('📝 Guardando nuevo estudiante:', {
    nombre: nuevoEstudiante.name,
    grado: nuevoEstudiante.grade,
    tieneFoto: !!nuevoEstudiante.photo,
    tipoFoto: nuevoEstudiante.photo ? typeof nuevoEstudiante.photo : 'sin foto'
  });
  
  // Aquí se haría la llamada al backend
  return {
    success: true,
    id: Date.now(),
    message: 'Estudiante agregado exitosamente'
  };
};
