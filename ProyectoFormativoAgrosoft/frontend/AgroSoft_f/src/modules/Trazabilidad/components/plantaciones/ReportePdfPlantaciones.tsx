import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PdfReportes } from "@/components/ui/Reportes";
import { Plantaciones } from "../../types";

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 10,
    textAlign: "justify",
    lineHeight: 1.5,
    marginVertical: 15,
    paddingHorizontal: 10,
    fontFamily: "Helvetica",
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    backgroundColor: "#f0f0f0",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 9,
    textAlign: "center",
  },
});

type Props = {
  plantaciones: Plantaciones[];
};

export const ReportePdfPlantaciones = ({ plantaciones }: Props) => {
  if (!plantaciones || plantaciones.length === 0) {
    return (
      <Document>
        <Page style={{ padding: 30 }}>
          <PdfReportes title="reporte detallado de plantaciones" />
          <Text style={styles.paragraph}>
            No hay datos disponibles para generar el reporte de plantaciones.
          </Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page style={{ padding: 30 }}>
        <PdfReportes title="reporte detallado de plantaciones" />

        <Text style={styles.paragraph}>
          Este reporte contiene el detalle de cada plantación registrada, incluyendo el cultivo,
          semillero, unidades sembradas, fecha de siembra y la era asignada junto con su lote.
        </Text>

        <Text style={{ fontSize: 10, marginBottom: 10, marginLeft: 10 }}>
          Total de plantaciones: {plantaciones.length}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Cultivo</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Semillero</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Unidades</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Fecha siembra</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Era - Lote</Text>
            </View>
          </View>

          {plantaciones.map((p, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.cultivo?.nombre || "Sin nombre"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {p.semillero?.cultivo?.nombre
                    ? `Semillero: ${p.semillero.cultivo.nombre}`
                    : "Sin semillero"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.unidades ?? "N/A"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {p.fechaSiembra
                    ? new Date(p.fechaSiembra).toLocaleDateString("es-CO")
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {p.eras?.tipo
                    ? `${p.eras.tipo} - ${p.eras.Lote?.nombre ?? "Sin lote"}`
                    : `Era - Lote ${p.eras?.id ?? "N/A"}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
