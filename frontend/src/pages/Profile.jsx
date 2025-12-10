import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getProfile, updateProfile, getStats } from '../services/profileService';
import {
  FiUser,
  FiEdit2,
  FiSave,
  FiX,
  FiCalendar,
  FiMail,
  FiAward,
  FiBarChart2,
  FiFileText,
  FiUsers,
  FiTarget,
} from 'react-icons/fi';
import './Profile.css';

/**
 * Página de perfil del usuario.
 * Permite al usuario ver y editar su información personal, estadísticas y juegos favoritos.
 * @returns {React.ReactElement} El componente de la página de perfil.
 */
function Profile() {
  const { user: authUser } = useAuth();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    favoriteGames: [],
    avatar: '',
  });

  const [newGame, setNewGame] = useState('');

  /**
   * Carga el perfil del usuario y las estadísticas al montar el componente.
   */
  useEffect(() => {
    document.title = 'Perfil | BossFlow';
    loadProfile();
    loadStats();
  }, []);

  /**
   * Carga el perfil del usuario desde el servidor.
   */
  const loadProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.user);
      setFormData({
        username: response.user.username || '',
        bio: response.user.bio || '',
        favoriteGames: response.user.favoriteGames || [],
        avatar: response.user.avatar || '',
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las estadísticas del usuario desde el servidor.
   */
  const loadStats = async () => {
    try {
      const response = await getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  /**
   * Activa el modo de edición del perfil.
   */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * Cancela la edición del perfil y restaura los datos originales.
   */
  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      favoriteGames: user.favoriteGames || [],
      avatar: user.avatar || '',
    });
    setIsEditing(false);
  };

  /**
   * Guarda los cambios realizados en el perfil del usuario.
   */
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateProfile(formData);
      setUser(response.user);

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...storedUser,
        username: response.user.username,
        avatar: response.user.avatar
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsEditing(false);
      toast.success('Perfil actualizado correctamente. Recarga la página para ver los cambios en el navegador.');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      const errorMessage = error.response?.data?.error || 'Error al actualizar el perfil';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Maneja los cambios en los campos de entrada del formulario.
   * @param {Event} e - Evento del input.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Agrega un nuevo juego favorito a la lista.
   */
  const handleAddGame = () => {
    if (newGame.trim() && formData.favoriteGames.length < 10) {
      setFormData((prev) => ({
        ...prev,
        favoriteGames: [...prev.favoriteGames, newGame.trim()],
      }));
      setNewGame('');
    }
  };

  /**
   * Elimina un juego favorito de la lista.
   * @param {number} index - Índice del juego a eliminar.
   */
  const handleRemoveGame = (index) => {
    setFormData((prev) => ({
      ...prev,
      favoriteGames: prev.favoriteGames.filter((_, i) => i !== index),
    }));
  };

  /**
   * Formatea una fecha al formato local (día, mes, año).
   * @param {string} dateString - Cadena de fecha a formatear.
   * @returns {string} Fecha formateada.
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="profile">
        <section className="profile-loading">
          <p>Cargando perfil...</p>
        </section>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="profile">
        <section className="profile-error">
          <p>No se pudo cargar el perfil</p>
        </section>
      </section>
    );
  }

  return (
    <section className="profile">
      <section className="profile-container">
        <header className="profile-header">
          <section className="profile-avatar-section">
            <figure className="profile-avatar">
              {formData.avatar ? (
                <img src={formData.avatar} alt={user.username} />
              ) : (
                <FiUser className="profile-avatar-icon" />
              )}
            </figure>

            {isEditing && (
              <section className="profile-avatar-edit">
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  placeholder="URL de la imagen"
                  className="profile-input"
                />
                <small>Introduce la URL de tu imagen de perfil</small>
              </section>
            )}
          </section>

          <section className="profile-header-info">
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="profile-input profile-input--username"
                placeholder="Nombre de usuario"
              />
            ) : (
              <h1 className="profile-username">{user.username}</h1>
            )}

            <section className="profile-meta">
              <span className="profile-meta-item">
                <FiMail /> {user.email}
              </span>
              <span className="profile-meta-item">
                <FiCalendar /> Miembro desde {formatDate(user.createdAt)}
              </span>
            </section>
          </section>

          <section className="profile-actions">
            {!isEditing ? (
              <button className="profile-button profile-button--edit" onClick={handleEdit}>
                <FiEdit2 /> Editar perfil
              </button>
            ) : (
              <section className="profile-edit-actions">
                <button
                  className="profile-button profile-button--cancel"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <FiX /> Cancelar
                </button>
                <button
                  className="profile-button profile-button--save"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FiSave /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </section>
            )}
          </section>
        </header>

        <article className="profile-section">
          <h2 className="profile-section-title">
            <FiUser /> Biografía
          </h2>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="profile-textarea"
              placeholder="Cuéntanos sobre ti..."
              maxLength={500}
              rows={4}
            />
          ) : (
            <p className="profile-bio">
              {user.bio || 'No has añadido una biografía todavía.'}
            </p>
          )}
          {isEditing && (
            <small className="profile-char-count">
              {formData.bio.length}/500 caracteres
            </small>
          )}
        </article>

        {stats && (
          <article className="profile-section">
            <h2 className="profile-section-title">
              <FiBarChart2 /> Estadísticas
            </h2>
            <section className="profile-stats">
              <article className="profile-stat">
                <figure className="profile-stat-icon">
                  <FiFileText />
                </figure>
                <section className="profile-stat-info">
                  <span className="profile-stat-value">{stats.diagramsCreated}</span>
                  <span className="profile-stat-label">Diagramas creados</span>
                </section>
              </article>
              <article className="profile-stat">
                <figure className="profile-stat-icon">
                  <FiTarget />
                </figure>
                <section className="profile-stat-info">
                  <span className="profile-stat-value">{stats.nodesCreated}</span>
                  <span className="profile-stat-label">Nodos creados</span>
                </section>
              </article>
              <article className="profile-stat">
                <figure className="profile-stat-icon">
                  <FiUsers />
                </figure>
                <section className="profile-stat-info">
                  <span className="profile-stat-value">{stats.collaborations}</span>
                  <span className="profile-stat-label">Colaboraciones</span>
                </section>
              </article>
            </section>
          </article>
        )}

        <article className="profile-section">
            <h2 className="profile-section-title">
              <FiTarget /> Juegos favoritos
            </h2>

          {isEditing && (
            <section className="profile-game-input">
              <input
                type="text"
                value={newGame}
                onChange={(e) => setNewGame(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGame()}
                placeholder="Añadir juego favorito"
                className="profile-input"
                disabled={formData.favoriteGames.length >= 10}
              />
              <button
                onClick={handleAddGame}
                className="profile-button profile-button--add"
                disabled={!newGame.trim() || formData.favoriteGames.length >= 10}
              >
                Añadir
              </button>
            </section>
          )}

          {formData.favoriteGames.length > 0 ? (
            <ul className="profile-games">
              {formData.favoriteGames.map((game, index) => (
                <li key={index} className="profile-game">
                  <span>{game}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveGame(index)}
                      className="profile-game-remove"
                      title="Eliminar"
                    >
                      <FiX />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="profile-empty">No has añadido juegos favoritos todavía.</p>
          )}

          {isEditing && formData.favoriteGames.length >= 10 && (
            <small className="profile-limit">Has alcanzado el límite de 10 juegos favoritos</small>
          )}
        </article>

        {user.achievements && user.achievements.length > 0 && (
          <article className="profile-section">
            <h2 className="profile-section-title">
              <FiAward /> Logros
            </h2>
            <section className="profile-achievements">
              {user.achievements.map((achievement, index) => (
                <article key={index} className="profile-achievement">
                  <figure className="profile-achievement-icon">
                    {achievement.icon || <FiAward />}
                  </figure>
                  <section className="profile-achievement-info">
                    <h3>{achievement.name}</h3>
                    <p>{achievement.description}</p>
                    <small>Desbloqueado: {formatDate(achievement.unlockedAt)}</small>
                  </section>
                </article>
              ))}
            </section>
          </article>
        )}
      </section>
    </section>
  );
}

export default Profile;
