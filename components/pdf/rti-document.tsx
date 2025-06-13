import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import type { RTIApplication } from "@/types/database"
import { formatDate } from "@/lib/utils"

// Create styles without custom fonts to avoid loading issues
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 10,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 10,
    color: "#6b7280",
  },
  metaBox: {
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    width: "48%",
  },
  metaTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#374151",
  },
  metaValue: {
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },
  content: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#374151",
    textAlign: "justify",
  },
  applicantSection: {
    marginTop: 30,
  },
  applicantInfo: {
    fontSize: 11,
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: "#9ca3af",
    textAlign: "center",
    paddingTop: 10,
    borderTop: "1px solid #e5e7eb",
  },
  qrCode: {
    position: "absolute",
    bottom: 30,
    right: 40,
    width: 60,
    height: 60,
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    fontSize: 10,
    color: "#9ca3af",
    textAlign: "center",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "25%",
    right: 0,
    transform: "rotate(-45deg)",
    fontSize: 60,
    color: "rgba(243, 244, 246, 0.8)",
    textAlign: "center",
    zIndex: -1,
  },
})

interface RTIDocumentProps {
  application: RTIApplication
  qrCodeDataUrl?: string
}

export const RTIDocument = ({ application, qrCodeDataUrl }: RTIDocumentProps) => {
  const { application_number, department_name, subject, content, applicant_details, created_at, status } = application

  const formattedDate = formatDate(created_at)
  const isDraft = status === "draft"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for draft */}
        {isDraft && (
          <View style={styles.watermark}>
            <Text>DRAFT</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>RTI Application</Text>
              <Text style={styles.subtitle}>Right to Information Act, 2005</Text>
            </View>
          </View>
        </View>

        {/* Meta Information */}
        <View style={styles.metaInfo}>
          <View style={styles.metaBox}>
            <Text style={styles.metaTitle}>Application Details</Text>
            <Text style={styles.metaValue}>Ref: {application_number || "Draft"}</Text>
            <Text style={styles.metaValue}>Date: {formattedDate}</Text>
            <Text style={styles.metaValue}>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaTitle}>Department</Text>
            <Text style={styles.metaValue}>{department_name}</Text>
          </View>
        </View>

        {/* To Address */}
        <View style={styles.section}>
          <Text style={styles.content}>To,</Text>
          <Text style={styles.content}>The Public Information Officer,</Text>
          <Text style={styles.content}>{department_name}</Text>
          <Text style={styles.content}>{"\n"}</Text>
        </View>

        {/* Subject */}
        <View style={styles.section}>
          <Text style={styles.content}>
            <Text style={{ fontWeight: "bold" }}>Subject: </Text>
            {subject || "Application under Right to Information Act, 2005"}
          </Text>
          <Text style={styles.content}>{"\n"}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.section}>
          <Text style={styles.content}>Sir/Madam,</Text>
          <Text style={styles.content}>{"\n"}</Text>
          <Text style={styles.content}>{content}</Text>
        </View>

        {/* Applicant Information */}
        <View style={styles.applicantSection}>
          <Text style={styles.content}>{"\n"}Thanking you,</Text>
          <Text style={styles.content}>{"\n"}</Text>
          <Text style={styles.applicantInfo}>{applicant_details.name || "[Your Name]"}</Text>
          <Text style={styles.applicantInfo}>{applicant_details.address || "[Your Address]"}</Text>
          {applicant_details.phone && <Text style={styles.applicantInfo}>Phone: {applicant_details.phone}</Text>}
          {applicant_details.email && <Text style={styles.applicantInfo}>Email: {applicant_details.email}</Text>}
          <Text style={styles.applicantInfo}>Date: {formattedDate}</Text>
        </View>

        {/* QR Code if available */}
        {qrCodeDataUrl && <Image src={qrCodeDataUrl || "/placeholder.svg"} style={styles.qrCode} />}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated via RTI Platform • Verify at rti-platform.vercel.app</Text>
        </View>

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}
