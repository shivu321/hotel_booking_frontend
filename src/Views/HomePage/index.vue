<template>
  <div class="content-body hotel-search-page">
    <div class="overlay">
      <div class="container">
        <h2 class="mb-4 text-white">Find Your Perfect Stay</h2>

        <!-- Search Form -->
        <Form @submit="searchHotels" ref="loginForm" class="signin-form">
          <div
            class="row g-3 bg-light bg-opacity-75 p-3 rounded shadow-sm align-items-end"
          >
            <!-- keyword -->
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label"
                  >keyword <sup class="text-danger">*</sup></label
                >
                <Field
                  name="keyword"
                  v-model="search.keyword"
                  rules="required"
                  class="form-control"
                  placeholder="Enter keyword"
                  autocapitalize="false"
                />
                <ErrorMessage
                  name="keyword"
                  class="validation-msg text-danger"
                />
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label"
                  >No of guests <sup class="text-danger">*</sup></label
                >
                <Field
                  name="no_of_guest"
                  v-model="search.no_of_guest"
                  rules="required"
                  class="form-control"
                  placeholder="Enter keyword"
                  autocapitalize="false"
                />
                <ErrorMessage
                  name="no_of_guest"
                  class="validation-msg text-danger"
                />
              </div>
            </div>
            <!-- Date Range Picker -->
            <div class="col-md-4">
              <div class="form-group">
                <label class="form-label"
                  >Date Range <sup class="text-danger">*</sup></label
                >
                <div class="dp-wrapper">
                  <VueDatePicker
                    v-model="date"
                    :range="{ showLastInRange: false }"
                    :clearable="false"
                    :input-class="'form-control'"
                    :enable-time-picker="false"
                    format="dd-MM-yyyy"
                    @closed="calculateNight"
                  />
                  <ErrorMessage
                    name="vue_date_picker"
                    class="validation-msg text-danger"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label">No of Night </label>
                <Field
                  name="no_of_night"
                  v-model="no_of_night"
                  rules="required"
                  class="form-control"
                  :disabled="true"
                  autocapitalize="false"
                />
              </div>
            </div>
            <!-- Search Button -->
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-label d-block invisible">Search</label>
                <button
                  id="search-hotel"
                  class="btn btn-brand-01 btn-uppercase w-100"
                  type="submit"
                >
                  <i class="fa fa-search"></i> Search
                </button>
              </div>
            </div>
          </div>
        </Form>

        <div class="mt-5">
          <h4 v-if="hotels.length" class="text-white pb-2">Available Hotels</h4>
          <!-- Loader -->
          <div v-if="isLoading" class="text-center text-white my-4">
            <div class="spinner-border text-light" role="status">
              <span class="visually-hidden">-H-</span>
            </div>
            <p class="mt-2">Searching hotels...</p>
          </div>

          <div v-if="isLoading === false && count !== 0" class="row">
            <div
              v-for="(hotel, index) in hotels"
              :key="index"
              class="col-md-3 mb-4 fade-in"
            >
              <div
                @click="viewDetails(hotel?.uuid)"
                style="cursor: pointer !important"
                class="card h-100 hotel-card shadow-sm rounded-4 overflow-hidden"
              >
                <div class="" style="height: 130px !important">
                  <img
                    :src="hotel?.image"
                    class="card-img-top"
                    alt="Hotel Image"
                    style="object-fit: cover"
                  />
                </div>

                <div class="card-body bg-white">
                  <h5 class="card-title">{{ hotel?.name }}</h5>
                  <p class="card-text text-muted">
                    {{ $helperService.getFirstWords(hotel?.description) }}
                  </p>
                  <div class="mt-2">
                    <p
                      class="mb-1 text-danger"
                      v-if="hotel?.hotel_price?.price"
                    >
                      <s>₹{{ $helperService.getListIterationAmount(hotel?.hotel_price?.price,no_of_night,"BASE_PRICE") }}</s>
                    </p>
                    <p class="mb-0 fw-bold text-dark">
                      ₹{{
                        $helperService.getListIterationAmount(hotel?.hotel_price?.disc_price,no_of_night,'DISCOUNTED_PRICE') +
                        " + " +
                        $helperService.getListIterationAmount(hotel?.hotel_price?.disc_price,no_of_night,'TAX_AMOUNT',hotel?.hotel_price?.tax)
                      }}
                      <span class="text-muted"> /night</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="count === 0">
            <div class="row justify-content-center">
              <div class="col-md-8 text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3802/3802306.png"
                  alt="No Hotels Found"
                  class="img-fluid mb-3"
                  style="width: 120px"
                />
                <h5 class="text-white">No hotels found for your search.</h5>
                <p class="fst-italic text-light mt-2 px-2">{{ randomQuote }}</p>
                <button
                  class="btn btn-outline-light mt-3"
                  @click="getRandomQuote"
                >
                  Inspire Me Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { Form, Field, ErrorMessage } from "vee-validate";
import moment from "moment";
export default {
  name: "HomePage",
  components: {
    Form,
    Field,
    ErrorMessage,
    VueDatePicker,
  },
  data() {
    return {
      search: {
        keyword: "",
        no_of_guest: 1,
      },
      date: [],
      hotels: [],
      isLoading: false,
      quotes: [
        "“The world is a book, and those who do not travel read only one page.” – Saint Augustine",
        "“Travel is the only thing you buy that makes you richer.” – Anonymous",
        "“Life is short and the world is wide.” – Simon Raven",
        "“Jobs fill your pocket, but adventures fill your soul.” – Jamie Lyn Beatty",
        "“Travel makes one modest. You see what a tiny place you occupy in the world.” – Gustave Flaubert",
        "“Wherever you go becomes a part of you somehow.” – Anita Desai",
      ],
      randomQuote: "",
      count: -1,
      no_of_night: 0,
    };
  },
  mounted() {
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 1));
    this.date = [startDate, endDate];
    this.$storeService.commit("setTitle", "Search");
    setTimeout(() => {
      this.getRandomQuote();
    }, 1000);
    
    this.calculateNight();
  },
  methods: {
    calculateNight() {
      const date1 = this.$helperService.getFormattedDateOnly(this.date[0]);
      const date2 = this.$helperService.getFormattedDateOnly(this.date[1]);
      this.no_of_night = moment(date2).diff(date1, "days");
    },
    viewDetails(uuid) {
      return this.$router.push("/hotel-detail/" + uuid);
    },
    getRandomQuote() {
      const index = Math.floor(Math.random() * this.quotes.length);
      this.randomQuote = this.quotes[index];
    },
    searchHotels() {
      this.isLoading = true;
      var obj = {
        keyword: this.search?.keyword,
        no_of_guest: this.search?.no_of_guest,
        from_date: moment(this.date[0]).format("YYYY-MM-DD"),
        to_date: moment(this.date[1]).format("YYYY-MM-DD"),
      };
      this.$api
        .webRequest({
          _method: "GET",
          _action: "get-hotels",
          _body: obj,
          _buttonId: "search-hotel",
          _hide_loader: true,
        })
        .then((res) => {
          this.count = res?.list?.length;
          if (res?.list?.length > 0) {
            this.$storeService.commit("setBookingInfo", obj);
          }
          console.log("Log is ", res?.list);
          this.hotels = res?.list;
          this.isLoading = false;
          // window.$("#changePass").modal("hide");
        })
        .catch((e) => {
          this.isLoading = false;
          this.$toast.error(e.message, { position: "top-right" });
        });
    },
  },
};
</script>

<style scoped>
/* Background with blur and dark overlay */
.hotel-search-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}
.hotel-search-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("/public/static/img/background.jpg"); /* Place image in public/static/img/ */
  background-size: cover;
  background-position: center;
  filter: blur(1px) brightness(0.6);
  z-index: 0.1;
}
.overlay {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding-top: 50px;
}

/* Card styling */
.hotel-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 15px !important;
  height: 300px !important;
}
.hotel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Fade animation */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.validation-msg {
  min-height: 20px; /* Reserve vertical space */
  display: block;
  font-size: 0.875rem;
}

/* Make VueDatePicker input same height as other form-controls */
.dp-wrapper :deep(.dp__main) {
  width: 100%;
}
.dp-wrapper :deep(input.dp__input) {
  padding-left: 31px !important;
  height: 46px;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
  width: 100%;
}
</style>
