import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Avatar,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({
    subscribers: [],
    rsvps: [],
    allActivity: []
  });
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    totalRSVPs: 0,
    conversionRate: 0,
    totalRevenue: 0,
    basicCount: 0,
    proCount: 0,
    developerCount: 0,
  });

  const planPrices = {
    'Basic': 5,
    'Pro': 12,
    'Developer': 25,
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const subscribersSnapshot = await getDocs(collection(db, 'subscribers'));
      const subscribers = subscribersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date(),
          Name: data.Name || data.name || 'N/A',
          Email: data.Email || data.email || 'N/A',
          Plan: data.Plan || data.plan || 'Unknown',
          Card: data.Card || data.card || '****',
        };
      });

      const rsvpsSnapshot = await getDocs(collection(db, 'rsvps'));
      const rsvps = rsvpsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date(),
          Email: data.Email || data.email || 'N/A',
        };
      });

      const allActivity = [
        ...subscribers.map(s => ({ ...s, type: 'subscription' })),
        ...rsvps.map(r => ({ ...r, type: 'rsvp' }))
      ].sort((a, b) => b.timestamp - a.timestamp);

      setData({ subscribers, rsvps, allActivity });
      
      const basicCount = subscribers.filter(s => s.Plan === 'Basic').length;
      const proCount = subscribers.filter(s => s.Plan === 'Pro').length;
      const developerCount = subscribers.filter(s => s.Plan === 'Developer').length;
      
      const totalRevenue = subscribers.reduce((sum, sub) => {
        return sum + (planPrices[sub.Plan] || 0);
      }, 0);

      setStats({
        totalSubscribers: subscribers.length,
        totalRSVPs: rsvps.length,
        conversionRate: rsvps.length > 0 ? ((subscribers.length / rsvps.length) * 100).toFixed(1) : 0,
        totalRevenue,
        basicCount,
        proCount,
        developerCount,
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const planChartData = [
    { name: 'Basic', value: stats.basicCount },
    { name: 'Pro', value: stats.proCount },
    { name: 'Developer', value: stats.developerCount },
  ].filter(item => item.value > 0);

  const recentActivity = data.allActivity.slice(0, 10).map(activity => ({
    ...activity,
    description: activity.type === 'subscription' 
      ? `${activity.Name} subscribed to ${activity.Plan} plan`
      : `New RSVP from ${activity.Email}`,
  }));

  const filteredSubscribers = data.subscribers.filter(sub => {
    const searchStr = searchTerm.toLowerCase();
    return (
      sub.Name?.toLowerCase().includes(searchStr) ||
      sub.Email?.toLowerCase().includes(searchStr) ||
      sub.Plan?.toLowerCase().includes(searchStr)
    );
  });

  const filteredRSVPs = data.rsvps.filter(rsvp => {
    const searchStr = searchTerm.toLowerCase();
    return rsvp.Email?.toLowerCase().includes(searchStr);
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchAllData}
        >
          Refresh Data
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Subscribers</Typography>
                  <Typography variant="h4">{stats.totalSubscribers}</Typography>
                  <Typography variant="caption">Basic: {stats.basicCount} | Pro: {stats.proCount} | Dev: {stats.developerCount}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}><PeopleIcon /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total RSVPs</Typography>
                  <Typography variant="h4">{stats.totalRSVPs}</Typography>
                  <Typography variant="caption">Conversion: {stats.conversionRate}%</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}><EventIcon /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Revenue</Typography>
                  <Typography variant="h4">${stats.totalRevenue}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}><AttachMoneyIcon /></Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, or plan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Overview" />
          <Tab label="Subscribers" />
          <Tab label="RSVPs" />
          <Tab label="Activity" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6">Plan Distribution</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={planChartData}
                      cx="50%"
                      cy="50%"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {planChartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6">Revenue by Plan</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={planChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Card</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubscribers.map((sub) => (
                  <TableRow key={sub.id} hover>
                    <TableCell>{sub.Name}</TableCell>
                    <TableCell>{sub.Email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={sub.Plan} 
                        color={sub.Plan === 'Developer' ? 'primary' : sub.Plan === 'Pro' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>•••• {sub.Card.slice(-4)}</TableCell>
                    <TableCell>{sub.timestamp.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRSVPs.map((rsvp) => (
                  <TableRow key={rsvp.id} hover>
                    <TableCell>{rsvp.Email}</TableCell>
                    <TableCell>{rsvp.timestamp.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip icon={<CheckCircleIcon />} label="Confirmed" color="success" size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small"><EmailIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Activity Tab */}
        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 2, maxHeight: 600, overflow: 'auto' }}>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: activity.type === 'subscription' ? 'success.light' : 'info.light' }}>
                        {activity.type === 'subscription' ? <PaymentIcon /> : <EventIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2">
                            {activity.type === 'subscription' ? '💰 New Subscription' : '📧 New RSVP'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {activity.description}
                          </Typography>
                          {activity.type === 'subscription' && (
                            <Chip 
                              size="small" 
                              label={`Plan: ${activity.Plan}`}
                              color={activity.Plan === 'Developer' ? 'primary' : activity.Plan === 'Pro' ? 'success' : 'default'}
                              sx={{ mt: 1 }}
                            />
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </TabPanel>
      </Paper>
    </Container>
  );
}