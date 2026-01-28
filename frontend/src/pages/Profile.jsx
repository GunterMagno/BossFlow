import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getProfile,
  updateProfile,
  getStats,
  exportUserData,
  deleteAccount,
} from '../services/profileService';
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
  FiDownload,
  FiTrash2,
  FiShield,
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';
import './Profile.css';

/**
 * User profile page.
 * Allows the user to view and edit their personal information, statistics, and favorite games.
 * @returns {React.ReactElement} The profile page component.
 */
function Profile() {
  const { user: authUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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

  // State for data management
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Loads the user profile when the component mounts.
   */
  useEffect(() => {
    document.title = 'Perfil | BossFlow';
    loadProfile();
    loadStats();
  }, []);

  /**
   * Loads the user profile from the server.
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
      console.error('Error loading profile:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads user statistics from the server.
   */
  const loadStats = async () => {
    try {
      const response = await getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  /**
   * Activates profile edit mode.
   */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * Cancels profile edit and restores original data.
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
   * Saves changes made to the user profile.
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
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'Error al actualizar el perfil';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handles changes in form input fields.
   * @param {Event} e - Input event.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Adds a new favorite game to the list.
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
   * Removes a favorite game from the list.
   * @param {number} index - Index of the game to remove.
   */
  const handleRemoveGame = (index) => {
    setFormData((prev) => ({
      ...prev,
      favoriteGames: prev.favoriteGames.filter((_, i) => i !== index),
    }));
  };

  /**
   * Exports all user data in JSON format.
   */
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const blob = await exportUserData();

      // Create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bossflow_data_${user.username}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Datos exportados correctamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar tus datos');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Permanently deletes the user account.
   */
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Debes introducir tu contraseña');
      return;
    }

    console.log('Attempting to delete account with password...');
    setIsDeleting(true);
    
    try {
      const response = await deleteAccount(deletePassword);
      console.log('Account deleted successfully:', response);
      
      // Cerrar modal primero
      setShowDeleteModal(false);
      setDeletePassword('');
      
      toast.success('Cuenta eliminada correctamente. Redirigiendo...');

      // Cerrar sesión y redirigir
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Complete error deleting account:', error);
      console.error('Error response:', error.response);
      
      const errorMessage =
        error.response?.data?.error || 'Error al eliminar la cuenta. Verifica tu contraseña.';
      toast.error(errorMessage);
      setIsDeleting(false);
      // No cerrar el modal en caso de error para que el usuario pueda intentar de nuevo
    }
  };

  /**
   * Formats a date to local format (day, month, year).
   * @param {string} dateString - Date string to format.
   * @returns {string} Formatted date.
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

        {/* Sección de Privacidad y Datos */}
        <article className="profile-section profile-section--danger">
          <h2 className="profile-section-title">
            <FiShield /> Privacidad y Gestión de Datos
          </h2>
          <p className="profile-section-description">
            Gestiona tus datos personales. Puedes exportar todos tus datos o solicitar la eliminación permanente de tu
            cuenta.
          </p>

          <section className="profile-data-actions">
            <article className="profile-data-action">
              <section className="profile-data-action-info">
                <h3>
                  <FiDownload /> Exportar mis datos
                </h3>
                <p>
                  Descarga una copia de todos tus datos personales y diagramas en formato JSON.
                  Incluye tu perfil, estadísticas, diagramas y plantillas creadas.
                </p>
              </section>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="profile-data-button profile-data-button--primary"
              >
                {isExporting ? 'Exportando...' : 'Exportar Datos'}
              </button>
            </article>

            <article className="profile-data-action profile-data-action--danger">
              <section className="profile-data-action-info">
                <h3>
                  <FiTrash2 /> Eliminar mi cuenta
                </h3>
                <p>
                  <strong>Acción permanente e irreversible.</strong> Se eliminarán todos tus datos,
                  diagramas, imágenes y estadísticas. Esta acción no se puede deshacer.
                </p>
              </section>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="profile-data-button profile-data-button--danger"
              >
                Eliminar Cuenta
              </button>
            </article>
          </section>
        </article>
      </section>

      {/* Modal de confirmación para eliminar cuenta */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletePassword('');
        }}
        onConfirm={handleDeleteAccount}
        title="¿Eliminar cuenta permanentemente?"
        message={
          <>
            <p>
              <strong>Esta acción es irreversible.</strong> Se eliminarán permanentemente:
            </p>
            <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
              <li>Tu perfil y datos personales</li>
              <li>Todos tus diagramas ({stats?.diagramsCreated || 0})</li>
              <li>Todas tus plantillas</li>
              <li>Todas las imágenes subidas</li>
              <li>Tus estadísticas y logros</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Para confirmar, introduce tu contraseña:
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Tu contraseña"
              style={{ 
                marginTop: '0.5rem', 
                width: '100%',
                padding: '0.625rem 0.875rem',
                background: 'rgba(31, 45, 68, 0.05)',
                border: '1px solid rgba(31, 45, 68, 0.2)',
                borderRadius: 'var(--radio-md)',
                color: 'var(--primario)',
                fontSize: '0.9rem',
                transition: 'var(--transicion-normal)'
              }}
              onFocus={(e) => {
                e.target.style.outline = 'none';
                e.target.style.borderColor = 'var(--primario)';
                e.target.style.background = 'rgba(31, 45, 68, 0.08)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(31, 45, 68, 0.2)';
                e.target.style.background = 'rgba(31, 45, 68, 0.05)';
              }}
              disabled={isDeleting}
              autoFocus
            />
          </>
        }
        confirmText={isDeleting ? 'Eliminando...' : 'Eliminar Cuenta'}
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </section>
  );
}

export default Profile;
