// BookingScreen.tsx
import React, { useState } from "react";
import {
  Button,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from 'expo-router';

const serviceOptions = [
  { label: "Router Setup", value: "router setup" },
  { label: "Fibre Installation", value: "fibre installation" },
  { label: "Cabling", value: "cabling" },
  { label: "Home Visit", value: "home visit" },
  { label: "Other", value: "other" },
];

const paymentOptions = [
 
  { label: "EFT", value: "eft" },
  { label: "Airtime Billing", value: "airtime billing" },
];

const prices: Record<string, number> = {
  "router setup": 473,
  "fibre installation": 2300,
  "cabling": 685,
  "home visit": 1035,
  "other": 0,
};

export default function BookingScreen() {
  const params = useLocalSearchParams();
  const allowed = params.allowed === 'true';

  if (!allowed) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.statusText}>You must speak to an agent first to book a technician.</Text>
      </SafeAreaView>
    );
  }

  const [serviceType, setServiceType] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isPriority, setIsPriority] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string>("");
  const [notification, setNotification] = useState<string>(""); // new state for notification
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState<string>("");

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(Platform.OS === "ios");
    setDate(currentTime);
  };

  // format time into hh:mm AM/PM
  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // calculate arrival window (start = selected time, end = +3 hours)
  const getArrivalWindow = (selected: Date) => {
    const start = new Date(selected);
    const end = new Date(selected);
    end.setHours(end.getHours() + 3);
    return `${formatTime(start)} – ${formatTime(end)}`;
  };

  const handlePayAndBook = () => {
    if (!serviceType || !paymentMethod || !address) {
      setBookingStatus("Please select service type, payment method, and enter address.");
      return;
    }
    setShowModal(true);
  };

  const confirmBooking = () => {
    setShowModal(false);
    const priorityText = isPriority ? " (Priority Help enabled)" : "";
    setBookingStatus(
      `Booking confirmed for ${serviceType}${priorityText} on ${date.toLocaleString()}. Request sent to agent.`
    );
    setNotification(
      `Technician booked. Arrival window: ${getArrivalWindow(date)}.`
    ); // dynamic arrival window
  };

  const basePrice = prices[serviceType] || 0;
  const priorityFee = isPriority ? 20 : 0;
  const totalPrice = basePrice + priorityFee;

  const priceDisplay =
    serviceType === "other"
      ? "Price: Contact for quote\n(Priority Fee if applicable)"
      : `Base Price: R${basePrice.toFixed(
          2
        )}\n${
          isPriority
            ? `Priority Fee: R${priorityFee.toFixed(
                2
              )} (added to Telkom contract bill)\n`
            : ""
        }Total: R${totalPrice.toFixed(2)}`;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Telkom Technician Booking</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Book a Technician</Text>

        <Text style={styles.label}>Select Type of Service:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={serviceType}
            onValueChange={(itemValue) => setServiceType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Choose service..." value="" />
            {serviceOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Current Address (where the problem is):</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
        />

        <Text style={styles.label}>Preferred Date:</Text>
        <Button
          onPress={() => setShowDatePicker(true)}
          title="Select Date"
          color="#0057B8"
        />
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Preferred Time:</Text>
        <Button
          onPress={() => setShowTimePicker(true)}
          title="Select Time"
          color="#0057B8"
        />
        {showTimePicker && (
          <DateTimePicker
            testID="timeTimePicker"
            value={date}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}

        <View style={styles.prioritySection}>
          <Text style={styles.priorityLabel}>
            Priority Help: Pay extra R20 on your Telkom contract for faster support (moved to front of queue).
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#D32F2F" }}
            thumbColor={isPriority ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsPriority}
            value={isPriority}
            style={styles.prioritySwitch}
          />
        </View>

        <Text style={styles.priceText}>{priceDisplay}</Text>

        <Text style={styles.label}>Payment Method:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Choose payment..." value="" />
            {paymentOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>

        <Button
          onPress={handlePayAndBook}
          title="Pay and Book"
          color="#00A84F"
          disabled={
            !serviceType ||
            !paymentMethod ||
            !address ||
            (serviceType === "other" && basePrice === 0)
          }
        />

        {bookingStatus && (
          <Text style={styles.statusText}>{bookingStatus}</Text>
        )}

        {notification && (
          <Text style={styles.notificationText}>{notification}</Text>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Confirm Payment</Text>
            <Text style={styles.modalText}>Service: {serviceType}</Text>
            <Text style={styles.modalText}>Address: {address}</Text>
            <Text style={styles.modalText}>
              Date/Time: {date.toLocaleString()}
            </Text>
            <Text style={styles.modalText}>
              Priority: {isPriority ? "Yes (extra R20 on Telkom contract)" : "No"}
            </Text>
            <Text style={styles.modalText}>Payment Method: {paymentMethod}</Text>
            <Text style={styles.modalText}>
              Total to Pay Now: R{basePrice.toFixed(2)} (Priority fee separate if applicable)
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                color="#D32F2F"
                onPress={() => setShowModal(false)}
              />
              <Button title="Confirm" color="#00A84F" onPress={confirmBooking} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0057B8",
    textAlign: "center",
    marginTop: 100,
    marginBottom: 25,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0057B8",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D7E0",
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D7E0",
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  prioritySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    padding: 12,
    backgroundColor: "#FFECEC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D32F2F",
  },
  priorityLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  prioritySwitch: {
    marginLeft: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00A84F",
    marginVertical: 16,
    textAlign: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#0033a0",
    marginTop: 24,
    textAlign: "center",
  },
  notificationText: {
    fontSize: 16,
    color: "#D32F2F",
    marginTop: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0033a0",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    textAlign: "left",
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
});