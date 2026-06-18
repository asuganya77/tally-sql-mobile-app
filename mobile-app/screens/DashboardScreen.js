import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function DashboardScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    axios.get(`${API_BASE_URL}/dashboard`)
      .then(res => { setData(res.data); setLoading(false); setRefreshing(false); })
      .catch(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#0066cc" />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
    >
      <Text style={styles.title}>Tally Dashboard</Text>
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.cardValue}>{data?.ledger_count || 0}</Text>
          <Text style={styles.cardLabel}>Ledgers</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.cardValue}>{data?.stock_count || 0}</Text>
          <Text style={styles.cardLabel}>Stock Items</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: '#FF9800' }]}>
          <Text style={styles.cardValue}>{data?.today_vouchers || 0}</Text>
          <Text style={styles.cardLabel}>Today Vouchers</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#9C27B0' }]}>
          <Text style={styles.cardValue}>₹{data?.today_sales || 0}</Text>
          <Text style={styles.cardLabel}>Today Sales</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 16 },
  loader: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  card: { flex: 1, margin: 6, padding: 20, borderRadius: 12, alignItems: 'center' },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  cardLabel: { fontSize: 13, color: '#fff', marginTop: 4 },
});
