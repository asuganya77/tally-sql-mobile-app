import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Modal, TextInput, ScrollView,
} from 'react-native';
import { getVouchers, getVoucherDetail } from '../api/api';

const TYPES = ['All', 'Sales', 'Purchase', 'Receipt', 'Payment', 'Journal'];
const TYPE_COLORS = {
  Sales: '#4A6CF7', Purchase: '#10b981', Receipt: '#f59e0b',
  Payment: '#ef4444', Journal: '#8b5cf6', All: '#64748b',
};

export default function VoucherScreen() {
  const [vouchers, setVouchers]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeType, setActiveType] = useState('All');
  const [selected, setSelected]   = useState(null);
  const [fromDate, setFromDate]   = useState('');
  const [toDate, setToDate]       = useState('');

  const fetchVouchers = useCallback(async (type, from, to) => {
    setLoading(true);
    try {
      const params = {};
      if (type && type !== 'All') params.type = type;
      if (from) params.from = from;
      if (to)   params.to   = to;
      const r = await getVouchers(params);
      setVouchers(r.data);
    } catch (e) { console.log(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchVouchers('All', '', ''); }, [fetchVouchers]);

  const changeType = (t) => {
    setActiveType(t);
    fetchVouchers(t, fromDate, toDate);
  };

  const fmt = (v) => '₹ ' + Number(v || 0).toLocaleString('en-IN');
  const typeColor = (t) => TYPE_COLORS[t] || '#64748b';

  return (
    <View style={styles.container}>

      {/* Type Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {TYPES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, { backgroundColor: activeType === t ? typeColor(t) : '#f0f0f0' }]}
            onPress={() => changeType(t)}
          >
            <Text style={[styles.tabText, { color: activeType === t ? '#fff' : '#666' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Date Filter */}
      <View style={styles.dateRow}>
        <TextInput
          style={styles.dateInput}
          placeholder="From (YYYY-MM-DD)"
          value={fromDate}
          onChangeText={setFromDate}
          placeholderTextColor="#bbb"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="To (YYYY-MM-DD)"
          value={toDate}
          onChangeText={setToDate}
          placeholderTextColor="#bbb"
        />
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => fetchVouchers(activeType, fromDate, toDate)}
        >
          <Text style={styles.filterBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.count}>{vouchers.length} vouchers</Text>

      {loading
        ? <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#4A6CF7" />
        : <FlatList
            data={vouchers}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
                <View style={[styles.typeBadge, { backgroundColor: typeColor(item.Type) }]}>
                  <Text style={styles.typeBadgeText}>{(item.Type || '').slice(0, 3).toUpperCase()}</Text>
                </View>
                <View style={styles.cardMiddle}>
                  <Text style={styles.vno}>{item.VoucherNo}</Text>
                  <Text style={styles.narr} numberOfLines={1}>{item.Narration || item.Type}</Text>
                  <Text style={styles.date}>{item.Date}</Text>
                </View>
                <Text style={[styles.amt, { color: typeColor(item.Type) }]}>{fmt(item.Amount)}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f0f0f0' }} />}
          />
      }

      {/* Voucher Detail Modal */}
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modal}>
          <View style={[styles.modalHeader, { backgroundColor: typeColor(selected?.Type) }]}>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Voucher Detail</Text>
          </View>

          <ScrollView style={{ padding: 16 }}>
            {[
              ['Voucher No', selected?.VoucherNo],
              ['Type', selected?.Type],
              ['Date', selected?.Date],
              ['Amount', fmt(selected?.Amount)],
              ['Narration', selected?.Narration],
            ].map(([label, val]) => (
              <View key={label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{val || '-'}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f4f6fb' },
  tabs:           { paddingHorizontal: 12, paddingVertical: 10, flexGrow: 0 },
  tab:            { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, marginRight: 8 },
  tabText:        { fontSize: 13, fontWeight: '600' },
  dateRow:        { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 6, gap: 6 },
  dateInput:      { flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, height: 38, fontSize: 12, color: '#333', elevation: 1 },
  filterBtn:      { backgroundColor: '#4A6CF7', borderRadius: 8, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  filterBtnText:  { color: '#fff', fontWeight: '700' },
  count:          { fontSize: 12, color: '#888', marginLeft: 16, marginBottom: 4 },
  card:           { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  typeBadge:      { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  typeBadgeText:  { color: '#fff', fontWeight: '700', fontSize: 12 },
  cardMiddle:     { flex: 1 },
  vno:            { fontSize: 14, fontWeight: '700', color: '#222' },
  narr:           { fontSize: 12, color: '#888', marginTop: 2 },
  date:           { fontSize: 11, color: '#bbb', marginTop: 2 },
  amt:            { fontSize: 15, fontWeight: '700' },
  modal:          { flex: 1, backgroundColor: '#f4f6fb' },
  modalHeader:    { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 40 },
  backBtn:        { color: '#fff', fontSize: 15, marginRight: 12 },
  modalTitle:     { flex: 1, color: '#fff', fontSize: 16, fontWeight: '700' },
  detailRow:      { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel:    { fontSize: 13, color: '#888', flex: 1 },
  detailValue:    { fontSize: 14, fontWeight: '600', color: '#222', flex: 2, textAlign: 'right' },
});
