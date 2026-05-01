import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import MyProfileForm from './MyProfileForm';
import { validateForm } from './Validation';
import { getUserById, updateUser } from '../../../../redux/actions';
import styles from './MyProfile.module.css';

const MyProfile = ({ user }) => {
  const id = user.id;
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');

  const [formProfile, setFormProfile] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });

  useEffect(() => {
    setFormProfile({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm(
      formProfile.firstName,
      formProfile.lastName,
      formProfile.email,
      formProfile.phone
    );
    setError(validationError);
    if (!validationError) {
      dispatch(updateUser(id, formProfile))
        .then(() => {
          dispatch(getUserById(id));
          setError('');
          Swal.fire({
            icon: 'success',
            title: 'Cambio exitoso',
            text: 'Tu perfil ha sido actualizado con éxito.',
          });
          setActive(false);
        })
        .catch(() => {
          setError('Error al actualizar. Inténtalo nuevamente.');
        });
    }
  };

  const handleChange = (e) => {
    setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {!active ? (
        <div>
          <h1 className={styles.title}>Mis Datos</h1>
          <div className={styles.profilecontainer}>
            <h2>Nombre: {user.firstName}</h2>
            <h2>Apellido: {user.lastName}</h2>
            <h2>Teléfono: {user.phone}</h2>
            <h2>Correo: {user.email}</h2>
          </div>
          <button className={styles.boton} onClick={() => setActive(true)}>
            Modificar
          </button>
        </div>
      ) : (
        <MyProfileForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          formProfile={formProfile}
          error={error}
        />
      )}
    </div>
  );
};

export default MyProfile;
