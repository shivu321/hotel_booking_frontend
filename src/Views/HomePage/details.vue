<template>
  <div class="container my-5">
    <h2 class="content-title">
      <a @click="$router.go(-1)" style="cursor: pointer"
        ><i class="fa-angle-left fas mr-2"></i
        ><span
          >Search Result
          <span class="text-muted">Location : {{ searchInfo?.keyword }}</span> |
          <span class="text-muted"
            >Date :
            {{
              this.$helperService.getFormattedDateOnly(searchInfo?.from_date) +
              " - " +
              $helperService.getFormattedDateOnly(searchInfo?.to_date)
            }}
            |
            <span class="text-muted">
              No of guest : {{ searchInfo?.no_of_guest }}</span
            ></span
          >
          | <span class="text-muted"> No of night : {{ no_of_night }}</span>
        </span>
      </a>
    </h2>
    <div class="row mb-4">
      <div class="col-md-4">
        <img
          :src="hotel.image"
          alt="Hotel Image"
          class="img-fluid rounded shadow"
          style="width: 400px !important"
        />
      </div>
      <hr />
      <div class="col-md-8">
        <h2 class="mb-2">{{ hotel?.title }}</h2>
        <p class="">{{ hotel?.description }}</p>
        <p class="">
          <strong>Location:</strong> {{ hotel?.city }}, {{ hotel?.country }}
        </p>
      </div>
    </div>

    <h4 class="mb-3">Available Rooms</h4>
    <div class="row">
      <div
        class="col-lg-12 col-md-12 mb-4"
        v-for="(room, index) in hotel.room"
        :key="index"
      >
        <div
          class="card shadow-sm rounded-4 overflow-hidden h-100 border-0 hotel-card text-dark flex-column flex-md-row d-flex"
          style="transition: 0.3s ease; border: 1px solid #e0e0e0"
        >
          <!-- Left Side: Carousel -->
          <div class="col-md-4 col-lg-4 p-0">
            <div
              :id="`hotelCarousel-${index}`"
              class="carousel slide h-100"
              data-bs-ride="carousel"
              data-bs-interval="2000"
            >
              <div class="carousel-inner h-100">
                <div
                  class="carousel-item h-100"
                  v-for="(image, i) in room.images"
                  :key="i"
                  :class="{ active: i === 0 }"
                >
                  <img
                    :src="image?.image"
                    class="d-block w-100 h-100"
                    alt="Room Image"
                    style="object-fit: cover; height: 100%"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side: Room Details -->
          <div
            class="col-md-8 p-4 d-flex flex-column justify-content-between bg-white"
          >
            <div>
              <h5 class="card-title fw-semibold">{{ room?.title }}</h5>
              <p class="card-text text-muted small">
                {{ $helperService.getFirstWords(room?.description, 24) }}
              </p>
            </div>
            <div class="mt-3">
              <p class="mb-1 text-danger fw-light" v-if="room?.price">
                <s>
                  ₹{{
                    $helperService.getListIterationAmount(
                      room?.price,
                      no_of_night,
                      "BASE_PRICE"
                    )
                  }}
                </s>
              </p>
              <p class="mb-0 fw-bold text-dark fs-6">
                ₹{{
                  $helperService.getListIterationAmount(
                    room?.disc_price,
                    no_of_night,
                    "DISCOUNTED_PRICE"
                  )
                }}
                +
                {{
                  $helperService.getListIterationAmount(
                    room?.disc_price,
                    no_of_night,
                    "TAX_AMOUNT",
                    room?.tax
                  )
                }}
                <sup class="text-muted">(price + tax)</sup>
                <span class="text-muted small">/night</span>
              </p>
            </div>
            <button
              class="btn btn-primary mt-3 w-100 rounded-pill"
              @click="openBookNow(room)"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="modal fade wb-modal-wrapper"
    id="bookNow"
    tabindex="-1"
    role="dialog"
    aria-labelledby="bookNow"
    aria-hidden="true"
    style="pointer-events: none"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content d-flex flex-column" style="max-height: 90vh">
        <!-- Close Button -->
        <a
          class="close position-absolute mr-3 mt-3 text-right"
          style="right: 0; z-index: 10"
          @click="closeModal()"
          aria-label="Close"
        >
          <i class="fa fa-times-circle" aria-hidden="true"></i>
        </a>

        <!-- Header -->
        <div class="modal-header justify-content-center">
          <h5 class="modal-title font-22 text-center w-100">
            {{ roomInfo.title }}
          </h5>
        </div>

        <!-- Scrollable Content -->
        <div class="modal-body overflow-auto px-4" style="flex: 1 1 auto">
          <!-- Description -->
          <p class="text-muted">{{ roomInfo.description }}</p>

          <!-- Carousel -->
          <div
            :id="`roomCarousel-${roomInfo.id}`"
            class="carousel slide mb-3"
            data-ride="carousel"
          >
            <div class="carousel-inner rounded shadow">
              <div
                v-for="(image, i) in roomInfo.images"
                :key="i"
                class="carousel-item"
                :class="{ active: i === 0 }"
              >
                <img
                  :src="image.image"
                  class="d-block w-100"
                  alt="Room Image"
                  style="height: 300px; object-fit: cover"
                />
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <h6 class="font-weight-bold mt-3">Amenities</h6>
          <ul class="list-unstyled row">
            <li
              v-for="(amenity, index) in roomInfo.amenities"
              :key="index"
              class="col-md-4 mb-2 d-flex align-items-start"
            >
              <i class="fa fa-check text-success mr-2 mt-1"></i>
              <span>{{ amenity.title }}</span>
            </li>
          </ul>

          <!-- Price Breakdown -->
          <h6 class="font-weight-bold mt-3">Price Details</h6>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between">
              <span>Base Price</span>
              <span>{{
                $helperService.getFormattedCurrency(roomInfo.price)
              }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span>Discounted Price</span>
              <span>{{
                $helperService.getFormattedCurrency(roomInfo.disc_price)
              }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span>Tax ({{ roomInfo.tax }}%)</span>
              <span>{{
                $helperService.getFormattedCurrency(roomInfo.tax_amount)
              }}</span>
            </li>
            <li
              class="list-group-item d-flex justify-content-between font-weight-bold"
            >
              <span>Total</span>
              <span>{{
                $helperService.getFormattedCurrency(roomInfo.total)
              }}</span>
            </li>
          </ul>
        </div>

        <!-- Footer (Sticky Button) -->
        <div class="modal-footer justify-content-center border-top">
          <button class="btn btn-success w-100" @click="openConfirmationBookModal(roomInfo)">
            Pay Now {{ $helperService.getFormattedCurrency(roomInfo?.total) }}
          </button>
        </div>
      </div>
    </div>
  </div>

 <div
  class="modal fade wb-modal-wrapper"
  id="confirmationBook"
  tabindex="-1"
  role="dialog"
  aria-labelledby="confirmationBook"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered modal-md" role="document">
    <div class="modal-content p-3">
      <div class="text-end">
        <a
          class="text-danger fs-4 text-right"
          @click="closeConfirmationModal()"
          aria-label="Close"
        >
          <i class="fa fa-times-circle" aria-hidden="true"></i>
        </a>
      </div>

      <div class="modal-header justify-content-center border-0 pb-2">
        <h5 class="modal-title font-22 fw-bold text-center text-dark">
          Are you sure you want to confirm this booking?
        </h5>
      </div>

      <div class="modal-body text-center">
        <p class="text-muted">This action cannot be undone.</p>
      </div>

      <div class="modal-footer justify-content-center border-0 pt-0">
        <button
          type="button"
          class="btn btn-outline-secondary px-4 py-2 rounded-pill me-3"
          @click="closeConfirmationModal"
        >
          Cancel
        </button>
        <button
        id="confirm-booking"
          type="button"
          class="btn btn-success px-4 py-2 rounded-pill"
        >
          <i class="bi bi-check-circle me-2"></i>Confirm
        </button>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import moment from "moment";
export default {
  name: "HotelDetails",
  data() {
    return {
      id: this.$route.params.uuid,
      hotel: {
        name: "Sunrise Resort",
        description:
          "A beautiful beach-side resort offering luxury amenities and comfortable rooms for your perfect vacation.",
        image: "https://via.placeholder.com/800x400",
        city: "Goa",
        country: "India",
        room: [
          {
            title: "Deluxe Room",
            price: 3500,
            images: [],
            amenities: [],
            description:
              "Spacious room with sea view, king-sized bed, air conditioning, and a modern bathroom.",
          },
        ],
      },
      searchInfo: {
        location: "",
        from_date: "",
        to_date: "",
        no_of_guest: "",
      },
      no_of_night: "",
      roomInfo: {},
    };
  },
  computed: {
    getSearchInfo() {
      return this.$storeService.getters.getBookingInfo || {};
    },
  },
  mounted() {
    console.log("The Search info", this.getSearchInfo);
    const date1 = this.$helperService.getFormattedDateOnly(
      this.getSearchInfo?.from_date
    );
    const date2 = this.$helperService.getFormattedDateOnly(
      this.getSearchInfo?.to_date
    );
    this.no_of_night = moment(date2).diff(date1, "days");
    this.$storeService.commit("setTitle", "Hotel Details");
    this.searchInfo = this.getSearchInfo;
    this.getHotelDetails(this.searchInfo?.from_date, this.searchInfo?.to_date);
  },
  methods: {
    openBookNow(originalItem) {
      if (!originalItem) return;

      const item = { ...originalItem };

      const noOfNights = this.no_of_night || 1;
      const discPrice = item?.disc_price || 0;
      const basePrice = item?.price || 0;
      const tax = item?.tax || 0;

      const discountAmount = this.$helperService.getListIterationAmount(
        discPrice,
        noOfNights,
        "DISCOUNTED_PRICE"
      );

      const taxAmount = this.$helperService.getListIterationAmount(
        discPrice,
        noOfNights,
        "TAX_AMOUNT",
        tax
      );
      const totalAmount = Number(discountAmount) + Number(taxAmount);
      item.price = this.$helperService.getListIterationAmount(
        basePrice,
        noOfNights,
        "BASE_PRICE"
      );
      item.disc_price = discountAmount;
      item.tax_amount = taxAmount;
      item.total = totalAmount;
      console.log("totalAmount:", totalAmount);
      this.roomInfo = item;
      window.$("#bookNow").modal("show");
    },
    payNow() {
      alert("in-Progress task");
    },
    openConfirmationBookModal() {
      window.$("#bookNow").modal("hide");
      window.$("#confirmationBook").modal("show");
    },
    closeConfirmationModal() {
      window.$("#confirmationBook").modal("hide");
    },
    closeModal() {
      this.getHotelDetails(
        this.searchInfo?.from_date,
        this.searchInfo?.to_date
      );
      window.$("#bookNow").modal("hide");
    },
    getFirstWords(text, limit = 25) {
      if (!text) return "";
      const words = text.trim().split(/\s+/);
      return (
        words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "")
      );
    },
    getHotelDetails(a, b) {
      this.$api
        .webRequest({
          _method: "GET",
          _action: "hotel-detail/" + this.id,
          _body: { from_date: a, to_date: b },
        })
        .then((res) => {
          this.hotel = res.info;
        })
        .catch((e) => {
          this.$toast.error(e.message, {
            postion: "top-right",
          });
        });
    },
  },
};
</script>

<style scoped>
.hotel-card {
  transition: transform 0.2s;
}
.hotel-card:hover {
  transform: scale(1.02);
}
.carousel-item img {
  height: 400px;
  object-fit: cover;
}
</style>
