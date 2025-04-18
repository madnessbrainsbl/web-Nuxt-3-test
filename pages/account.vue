<template>
  <div class="account-container p-4 md:p-8">
    <header class="account-header mb-6 flex justify-between items-center">
      <h1 class="text-2xl md:text-3xl font-bold">Account Dashboard</h1>
      <div v-if="authStore.user" class="user-info text-right">
          <p class="text-sm text-gray-600 dark:text-gray-400">Welcome,</p>
          <p class="font-semibold">{{ authStore.user.name }} {{ authStore.user.surname }}</p>
          <UButton
              icon="i-heroicons-arrow-left-on-rectangle"
              variant="soft"
              color="red"
              size="sm"
              class="mt-2"
              @click="handleLogout"
          >
              Logout
          </UButton>
      </div>
    </header>

    <UCard class="mb-6">
         <template #header>
            <h3 class="text-lg font-semibold">Filters</h3>
         </template>
         <div class="filter-controls grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <!-- Date Filter -->
            <UFormGroup label="Filter by Creation Date">
               <UInput type="date" v-model="productsStore.filterDate" placeholder="Select date"/>
            </UFormGroup>

            <!-- Name Multi-Select Filter -->
             <UFormGroup label="Filter by Product Name">
                <USelectMenu
                    v-model="productsStore.filterNames"
                    :options="productsStore.uniqueProductNames"
                    multiple
                    placeholder="Select names..."
                    searchable
                    searchable-placeholder="Search names..."
                />
             </UFormGroup>

            <!-- Clear Filters Button -->
            <UButton
                label="Clear Filters"
                variant="outline"
                color="gray"
                icon="i-heroicons-x-circle"
                @click="productsStore.clearFilters"
                class="self-end"
             />
         </div>
    </UCard>

    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Product Data</h3>
      </template>

      <div v-if="productsStore.loading" class="text-center p-4">
        <p>Loading products...</p>
        <UProgress animation="carousel" />
      </div>
      <div v-else-if="productsStore.error" class="text-center p-4">
         <UAlert
            icon="i-heroicons-exclamation-triangle"
            color="red"
            variant="soft"
            title="Error Loading Data"
            :description="productsStore.error"
         />
      </div>
      <div v-else-if="productsStore.filteredProducts.length === 0" class="text-center p-4">
         <p>No products found matching your criteria.</p>
       </div>
      <UTable
        v-else
        :rows="productsStore.filteredProducts"
        :columns="tableColumns"
        :loading="productsStore.loading"
      >
         <!-- Custom cell rendering if needed -->
         <template #date_created-data="{ row }">
             <span>{{ formatDate(row.date_created) }}</span>
         </template>
         <template #price-data="{ row }">
             <span>${{ row.price.toFixed(2) }}</span>
         </template>
          <template #status-data="{ row }">
              <UBadge :label="row.status" :color="getStatusColor(row.status)" variant="soft" />
          </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useProductsStore } from '~/stores/products';

definePageMeta({
  middleware: ['auth-only'] // Protect this page
});

const authStore = useAuthStore();
const productsStore = useProductsStore();

// Define columns for UTable
const tableColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'date_created', label: 'Date Created', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
];

// Fetch product data when the component mounts
onMounted(async () => {
  await productsStore.fetchProducts();
});

const handleLogout = async () => {
  await authStore.logout();
};

// Helper function for date formatting
const formatDate = (dateString: string): string => {
    try {
       return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD format
       // Or use a more user-friendly format:
       // return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

// Helper for status badge color
const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
        case 'active': return 'green';
        case 'inactive': return 'orange';
        case 'discontinued': return 'red';
        default: return 'gray';
    }
}
</script>

<style lang="scss" scoped>
.account-container {
  max-width: 1200px; // Limit content width
  margin: 0 auto; // Center content
}

// Add any additional specific styles here
</style>