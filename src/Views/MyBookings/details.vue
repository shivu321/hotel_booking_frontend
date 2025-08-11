<template>
  <div class="container py-5 booking-details-page">
    <h2 class="text-center mb-5 heading-title">Booking Details</h2>

    <!-- Hotel Info -->
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card modern-card h-100">
          <div class="row g-0">
            <!-- Image Column -->
            <div class="col-md-4">
              <img
                :src="booking?.hotel?.image"
                class="img-fluid h-100 object-fit-cover rounded-start"
                alt="Hotel Image"
              />
            </div>

            <!-- Content Column -->
            <div class="col-md-8">
              <div class="card-body">
                <h4 class="mb-2">{{ booking?.hotel?.name }}</h4>
                <p class="text-muted mb-3">
                  <i class="bi bi-geo-alt"></i> {{ booking?.hotel?.address }}
                </p>
                <div class="info-group">
                  <p>
                    <strong>Check-in:</strong>
                    <span class="text-muted mx-3">{{
                      booking?.from_date
                    }}</span>
                  </p>
                  <p>
                    <strong>Check-out:</strong
                    ><span class="text-muted mx-3">{{ booking?.to_date }}</span>
                  </p>
                  <p>
                    <strong>Nights:</strong>
                    <span class="text-muted mx-3">{{
                      $helperService.calculateNoOfNight(
                        booking?.from_date,
                        booking?.to_date
                      )
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Guest Info & Room Info -->
    <div class="row mb-4">
      <div class="col-md-6 mb-3">
        <div class="card modern-card h-100">
          <div class="card-body">
            <h4 class="mb-3">Guest Information</h4>
            <p>
              <strong>Name:</strong
              ><span class="text-muted mx-3"> {{ booking?.user?.name }}</span>
            </p>
            <p>
              <strong>Email:</strong>
              <span class="text-muted mx-3">
                <a :href="`mailto:${booking?.user?.email}`">{{
                  booking?.user?.email
                }}</a></span
              >
            </p>
          </div>
        </div>
      </div>
      <!-- Room Info with Carousel -->
      <div class="col-md-6 mb-3">
        <div class="card modern-card h-100">
          <div class="row g-0 h-100 align-items-stretch">
            <!-- Carousel Image Section -->
            <div class="col-md-4 h-100">
              <div
                :id="`roomCarousel`"
                class="carousel slide h-100"
                data-bs-ride="carousel"
              >
                <div class="carousel-inner h-100 rounded-start">
                  <div
                    v-for="(img, idx) in booking?.room?.images"
                    :key="idx"
                    :class="['carousel-item', { active: idx === 0 }]"
                  >
                    <img
                      :src="img?.image"
                      class="d-block w-100 h-100 object-fit-cover"
                      alt="Room Image"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Room Content -->
            <div class="col-md-8 h-100">
              <div
                class="card-body d-flex flex-column justify-content-center h-100"
              >
                <h4 class="mb-3">Room Info</h4>
                <p><strong>Room Type:</strong><span class="text-muted mx-3">  {{ booking?.room?.title }} </span></p>
                <p>
                  <strong>Description:</strong>
                  <span class="text-muted mx-3"> {{ booking?.room?.description || "Assigned at check-in" }} </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Summary & Price -->
    <div class="row mb-5">
      <div class="col-md-6 mb-3">
        <div class="card modern-card h-100">
          <div class="card-body">
            <h4 class="mb-3">Booking Summary</h4>
            <p>
              <strong>Booking ID:</strong> <code>{{ booking?.id }}</code>
            </p>
            <p>
              <strong>Status:</strong>
              <span
                :class="`badge px-3 py-2 rounded-pill ${
                  booking?.status === 'Confirmed'
                    ? 'bg-success-subtle text-success'
                    : 'bg-warning-subtle text-warning'
                }`"
              >
                {{ booking?.status }}
              </span>
            </p>
            <p v-if="booking?.narration != null">
              <strong>Reasons:</strong> <code>{{ booking?.narration }}</code>
            </p>
            <p>
              <strong>Payment Mode:</strong>
              <span class="text-capitalize"><span class="text-muted mx-3">  Online / UPI </span></span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card modern-card h-100">
          <div class="card-body">
            <h4 class="mb-3">Price Breakdown</h4>
            <ul class="list-group list-group-flush modern-list">
              <li class="list-group-item d-flex justify-content-between">
                <span>Base Price</span>
                <span>{{$helperService.getFormattedCurrency (booking?.transaction?.sub_total) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Tax</span>
                <span>{{ $helperService.getFormattedCurrency (booking?.transaction?.tax_amount) }}</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between fw-bold total-row"
              >
                <span>Total</span>
                <span class="text-success">{{ $helperService.getFormattedCurrency (booking?.transaction?.grand_total) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Back Button -->
    <div class="text-center mt-4">
      <button class="btn btn-dark px-4 py-2 rounded-pill" @click="goBack">
        <i class="bi bi-arrow-left me-2"></i> Back to My Bookings
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingDetails",
  data() {
    return {
      id: this.$route.params.id,
      booking: {},
    };
  },
  mounted() {
    this.getHotelDetails();
  },
  methods: {
    goBack() {
      this.$router.push("/my-booking");
    },
    getHotelDetails() {
      this.$api
        .webRequest({
          _method: "GET",
          _action: "booking-detail/" + this.id,
        })
        .then((res) => {
          this.booking = res.info;
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            position: "top-right",
          });
        });
    },
  },
};
</script>

<style scoped>
.booking-details-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.heading-title {
  font-weight: 600;
  font-size: 2rem;
}

.modern-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.hotel-img {
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.total-row {
  font-size: 1.1rem;
}

.modern-list .list-group-item {
  background-color: transparent;
  border: none;
  padding-left: 0;
  padding-right: 0;
}

.info-group p {
  margin-bottom: 0.5rem;
}
.object-fit-cover {
  object-fit: cover;
}

.carousel-inner,
.carousel-item,
.carousel-item img {
  height: 100%;
}
</style>
