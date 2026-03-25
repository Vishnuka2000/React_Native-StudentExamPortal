import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const subjects = [
  { id: "1", name: "Data Mining And Data warehousing", icon: "🗄️" },
  { id: "2", name: "Digital Image Processing", icon: "🖼️" },
  { id: "3", name: "E-Commerce", icon: "🛒" },
  { id: "4", name: "Mobile Application And Development", icon: "📱" },
  { id: "5", name: "Intelligent System", icon: "🤖" },
  { id: "6", name: "Cloud Application Development", icon: "☁️" },
  { id: "7", name: "Applied Bio-informatics", icon: "🧬" },
]

export default function HomeScreen({ navigation }) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleProceed = () => {
    if (selectedSubjects.length === 0) {
      Alert.alert(
        "No Subjects Selected",
        "Please select at least one subject to continue.",
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate("Record", { subjects: selectedSubjects });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.replace("Login");
          },
        },
      ]
    );
  };

  const renderSubjectCard = ({ item }) => {
    const isSelected = selectedSubjects.includes(item.name);

    return (
      <TouchableOpacity
        style={[styles.subjectCard, isSelected && styles.selectedCard]}
        onPress={() => toggleSubject(item.name)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <Text style={styles.subjectIcon}>{item.icon}</Text>
          <Text style={[styles.subjectText, isSelected && styles.selectedText]}>
            {item.name}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.usernameText}>Reg No: {username}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Select Your Subjects</Text>
        <Text style={styles.subtitle}>
          Choose the subjects you want to register for the exam
        </Text>

        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          renderItem={renderSubjectCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? "s" : ""} selected
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.proceedButton,
              selectedSubjects.length === 0 && styles.proceedButtonDisabled,
            ]}
            onPress={handleProceed}
            activeOpacity={0.8}
          >
            <Text style={styles.proceedButtonText}>
              Continue to Registration
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  usernameText: {
    fontSize: 14,
    color: "#e3f2fd",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  subjectIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  selectedText: {
    color: "#fff",
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#4A90E2",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  selectionInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  selectionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  proceedButton: {
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
  proceedButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0.1,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
