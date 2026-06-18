import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { getDashboard, getTopCustomers, getSalesSummary } from '../api/api';
import SummaryCard from '../components/SummaryCard';

export default function DashboardScreen() {
  const [data, setData]           = useState(null);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [d, c, s] = await Promise.all([
        getDashboard(), getTopCustomers(), getSalesSummary(),
      ]);
      setData(d.data);
      setCustomers(c.data.slice(0, 5));
      setSales(s.data.slice(0, 6));
    } catch (e) {
      console.log('Dashboard error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const fmt = (v) => '₹ ' + Number(v || 0).toLocaleString('en-IN');

  if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#4A6CF7" />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAll(); }} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tally Dashboard</Text>
        <Text style={styles.headerSub}>Today's Summary</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.section}>
        <SummaryCard label="Today Sales"     value={fmt(data?.today_sales)}    color="#4A6CF7" icon="📈" />
        <SummaryCard label="Today Purchase"  value={fmt(data?.today_purchase)}  color="#10b981" icon="📦" />
        <SummaryCard label="Cash Balance"    value={fmt(data?.cash_balance)}    color="#f59e0b" icon="💵" />
        <SummaryCard label="Bank Balance"    value={fmt(data?.bank_balance)}    color="#8b5cf6" icon="🏦" />
        <SummaryCard label="Receivable"      value={fmt(data?.receivable)}      color="#ef4444" icon="📥" />
        <SummaryCard label="Payable"         value={fmt(data?.payable)}         color="#0ea5e9" icon="📤" />
      </View>

      {/* Monthly Sales */}
      {sales.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Sales</Text>
          {sales.map((s, i) => (
            <View key={i} style={styles.barRow}>
              <Text style={styles.barLabel}>{getMonth(s.Month)}</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${getPercent(s.Total, sales)}%`, backgroundColor: '#4A6CF7' }]} />
              </View>
              <Text style={styles.barValue}>{fmt(s.Total)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Top Customers */}
      {customers.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Customers</Text>
          {customers.map((c, i) => (
            <View key={i} style={styles.listRow}>
              <View style={styles.rank}><Text style={styles.rankText}>{i + 1}</Text></View>
              <Text style={styles.listName} numberOfLines={1}>{c.Name}</Text>
              <Text style={styles.listValue}>{fmt(c.Total)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const getMonth = (m) => ['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m];
const getPercent = (val, arr) => {
  const max = Math.max(...arr.map(a => a.Total));
  return max ? Math.round((val / max) * 100) : 0;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fb' },
  loader:    { flex: 1, marginTop: 100 },
  header:    { backgroundColor: '#4A6CF7', padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub:   { fontSize: 13, color: '#c7d2fe', marginTop: 2 },
  section:   { padding: 16 },
  card:      { backgroundColor: '#fff', margin: 16, marginTop: 0, borderRadius: 12, padding: 16, elevation: 3 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12, color: '#333' },
  barRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  barLabel:  { width: 35, fontSize: 12, color: '#888' },
  barBg:     { flex: 1, height: 10, backgroundColor: '#f0f0f0', borderRadius: 5, marginHorizontal: 8 },
  barFill:   { height: 10, borderRadius: 5 },
  barValue:  { fontSize: 11, color: '#444', width: 80, textAlign: 'right' },
  listRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  rank:      { width: 28, height: 28, backgroundColor: '#4A6CF7', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  rankText:  { color: '#fff', fontWeight: '700', fontSize: 13 },
  listName:  { flex: 1, fontSize: 14, color: '#333' },
  listValue: { fontSize: 14, fontWeight: '600', color: '#4A6CF7' },
});
