export const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const lettersOnlyRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export function validateForm({ firstName, lastName, email, phone, address, city, password, confirmPassword }) {
  const errors = {};

  if (!firstName) {
    errors.firstName = "El nombre es obligatorio.";
  } else if (firstName.length < 2 || firstName.length > 50) {
    errors.firstName = "El nombre debe tener entre 2 y 50 caracteres.";
  } else if (!lettersOnlyRegex.test(firstName)) {
    errors.firstName = "El nombre solo debe contener letras y espacios.";
  }

  if (!lastName) {
    errors.lastName = "El apellido es obligatorio.";
  } else if (lastName.length < 2 || lastName.length > 50) {
    errors.lastName = "El apellido debe tener entre 2 y 50 caracteres.";
  } else if (!lettersOnlyRegex.test(lastName)) {
    errors.lastName = "El apellido solo debe contener letras y espacios.";
  }

  if (!email) {
    errors.email = "El email es obligatorio.";
  } else if (!emailRegex.test(email)) {
    errors.email = "Ingresa una dirección de correo electrónico válida.";
  }

  // Teléfono es opcional; si se completa debe tener al menos 7 dígitos
  if (phone && !/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
    errors.phone = "Ingresa un número de teléfono válido.";
  }

  if (!address) {
    errors.address = "La dirección es obligatoria.";
  } else if (address.length < 3) {
    errors.address = "Ingresa una dirección válida.";
  }

  if (!city) {
    errors.city = "La ciudad es obligatoria.";
  } else if (city.length < 2) {
    errors.city = "Ingresa una ciudad válida.";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirma tu contraseña.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return errors;
}
