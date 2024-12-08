<template>
  <div class="orders-container">
    <h1>Orders</h1>

    <!-- Tabs -->
    <div class="tabs">
      <button @click="activeTab = 'pending'" :class="{ active: activeTab === 'pending' }">New Orders (Pending)</button>
      <button @click="activeTab = 'shipped'" :class="{ active: activeTab === 'shipped' }">Sended Orders</button>
      <button @click="activeTab = 'canceled'" :class="{ active: activeTab === 'canceled' }">Cancelled Orders</button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Display orders based on active tab -->
    <div v-if="!loading && !error">
      <ul v-if="activeTab === 'pending' && pendingOrders.length > 0">
        <li v-for="order in pendingOrders" :key="order._id">
          <strong>Order Time:</strong> {{ formatOrderTime(order.createdAt) }}<br>
          <strong>Order ID:</strong> {{ order._id }}<br>
          <strong>Laces Color:</strong> {{ order.customizations?.laces?.color || 'N/A' }}<br>
          <strong>Sole Top Color:</strong> {{ order.customizations?.sole_top?.color || 'N/A' }}<br>
          <strong>Meshes 5-1 Color:</strong> {{ order.customizations?.meshes5_1?.color || 'N/A' }}<br>
          <strong>Outside 1 Color:</strong> {{ order.customizations?.outside_1?.color || 'N/A' }}<br>
          <strong>Outside 2 Color:</strong> {{ order.customizations?.outside_2?.color || 'N/A' }}<br>
          <strong>Outside 3 Color:</strong> {{ order.customizations?.outside_3?.color || 'N/A' }}<br>
          <strong>Sole Bottom Color:</strong> {{ order.customizations?.sole_bottom?.color || 'N/A' }}<br>
          
          <!-- Dropdown to change order status -->
          <select v-model="order.status" @change="updateOrderStatus(order)">
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="canceled">Canceled</option>
          </select>
          <button @click="deleteOrder(order._id)">Delete</button>
          <hr>
        </li>
      </ul>

      <ul v-if="activeTab === 'shipped' && sendOrders.length > 0">
        <li v-for="order in sendOrders" :key="order._id">
          <strong>Order Time:</strong> {{ formatOrderTime(order.createdAt) }}<br>
          <strong>Order ID:</strong> {{ order._id }}<br>
          <strong>Laces Color:</strong> {{ order.customizations?.laces?.color || 'N/A' }}<br>
          <strong>Sole Top Color:</strong> {{ order.customizations?.sole_top?.color || 'N/A' }}<br>
          <strong>Meshes 5-1 Color:</strong> {{ order.customizations?.meshes5_1?.color || 'N/A' }}<br>
          <strong>Outside 1 Color:</strong> {{ order.customizations?.outside_1?.color || 'N/A' }}<br>
          <strong>Outside 2 Color:</strong> {{ order.customizations?.outside_2?.color || 'N/A' }}<br>
          <strong>Outside 3 Color:</strong> {{ order.customizations?.outside_3?.color || 'N/A' }}<br>
          <strong>Sole Bottom Color:</strong> {{ order.customizations?.sole_bottom?.color || 'N/A' }}<br>
          <hr>
        </li>
      </ul>

      <ul v-if="activeTab === 'canceled' && canceledOrders.length > 0">
        <li v-for="order in canceledOrders" :key="order._id">
          <strong>Order Time:</strong> {{ formatOrderTime(order.createdAt) }}<br>
          <strong>Order ID:</strong> {{ order._id }}<br>
          <strong>Laces Color:</strong> {{ order.customizations?.laces?.color || 'N/A' }}<br>
          <strong>Sole Top Color:</strong> {{ order.customizations?.sole_top?.color || 'N/A' }}<br>
          <strong>Meshes 5-1 Color:</strong> {{ order.customizations?.meshes5_1?.color || 'N/A' }}<br>
          <strong>Outside 1 Color:</strong> {{ order.customizations?.outside_1?.color || 'N/A' }}<br>
          <strong>Outside 2 Color:</strong> {{ order.customizations?.outside_2?.color || 'N/A' }}<br>
          <strong>Outside 3 Color:</strong> {{ order.customizations?.outside_3?.color || 'N/A' }}<br>
          <strong>Sole Bottom Color:</strong> {{ order.customizations?.sole_bottom?.color || 'N/A' }}<br>
          <hr>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      pendingOrders: [],
      sendOrders: [],
      canceledOrders: [],
      activeTab: 'pending', // Default to 'pending' tab
      loading: false,
      error: null,
    };
  },
  async created() {
    this.loading = true;
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      if (!token) {
        this.error = 'No token found, please log in';
        this.loading = false;
        return;
      }

      const response = await axios.get('https://api-f9me.onrender.com/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response Data:", response.data);

      if (response.data && response.data.data && Array.isArray(response.data.data.orders)) {
        this.orders = response.data.data.orders;
        this.filterOrdersByStatus();  // Filter orders based on their status
      } else {
        this.error = 'Invalid response format';
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      this.error = 'An error occurred while fetching orders';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    filterOrdersByStatus() {
      this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 

      this.pendingOrders = this.orders.filter(order => order.status && order.status.toLowerCase() === 'pending');
      this.sendOrders = this.orders.filter(order => order.status && order.status.toLowerCase() === 'shipped');
      this.canceledOrders = this.orders.filter(order => order.status && order.status.toLowerCase() === 'canceled');
    },

    formatOrderTime(timestamp) {
      if (!timestamp) return 'N/A';
      
      const date = new Date(timestamp);
      const options = { 
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      };
      return date.toLocaleString('en-US', options);
    },

    // Method to update the order status
    async updateOrderStatus(order) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'No token found, please log in';
          return;
        }

        const response = await axios.patch(
          `https://api-f9me.onrender.com/orders/${order._id}`,
          { status: order.status },  
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Order Updated:", response.data);
        this.fetchOrders();  // Reload the orders after updating
      } catch (error) {
        console.error("Error updating order status:", error);
        this.error = error.response?.data?.message || 'Failed to update order';
      }
    },

    // Method to delete an order
    async deleteOrder(orderId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'No token found, please log in';
          return;
        }

        // Request to delete the order
        const response = await axios.delete(
          `https://api-f9me.onrender.com/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Remove the order from the local state
        this.orders = this.orders.filter(order => order._id !== orderId);
        this.filterOrdersByStatus();  // Re-filter the orders to update the displayed lists
        console.log('Order deleted:', response.data);
      } catch (error) {
        console.error('Error deleting order:', error);
        this.error = error.response?.data?.message || 'Failed to delete order';
      }
    }
  },
};
</script>


<style scoped>
.orders-container {
  padding: 20px;
}

.error {
  color: red;
  font-weight: bold;
}

.tabs {
  display: flex;
  margin-bottom: 10px;
}

.tabs button {
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 5px;
  background-color: #000000;
}

.tabs button.active {
  background-color: rgb(105, 255, 71);
    color: black;
}

ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 kolommen naast elkaar */
  gap: 20px; /* Ruimte tussen de kaarten */
}

li {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

hr {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
}

select {
  margin-top: 10px;
  padding: 5px;
}

.loading {
  font-style: italic;
}

/* Responsiveness voor kleinere schermen */
@media (max-width: 1200px) {
  ul {
    grid-template-columns: repeat(3, 1fr); /* 3 kolommen op middelgrote schermen */
  }
}

@media (max-width: 900px) {
  ul {
    grid-template-columns: repeat(2, 1fr); /* 2 kolommen op kleinere schermen */
  }
}

@media (max-width: 600px) {
  ul {
    grid-template-columns: 1fr; /* 1 kolom op de kleinste schermen */
  }
}

</style>
