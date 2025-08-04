import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfReportes } from '@/components/ui/Reportes';

interface ReporteUsuarios {
  total_usuarios: number;
  usuarios_activos: number;
  usuarios_inactivos: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  paragraph: {
    fontSize: 10,
    textAlign: 'justify',
    lineHeight: 1.5,
    marginVertical: 15,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica',
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    margin: "auto",
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
  },
});

export const ReportePdfUsuarios = ({ data }: { data: ReporteUsuarios }) => (
  <Document>
    <Page style={styles.page}>
      <PdfReportes title="REPORTE DE USUARIOS REGISTRADOS" />

      <Text style={styles.paragraph}>
        El presente documento contiene el reporte consolidado de usuarios del sistema Agrosoft,
        registrados en el Centro de Formación Agroindustrial del SENA Regional Huila. 
        Los datos reflejan el estado actual de los usuarios, discriminando entre cuentas 
        activas e inactivas. Esta información es válida para procesos dentro y fuera del 
        centro de formación, según se requiera.
      </Text>

      <View style={styles.table}>
        {/* Encabezados */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>USUARIOS</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>VALOR</Text>
          </View>
        </View>

        {/* Datos */}
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Total usuarios</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{data.total_usuarios}</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Usuarios activos</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{data.usuarios_activos}</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Usuarios inactivos</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{data.usuarios_inactivos}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
