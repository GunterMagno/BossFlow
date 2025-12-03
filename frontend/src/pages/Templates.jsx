import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTemplates, deleteTemplate } from '../services/diagramService';
import TemplateList from '../components/TemplateList/TemplateList';
import NewDiagramModal from '../components/NewDiagramModal/NewDiagramModal';
import NewTemplateModal from '../components/NewTemplateModal/NewTemplateModal';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import { useToast } from '../context/ToastContext';
import {
  FiHome,
  FiFileText,
  FiLayers,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiPlus,
} from 'react-icons/fi';
import './Dashboard.css';

function Templates() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [errorTemplates, setErrorTemplates] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateNodes, setTemplateNodes] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('predeterminadas'); // 'predeterminadas' o 'mis-plantillas'

  useEffect(() => {
    document.title = 'Plantillas | BossFlow';
  }, []);

  // Función para cargar plantillas de usuario
  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      setErrorTemplates(null);
      const response = await getTemplates();
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
      setErrorTemplates('No se pudieron cargar las plantillas.');
      setTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Cargar plantillas de usuario solo cuando se cambia a esa pestaña
  useEffect(() => {
    if (activeTab === 'mis-plantillas') {
      fetchTemplates();
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handler cuando se usa una plantilla
  const handleUseTemplate = (template) => {
    // Guardar los nodos y edges de la plantilla
    setTemplateNodes({
      nodes: template.nodes || [],
      edges: template.edges || []
    });
    // Abrir el modal para crear el diagrama
    setIsModalOpen(true);
  };

  // Handler cuando se crea un nuevo diagrama desde plantilla
  const handleDiagramCreated = () => {
    // Cerrar modal y limpiar estado
    setIsModalOpen(false);
    setTemplateNodes(null);
  };

  // Handler cuando se crea una nueva plantilla
  const handleTemplateCreated = () => {
    // Refrescar la lista de plantillas
    fetchTemplates();
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  // Handler para editar plantilla (sistema o usuario)
  const handleEditTemplate = (template) => {
    if (activeTab === 'predeterminadas') {
      // Para plantillas del sistema, abrir modal de nueva plantilla con los datos precargados
      setEditingTemplate(template);
      setIsTemplateModalOpen(true);
    } else {
      // Para plantillas de usuario, abrir modal para editar título/descripción
      setEditingTemplate(template);
      setIsTemplateModalOpen(true);
    }
  };

  // Handler para eliminar plantilla
  const handleDeleteTemplate = (template) => {
    setTemplateToDelete(template);
  };

  // Confirmar eliminación de plantilla
  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      await deleteTemplate(templateToDelete._id);
      toast.success('Plantilla eliminada correctamente');
      fetchTemplates();
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
      toast.error('No se pudo eliminar la plantilla');
    } finally {
      setTemplateToDelete(null);
    }
  };

  // Obtener plantillas según la pestaña activa
  const displayedTemplates = activeTab === 'predeterminadas' 
    ? DEFAULT_TEMPLATES
    : templates;

  // Estados de carga según pestaña activa
  const isLoading = activeTab === 'mis-plantillas' && loadingTemplates;
  const currentError = activeTab === 'mis-plantillas' ? errorTemplates : null;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard__sidebar">
        <div className="dashboard__sidebar-contenido">
          <div className="dashboard__logo">
            <h2>BossFlow</h2>
          </div>

          <nav className="dashboard__nav">
            <Link
              to="/dashboard"
              className="dashboard__nav-item"
            >
              <FiHome className="dashboard__nav-icono" />
              <span>Inicio</span>
            </Link>

            <Link
              to="/dashboard"
              className="dashboard__nav-item"
            >
              <FiFileText className="dashboard__nav-icono" />
              <span>Mis diagramas</span>
            </Link>

            <Link
              to="/dashboard/colaboraciones"
              className="dashboard__nav-item"
            >
              <FiUsers className="dashboard__nav-icono" />
              <span>Colaboraciones</span>
            </Link>

            <Link
              to="/dashboard/plantillas"
              className="dashboard__nav-item dashboard__nav-item--activo"
            >
              <FiLayers className="dashboard__nav-icono" />
              <span>Plantillas</span>
            </Link>

            <Link
              to="/dashboard/comentarios"
              className="dashboard__nav-item"
            >
              <FiMessageSquare className="dashboard__nav-icono" />
              <span>Comentarios</span>
            </Link>

            <Link
              to="/settings"
              className="dashboard__nav-item"
            >
              <FiSettings className="dashboard__nav-icono" />
              <span>Configuración</span>
            </Link>
          </nav>

          <button className="dashboard__logout" onClick={handleLogout}>
            <FiLogOut className="dashboard__nav-icono" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="dashboard__main">
        <section className="dashboard__seccion">
          <div className="dashboard__seccion-header">
            <div>
              <h2 className="dashboard__titulo">Plantillas</h2>
              <p className="dashboard__descripcion">
                Crea diagramas rápidamente usando plantillas predefinidas
              </p>
            </div>
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="dashboard__boton-nuevo"
            >
              <FiPlus className="dashboard__boton-icono" />
              Nueva plantilla
            </button>
          </div>

          {/* Pestañas */}
          <div className="dashboard__tabs">
            <button
              className={`dashboard__tab ${activeTab === 'predeterminadas' ? 'dashboard__tab--active' : ''}`}
              onClick={() => setActiveTab('predeterminadas')}
            >
              Predeterminadas
            </button>
            <button
              className={`dashboard__tab ${activeTab === 'mis-plantillas' ? 'dashboard__tab--active' : ''}`}
              onClick={() => setActiveTab('mis-plantillas')}
            >
              Mis plantillas
            </button>
          </div>

          <TemplateList
            templates={displayedTemplates}
            loading={isLoading}
            error={currentError}
            onUseTemplate={handleUseTemplate}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onRetry={fetchTemplates}
            onCreateTemplate={() => setIsTemplateModalOpen(true)}
            showCreateButton={activeTab === 'mis-plantillas'}
            isSystemTemplates={activeTab === 'predeterminadas'}
          />
        </section>
      </main>

      {/* Modal para crear nuevo diagrama desde plantilla */}
      <NewDiagramModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTemplateNodes(null);
        }}
        onDiagramCreated={handleDiagramCreated}
        initialNodes={templateNodes?.nodes}
        initialEdges={templateNodes?.edges}
      />

      {/* Modal para crear nueva plantilla */}
      <NewTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setEditingTemplate(null);
        }}
        onTemplateCreated={handleTemplateCreated}
        initialNodes={editingTemplate?.nodes}
        initialEdges={editingTemplate?.edges}
        initialTitle={
          editingTemplate 
            ? (activeTab === 'predeterminadas' 
                ? `Copia de ${editingTemplate.title}` 
                : editingTemplate.title)
            : ''
        }
        initialDescription={editingTemplate?.description || ''}
        editingTemplateId={
          activeTab === 'mis-plantillas' && editingTemplate 
            ? editingTemplate.id
            : null
        }
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!templateToDelete}
        onClose={() => setTemplateToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar plantilla?"
        message={`¿Estás seguro de que quieres eliminar la plantilla "${templateToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}

export default Templates;
