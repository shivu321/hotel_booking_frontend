<template>
  <div>
    <!--<label class="font-15 d-inline">Rows per page:</label>
     <div
      class="selectbox-xs text-right custom-select-dd d-inline-block mr-lg-4 mb-lg-0 mb-3"
      style="width: 60px;"
    >
      <select class="form-control custom-select" @change="setItemsPerPage(itemsPerPage)" v-model="itemsPerPage" >
        <option value=10 >10</option>
        <option value=15>15</option>
        <option value=20>20</option>
      </select>
    </div>-->
    <nav v-if="isShow" aria-label="Page navigation example" class="d-inline-block">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click="setPage(1)" aria-label="Previous">
            <span>
              <!-- {{ $lang.messages.first }} -->First
            </span>
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click="setPage(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">
              <i class="fa fa-arrow-left"></i>
            </span>
            <span class="sr-only">
              <!-- {{ $lang.messages.previous }} --> Previous
            </span>
          </a>
        </li>

        <li
          v-for="page in pages"
          class="page-item"
          :class="{ active: currentPage === page }"
          :key="page"
        >
          <a @click="setPage(page)" class="page-link">{{ page }}</a>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click="setPage(currentPage + 1)" aria-label="Next">
            <span aria-hidden="true">
              <i class="fa fa-arrow-right"></i>
            </span>
            <span class="sr-only">
              <!-- {{ $lang.messages.next }} --> Next
            </span>
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click="setPage(totalPages)" aria-label="Next">
            <span>
              <!-- {{ $lang.messages.last }} -->Last
            </span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "TablePagination",

  data() {
    return {
      isShow: false,
      currentPage: 1,
      pages: [],
      totalPages: 0,
    };
  },
  props: {
    page: {
      type: Number,
      default: 0,
      validator: (page) => {
        return page >= 0;
      },
    },
    itemsPerPage: {
      default: 10,
      validator: (page) => {
        return page >= 0;
      },
    },
  },
  methods: {
    setPage(page) {
      this.$emit("page-change", page);
      this.setCurrentPage(page);
    },
    setTotalCount(items) {
      this.totalPages = Math.ceil(Number(items) / this.itemsPerPage);
      if (this.totalPages > 1) {
        this.isShow = true;
        this.setCurrentPage(1);
      } else {
        this.isShow = false;
      }
    },
    setItemsPerPage(itemsPerPage) {
      this.$emit("items-per-page-change", itemsPerPage);
    },
    setCurrentPage(currentPage) {
      this.currentPage = currentPage;
      var startPage, endPage;
      if (this.totalPages <= 5) {
        startPage = 1;
        endPage = this.totalPages;
      } else {
        if (currentPage <= 3) {
          startPage = 1;
          endPage = 5;
        } else if (currentPage + 2 >= this.totalPages) {
          startPage = this.totalPages - 4;
          endPage = this.totalPages;
        } else {
          startPage = currentPage - 2;
          endPage = currentPage + 2;
        }
      }

      this.pages = [];
      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }
    },
  },
};
</script>
