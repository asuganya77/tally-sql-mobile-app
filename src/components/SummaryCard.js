import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryCard({ label, value, color, icon }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.label}>{icon}  {label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  label: { fontSize: 13, color: '#888', marginBottom: 6 },
  value: { fontSize: 22, fontWeight: '700' },
});
