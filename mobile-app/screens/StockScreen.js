import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function StockScreen() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/stock-items`)
      .then(res => { setItems(res.data); setFiltered(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    setFiltered(items.filter(i => i.Name.toLowerCase().includes(text.toLowerCase())));
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#0066cc" />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search stock item..."
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.Name}</Text>
              <Text style={styles.group}>{item.GroupName}</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.qty}>Qty: {item.ClosingQty}</Text>
              <Text style={styles.rate}>₹ {item.Rate}</Text>
            </View>
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
  name: { fontSize: 15, fontWeight: '600' },
  group: { fontSize: 12, color: '#888', marginTop: 2 },
  right: { alignItems: 'flex-end' },
  qty: { fontSize: 13, color: '#555' },
  rate: { fontSize: 15, fontWeight: 'bold', color: '#4CAF50' },
});
