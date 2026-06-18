import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function LedgerScreen() {
  const [ledgers, setLedgers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/ledgers`)
      .then(res => { setLedgers(res.data); setFiltered(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    setFiltered(ledgers.filter(l => l.Name.toLowerCase().includes(text.toLowerCase())));
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#0066cc" />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search ledger..."
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.Name}</Text>
            <Text style={styles.group}>{item.GroupName}</Text>
            <Text style={[styles.balance, { color: item.Balance >= 0 ? '#4CAF50' : '#f44336' }]}>
              ₹ {item.Balance}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  search: { margin: 12, padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  card: { backgroundColor: '#fff', margin: 8, marginTop: 0, padding: 14, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '600', flex: 1 },
  group: { fontSize: 12, color: '#888', flex: 1 },
  balance: { fontSize: 15, fontWeight: 'bold' },
});
