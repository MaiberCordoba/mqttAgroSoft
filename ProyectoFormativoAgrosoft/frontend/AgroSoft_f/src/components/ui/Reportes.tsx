import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logosDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  logosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    height: 50,
    width: 'auto',
  },
  titleContainer: {
    textAlign: 'center',
    marginVertical: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#003366', 
  },
  subtitle: {
    fontSize: 10,
    marginTop: 5,
    color: '#555',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#666',
    borderTop: '1px solid #003366',
    paddingTop: 5,
    marginTop: 10,
  },
});

interface PdfReportesProps {
  title: string;
  subtitle?: string;
  regional?: string;
  centroFormacion?: string;
  codigoDocumento?: string;
}

export const PdfReportes = ({
  title,
  subtitle = "Sistema de Gestión Agrosoft",
  regional = "Regional Huila",
  centroFormacion = "Centro de Formación Surcolombiano Yamboro",

}: PdfReportesProps) => {
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <View style={styles.container}>
      {/* Línea superior: Logos */}
      <View style={styles.header}>
        <View style={styles.logosContainer}>
          <Image src="../../../public/sena.png" style={styles.logo} />
          <View style={styles.logosDivider} />
          <Image src="../../../public/logoAgrosoft.png" style={styles.logo} />
        </View>
        
        <View>
          <Text style={{ fontSize: 8 }}>{getCurrentDate()}</Text>
        </View>
      </View>

      {/* Título centrado */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Metadata institucional */}
      <View style={styles.metadata}>
        <Text>{regional}</Text>
        <Text>{centroFormacion}</Text>
      </View>
    </View>
  );
};