// src/components/Reportes/tablas/TablaReportes.js
import React from 'react';
import { FileText, Download, BarChart2, Trash2 } from 'lucide-react';
import { DataTable } from '../../../../components/common/DataTable';

/**
 * Define the columns and filters for the reports table.
 * This is a good practice to keep column definitions separate from the component itself.
 */
const reportColumns = [
    {
        accessorKey: 'name',
        header: 'Nombre del Reporte',
        cell: info => <div className="font-medium text-gray-900">{info.getValue()}</div>,
        enableSorting: true,
        enableSearch: true,
    },
    {
        accessorKey: 'category',
        header: 'Categoría',
        cell: info => <div className="text-gray-600">{info.getValue() || 'N/A'}</div>,
        enableSorting: true,
        enableSearch: true,
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: info => {
            const status = info.getValue();
            const statusStyles = {
                'available': 'bg-green-100 text-green-800',
                'generating': 'bg-yellow-100 text-yellow-800',
                'failed': 'bg-red-100 text-red-800',
            };
            return (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                    {status}
                </span>
            );
        },
        enableSorting: true,
        enableSearch: true,
    },
    {
        accessorKey: 'lastGenerated',
        header: 'Última Generación',
        cell: info => {
            const date = new Date(info.getValue());
            return date.toLocaleString('es-ES', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        },
        enableSorting: true,
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row, table }) => {
            const reporte = row.original;
            const { onDownload, onDelete } = table.options.meta;
            const isAvailable = reporte.status === 'available';

            return (
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onDownload(reporte)}
                        className={`p-1.5 rounded-full transition-colors ${isAvailable ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 cursor-not-allowed'}`}
                        disabled={!isAvailable}
                        title="Descargar Reporte"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(reporte)}
                        className="p-1.5 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                        title="Eliminar Reporte"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            );
        },
    },
];

/**
 * Define filters specific to reports.
 */
const reportFilters = [
    {
        id: 'status',
        label: 'Estado',
        type: 'select',
        options: [
            { value: '', label: 'Todos' },
            { value: 'available', label: 'Disponible' },
            { value: 'generating', label: 'En Proceso' },
            { value: 'failed', label: 'Fallido' },
        ],
    },
    {
        id: 'category',
        label: 'Categoría',
        type: 'select',
        options: [
            { value: '', label: 'Todos' },
            { value: 'academic', label: 'Académico' },
            { value: 'financial', label: 'Financiero' },
            { value: 'administrative', label: 'Administrativo' },
            { value: 'statistical', label: 'Estadístico' },
        ],
    },
];

/**
 * Tabla de reportes que utiliza el componente unificado DataTable.
 */
const TablaReportes = ({ 
    reportes = [], 
    loading = false,
    onDownload, 
    onDelete,
    currentCategory
}) => {
    return (
        <div>
            <DataTable
                data={reportes}
                columns={reportColumns}
                loading={loading}
                title="Tabla de Informes"
                searchPlaceholder="Buscar por nombre o categoría..."
                icon={BarChart2}
                onDownload={onDownload}
                onDelete={onDelete}
                actions={{
                    add: false,
                    edit: false,
                    view: false,
                    delete: true,
                    download: true,
                    import: false,
                    export: false,
                }}
                filters={reportFilters}
                loadingMessage="Cargando reportes..."
                emptyMessage="No se encontraron reportes en esta categoría."
                itemsPerPage={10}
                enablePagination={true}
                enableSearch={true}
                enableSort={true}
                enableFilters={true}
            />
        </div>
    );
};

export default TablaReportes;