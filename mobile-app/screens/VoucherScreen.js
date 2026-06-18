import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const TYPES = ['All', 'Sales', 'Purchase', 'Receipt', 'Payment'];

export default function VoucherScreen() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('All');

  const fetchVouchers = (type) => {
    setLoading(true);
    const url = type === 'All' ? `${API_BASE_URL}/vouchers` : `${API_BASE_URL}/vouchers/${type}`;
    axios.get(url)
      .then(res => { setVouchers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchVouchers('All'); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TYPES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeType === t && styles.activeTab]}
            onPress={() => { setActiveType(t); fetchVouchers(t); }}
          >
            <Text style={[styles.tabText, activeType === t && styles.activeTabText]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading
        ? <ActivityIndicator style={{ flex: 1 }} size="large" color="#0066cc" />
        : <FlatList
            data={vouchers}
            keyExtractor={(item, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.vno}>{item.VoucherNo}</Text>
                  <Text style={styles.date}>{item.Date}</Text>
                  <Text style={styles.narration}>{item.Narration}</Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.type}>{item.Type}</Text>
                  <Text style={styles.amount}>₹ {item.Amount}</Text>
                </View>
              </View>
            )}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 4 },
  tab: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginHorizontal: 3 },
  activeTab: { backgroundColor: '#0066cc' },
  tabText: { fontSize: 12, color: '#666' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', margin: 8, marginTop: 4, padding: 14, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between' },
  vno: { fontSize: 14, fontWeight: '600' },
  date: { fontSize: 12, color: '#888' },
  narration: { fontSize: 12, color: '#999', marginTop: 2 },
  right: { alignItems: 'flex-end' },
  type: { fontSize: 11, color: '#0066cc', backgroundColor: '#e3f2fd', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  amount: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 4 },
});
