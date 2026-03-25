import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Modal,
} from "react-native";

const examTypes = [
  { type: "Medical", amount: 50, icon: "🏥" },
  { type: "Resit", amount: 30, icon: "📝" },
  { type: "Proper", amount: 20, icon: "🔄" },
];

export default function RecordScreen({ route, navigation }) {
  const { subjects } = route.params;

  const [studentName, setStudentName] = useState("");
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [errors, setErrors] = useState({ name: "", examType: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const calculateTotal = () => {
    if (!selectedExamType) return 0;
    const baseAmount = examTypes.find((e) => e.type === selectedExamType)?.amount || 0;
    return baseAmount * subjects.length;
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = { name: "", examType: "" };

    if (!studentName.trim()) {
      newErrors.name = "Student name is required";
      valid = false;
    }

    if (!selectedExamType) {
      newErrors.examType = "Please select an exam type";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleConfirm = () => {
    if (!validateInputs()) {
      if (Platform.OS === 'web') {
        alert("Please fill all required fields");
      } else {
        Alert.alert("Validation Error", "Please fill all required fields");
      }
      return;
    }

    // Show success modal (works on all platforms)
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = async () => {
    setShowSuccessModal(false);
    // Clear user session and navigate to login
    try {
      const AsyncStorage = require("@react-native-async-storage/async-storage").default;
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
    // Navigate to login page
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Exam Registration</Text>
          <Text style={styles.subtitle}>Complete your registration details</Text>
        </View>

        {/* Student Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              style={[styles.input, errors.name && styles.inputError]}
              value={studentName}
              onChangeText={(text) => {
                setStudentName(text);
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>
        </View>

        {/* Selected Subjects Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Subjects ({subjects.length})</Text>
          <View style={styles.subjectsContainer}>
            {subjects.map((subject, index) => (
              <View key={index} style={styles.subjectChip}>
                <Text style={styles.subjectChipText}>{subject}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Exam Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exam Entry Type *</Text>
          {errors.examType && !selectedExamType ? (
            <Text style={styles.errorText}>{errors.examType}</Text>
          ) : null}

          {examTypes.map((exam) => (
            <TouchableOpacity
              key={exam.type}
              style={[
                styles.examTypeCard,
                selectedExamType === exam.type && styles.examTypeCardSelected,
              ]}
              onPress={() => {
                setSelectedExamType(exam.type);
                setErrors({ ...errors, examType: "" });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.examTypeContent}>
                <Text style={styles.examTypeIcon}>{exam.icon}</Text>
                <View style={styles.examTypeInfo}>
                  <Text
                    style={[
                      styles.examTypeName,
                      selectedExamType === exam.type && styles.examTypeNameSelected,
                    ]}
                  >
                    {exam.type}
                  </Text>
                  <Text
                    style={[
                      styles.examTypePrice,
                      selectedExamType === exam.type && styles.examTypePriceSelected,
                    ]}
                  >
                    ${exam.amount} per subject
                  </Text>
                </View>
              </View>
              {selectedExamType === exam.type && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Summary */}
        {selectedExamType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Exam Type:</Text>
                <Text style={styles.paymentValue}>{selectedExamType}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Number of Subjects:</Text>
                <Text style={styles.paymentValue}>{subjects.length}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Price per Subject:</Text>
                <Text style={styles.paymentValue}>
                  ${examTypes.find((e) => e.type === selectedExamType)?.amount}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.paymentRow}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>${calculateTotal()}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Confirm Registration</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseSuccess}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✅</Text>
            </View>

            <Text style={styles.successTitle}>Registration Successful!</Text>
            <Text style={styles.successMessage}>
              Your exam registration has been confirmed.
            </Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Student Name:</Text>
                <Text style={styles.summaryValue}>{studentName}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Exam Type:</Text>
                <Text style={styles.summaryValue}>{selectedExamType}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subjects:</Text>
                <Text style={styles.summaryValue}>{subjects.length}</Text>
              </View>

              <View style={styles.dividerLine} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>${calculateTotal()}</Text>
              </View>
            </View>

            <View style={styles.subjectsBox}>
              <Text style={styles.subjectsTitle}>Registered Subjects:</Text>
              {subjects.map((subject, index) => (
                <Text key={index} style={styles.subjectItem}>
                  • {subject}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleCloseSuccess}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#e3f2fd",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "#e74c3c",
    borderWidth: 2,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  subjectChip: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  subjectChipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  examTypeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  examTypeCardSelected: {
    borderColor: "#4A90E2",
    backgroundColor: "#e3f2fd",
  },
  examTypeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  examTypeIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  examTypeInfo: {
    flex: 1,
  },
  examTypeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  examTypeNameSelected: {
    color: "#4A90E2",
  },
  examTypePrice: {
    fontSize: 14,
    color: "#666",
  },
  examTypePriceSelected: {
    color: "#4A90E2",
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIndicatorText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666",
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 80,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60",
    textAlign: "center",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  subjectsList: {
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  subjectsListTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: 10,
  },
  subjectItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: "#27ae60",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    maxWidth: 450,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 80,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#27ae60",
    textAlign: "center",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  summaryBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  subjectsBox: {
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    padding: 18,
    marginBottom: 25,
  },
  subjectsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: 12,
  },
  doneButton: {
    backgroundColor: "#27ae60",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
