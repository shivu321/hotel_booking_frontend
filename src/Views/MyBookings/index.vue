<template>
  <div class="content-body hotel-search-page">
    <div class="overlay">
      <div class="container py-5">
        <h2 class="mb-4 text-center">My Bookings</h2>

        <div class="row">
          <div
            v-for="(hotel, index) in bookings"
            :key="index"
            class="col-md-3 mb-4 fade-in"
          >
            <div class="card h-100 shadow rounded">
              <img
                :src="hotel?.hotel?.image || defaultImage"
                class="card-img-top"
                alt="Hotel Image"
              />
              <div class="card-body">
                <h5 class="card-title">{{ hotel?.hotel?.name }}</h5>
                <p class="mb-1"><strong>Room:</strong> {{ hotel?.room?.title }}</p>
                <p class="mb-1">
                  <strong>Dates:</strong>   
                  {{ formatDate(hotel.from_date) }} - {{ formatDate(hotel.to_date) }}
                </p>
                <p class="mb-1">
                  <strong>Nights:</strong>
                  {{ $helperService.calculateNoOfNight(hotel?.from_date, hotel.to_date) }}
                </p>
                <p class="mb-1">
                  <strong>Status:</strong>
                  <span :class="statusClass(hotel.status)">{{ hotel.status }}</span>
                </p>
                <p class="mb-3">
                  <strong>Total:</strong>
                  {{ $helperService.getFormattedCurrency(hotel?.transaction?.grand_total) }}
                </p>
                <button
                  class="btn btn-sm btn-primary"
                  @click="viewDetails(hotel?.id)"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!bookings.length" class="text-center text-muted mt-5">
          No bookings found.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyBookings",
  data() {
    return {
      bookings: [],
      no_of_night: 0,
      defaultImage: "https://via.placeholder.com/400x250?text=Hotel+Image",
    };
  },
  mounted() {
    this.getBookings();
  },
  methods: {
    viewDetails(uuid) {
      this.$router.push("/booking-detail/" + uuid);
    },
    getBookings() {
      this.$api
        .webRequest({
          _method: "GET",
          _action: "get-bookings",
        })
        .then((res) => {
          console.log("Log is ", res?.list);
          this.bookings = res?.list || [];
        })
        .catch((e) => {
          this.$toast.error(e.message, { position: "top-right" });
        });
    },
    formatDate(dateStr) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },
    statusClass(status) {
      switch (status) {
        case "COMPLETED":
          return "badge bg-success";
        case "UPCOMING":
          return "badge bg-primary";
        case "CANCELLED":
          return "badge bg-danger";
        default:
          return "badge bg-secondary";
      }
    },
  },
};
</script>

<style scoped>
.card-img-top {
  height: 140px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.card-body {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card p {
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
}

.btn {
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.fade-in {
  animation: fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
