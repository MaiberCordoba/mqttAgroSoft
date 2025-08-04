import { useState } from "react";
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { ControlDetails } from "../../types";

interface Props {
  controles: ControlDetails[];
}

const estadoLabels: Record<string, string> = {
  ST: "Detectado",
  EC: "EnTratamiento",
  EL: "Erradicado",
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#2e86de",
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 20,
    paddingHorizontal: 5,
    color: "#333",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#d1e7ff",
    borderColor: "#aaa",
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#ddd",
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: "flex-start",
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1b4f72",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 11,
    color: "#222",
    textAlign: "left",
  },
});

const ReportePdfControles = ({ controles }: { controles: ControlDetails[] }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>REPORTE DE CONTROLES DE AFECCIONES</Text>
      <Text style={styles.paragraph}>
        Este documento contiene el reporte consolidado de controles realizados sobre las afecciones detectadas en
        cultivos. Se presenta información relevante para el seguimiento y gestión de las acciones realizadas.
      </Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Fecha Control</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Descripción</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Afección</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Cultivo</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Estado</Text>
          </View>
        </View>

        {controles.map((control) => {
          const estadoCod = control.afeccion?.estado || "";
          return (
            <View style={styles.tableRow} key={control.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {control.fechaControl ? new Date(control.fechaControl).toLocaleDateString() : "N/D"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{control.descripcion ?? "Sin descripción"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{control.afeccion?.plagas?.nombre ?? "N/D"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{control.afeccion?.plantaciones?.cultivo?.nombre ?? "N/D"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{estadoLabels[estadoCod] ?? "N/D"}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

const ListaControles = ({ controles }: Props) => {
  const [tipoBusqueda, setTipoBusqueda] = useState<string>("");
  const [cultivoBusqueda, setCultivoBusqueda] = useState<string>("");
  const [estadoBusqueda, setEstadoBusqueda] = useState<string>("");

  const controlesFiltrados = controles.filter((control) => {
    const tipo = control.tipoControl?.nombre?.toLowerCase() || "";
    const cultivo = control.afeccion?.plantaciones?.cultivo?.nombre?.toLowerCase() || "";
    const estadoCod = control.afeccion?.estado || "";
    const estadoNombre = estadoLabels[estadoCod] || "";

    return (
      (!tipoBusqueda || tipo.includes(tipoBusqueda.toLowerCase())) &&
      (!cultivoBusqueda || cultivo.includes(cultivoBusqueda.toLowerCase())) &&
      (!estadoBusqueda || estadoNombre.toLowerCase() === estadoBusqueda.toLowerCase())
    );
  });

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Lista de Controles</h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Tipo de control:</label>
          <input
            type="text"
            value={tipoBusqueda}
            onChange={(e) => setTipoBusqueda(e.target.value)}
            placeholder="Ej: químico, biológico..."
            className="p-2 border rounded-md w-full"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Cultivo:</label>
          <input
            type="text"
            value={cultivoBusqueda}
            onChange={(e) => setCultivoBusqueda(e.target.value)}
            placeholder="Ej: Tomate, Maíz..."
            className="p-2 border rounded-md w-full"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Estado de la Afección:</label>
          <select
            value={estadoBusqueda}
            onChange={(e) => setEstadoBusqueda(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">Todos</option>
            <option value="Detectado">Detectado</option>
            <option value="EnTratamiento">EnTratamiento</option>
            <option value="Erradicado">Erradicado</option>
          </select>
        </div>
      </div>

      {/* Botón de descarga PDF con ícono Download */}
      <div className="flex justify-end mb-6">
        <PDFDownloadLink
          document={<ReportePdfControles controles={controlesFiltrados} />}
          fileName="controles.pdf"
          className="hover:scale-105 transition-transform"
          style={{ pointerEvents: controlesFiltrados.length === 0 ? "none" : "auto" }}
        >
          {({ loading }) =>
            controlesFiltrados.length > 0 && (
              <div
                className={`cursor-pointer p-2 rounded-full hover:bg-blue-100 transition-all ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
                title={loading ? "Generando PDF..." : "Descargar PDF"}
              >
                <Download className="w-6 h-6 text-blue-600" />
              </div>
            )
          }
        </PDFDownloadLink>
      </div>

      {/* Lista de controles */}
      <div>
        {controlesFiltrados.length === 0 ? (
          <p>No se encontraron controles con los filtros seleccionados.</p>
        ) : (
          controlesFiltrados.map((control) => {
            const estadoCod = control.afeccion?.estado || "";
            const estadoStyles: Record<string, string> = {
              ST: "bg-green-100 border-l-4 border-green-500 shadow shadow-green-500/40",
              EC: "bg-yellow-100 border-l-4 border-yellow-500 shadow shadow-yellow-500/40",
              EL: "bg-red-100 border-l-4 border-red-500 shadow shadow-red-500/40",
            };
            const estilo = estadoStyles[estadoCod] || "bg-gray-100 border-l-4 border-gray-400 shadow";

            return (
              <div key={control.id} className={`p-4 rounded mb-4 ${estilo}`}>
                <p>
                  <strong>Fecha del Control:</strong>{" "}
                  {control.fechaControl
                    ? new Date(control.fechaControl).toLocaleDateString()
                    : "Fecha no disponible"}
                </p>
                <p>
                  <strong>Descripción:</strong> {control.descripcion ?? "Sin descripción"}
                </p>
                <p>
                  <strong>Afección:</strong> {control.afeccion?.plagas?.nombre ?? "No disponible"}
                </p>
                <p>
                  <strong>Tipo de afección:</strong> {control.afeccion?.plagas?.tipoPlaga?.nombre ?? "No disponible"}
                </p>
                <p>
                  <strong>Cultivo:</strong> {control.afeccion?.plantaciones?.cultivo?.nombre ?? "No disponible"}
                </p>
                <p>
                  <strong>Tipo de Control:</strong> {control.tipoControl?.nombre ?? "No disponible"}
                </p>
                <p>
                  <strong>Estado de la Afección:</strong> {estadoLabels[estadoCod] ?? "No disponible"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListaControles;
