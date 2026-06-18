import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TextInput, TouchableOpacity, ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import { getLedgers, getLedgerStatement } from '../api/api';

export default function LedgerScreen() {
  const [ledgers, setLedgers]     = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [statement, setStatement] = useState([]);
  const [stmtLoading, setStmtLoading] = useState(false);

  useEffect(() => {
    getLedgers()
      .then(r => { setLedgers(r.data); setFiltered(r.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    setFiltered(
      ledgers.filter(l =>
        l.Name.toLowerCase().includes(text.toLowerCase()) ||
        (l.GroupName || '').toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const openLedger = async (ledger) => {
    setSelected(ledger);
    setStmtLoading(true);
    try {
      const r = await getLedgerStatement(ledger.Name);
      setStatement(r.data);
    } catch { setStatement([]); }
    setStmtLoading(false);
  };

  const fmt = (v) => '₹ ' + Number(v || 0).toLocaleString('en-IN');
  const balColor = (v) => Number(v) >= 0 ? '#10b981' : '#ef4444';

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 100 }} size="large" color="#4A6CF7" />;

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ledger or group..."
          value={search}
          onChangeText={handleSearch}
          placeholderTextColor="#aaa"
        />
        {search ? <TouchableOpacity onPress={() => handleSearch('')}><Text style={styles.clear}>✕</Text></TouchableOpacity> : null}
      </View>

      <Text style={styles.count}>{filtered.length} ledgers</Text>

      <FlatList
        data={filtered}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => openLedger(item)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.Name[0].toUpperCase()}</Text>
            </View>
            <View style={styles.rowMiddle}>
              <Text style={styles.name} numberOfLines={1}>{item.Name}</Text>
              <Text style={styles.group}>{item.GroupName || '-'}</Text>
            </View>
            <Text style={[styles.balance, { color: balColor(item.Balance) }]}>{fmt(item.Balance)}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      {/* Ledger Statement Modal */}
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>{selected?.Name}</Text>
          </View>

          <View style={styles.balRow}>
            <Text style={styles.balLabel}>Closing Balance</Text>
            <Text style={[styles.balAmt, { color: balColor(selected?.Balance) }]}>
              {fmt(selected?.Balance)}
            </Text>
          </View>

          {stmtLoading
            ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4A6CF7" />
            : statement.length === 0
              ? <Text style={styles.empty}>No transactions found</Text>
              : <FlatList
                  data={statement}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.stmtRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.stmtDate}>{item.Date}</Text>
                        <Text style={styles.stmtNarr} numberOfLines={1}>{item.Narration || item.VoucherType}</Text>
                      </View>
                      <Text style={[styles.stmtAmt, { color: item.Amount >= 0 ? '#10b981' : '#ef4444' }]}>
                        {fmt(item.Amount)}
                      </Text>
                    </View>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.sep} />}
                />
          }
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f4f6fb' },
  searchBox:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 12, borderRadius: 10, paddingHorizontal: 12, elevation: 2 },
  searchIcon:  { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, height: 44, fontSize: 14, color: '#333' },
  clear:       { fontSize: 16, color: '#aaa', padding: 4 },
  count:       { fontSize: 12, color: '#888', marginLeft: 16, marginBottom: 4 },
  row:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  avatar:      { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4A6CF7', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText:  { color: '#fff', fontWeight: '700', fontSize: 16 },
  rowMiddle:   { flex: 1 },
  name:        { fontSize: 15, fontWeight: '600', color: '#222' },
  group:       { fontSize: 12, color: '#999', marginTop: 2 },
  balance:     { fontSize: 14, fontWeight: '700' },
  sep:         { height: 1, backgroundColor: '#f0f0f0' },
  modal:       { flex: 1, backgroundColor: '#f4f6fb' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4A6CF7', padding: 16, paddingTop: 40 },
  backBtn:     { color: '#fff', fontSize: 15, marginRight: 12 },
  modalTitle:  { flex: 1, color: '#fff', fontSize: 16, fontWeight: '700' },
  balRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, margin: 12, borderRadius: 10, elevation: 2 },
  balLabel:    { fontSize: 14, color: '#888' },
  balAmt:      { fontSize: 20, fontWeight: '700' },
  empty:       { textAlign: 'center', marginTop: 60, color: '#aaa', fontSize: 15 },
  stmtRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  stmtDate:    { fontSize: 12, color: '#888' },
  stmtNarr:    { fontSize: 14, color: '#333', marginTop: 2 },
  stmtAmt:     { fontSize: 15, fontWeight: '700' },
});
