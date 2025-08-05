import moment from "moment";

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

class HelperService {
  sorting(sortBy, id) {
    var orderBy = "ASC";
    var className = "sorting_asc";
    var temp = document.getElementById(id);
    if (temp) {
      if (temp.className.includes("sorting_asc")) {
        className = "sorting_desc";
      }
      if (className == "sorting_asc") {
        temp.classList.add("sorting_asc");
        temp.classList.remove("sorting_desc");
        orderBy = "ASC";
      } else if (className == "sorting_desc") {
        temp.classList.add("sorting_desc");
        temp.classList.remove("sorting_asc");
        orderBy = "DESC";
      }
    }
    var obj = {
      order_by: orderBy,
      sort_by: sortBy,
    };
    return obj;
  }

  getFormattedTime(t) {
    return moment(t).format("hh:mm A");
  }

  getFirstWords(text, limit = 10) {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return (
      words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "")
    );
  }
  getFormattedDateOnly(dt) {
    return moment.utc(dt).local().format("MMM DD, YYYY");
    // return moment(dt).format("DD/MM/YYYY hh:mm A");
  }

  getFormattedDate(dt) {
    if (dt == null || dt == "" || dt == undefined) {
      return "";
    }
    return moment.utc(dt).local().format("MMM DD, YYYY  hh:mm A");
    // return moment(dt).format("DD/MM/YYYY hh:mm A");
  }

  sendFormattedDate(d, type) {
    if (type == "date") {
      return moment(d).format("YYYY-MM-DD");
    } else if (type == "month_year") {
      return moment(d).format("YYYY-MM");
    } else if (type == "year") {
      return moment(d).format("YYYY");
    } else {
      return moment(d).format("YYYY-MM-DD");
    }
  }

  allowOnlyNumericValue(e) {
    var numbers = /^[0-9]$/;
    if (!e.key.match(numbers) && e.keyCode != 8) {
      e.preventDefault();
      return false;
    }
  }

  convertUnderscore(value) {
    if (!value) {
      return "";
    }

    let pattern = /_/gi;
    let replacement = " ";
    let result = value.replaceAll(pattern, replacement);
    let res = result.toProperCase();

    pattern = / /gi;
    replacement = "-";
    return res.replaceAll(pattern, replacement);
  }

  calculateHotelPrice(basePrices, discountedPrice, nights, taxRate) {
    const basePrice = basePrices * nights;
    const subtotal = discountedPrice * nights;
    const taxAmount = (taxRate / 100) * subtotal;
    const total = subtotal + taxAmount;

    return {
      basePrice,
      subtotal,
      taxAmount,
      total,
    };
  }
  getListIterationAmount(amount ,numberOfNight ,usedFor= "BASE_PRICE", tax = 0  ){
    if(usedFor === 'BASE_PRICE'){
      return (amount * numberOfNight).toFixed(2);
    }
    if(usedFor === 'DISCOUNTED_PRICE'){
       return (amount * numberOfNight).toFixed(2);
    }
    if(usedFor === 'TAX_AMOUNT'){
       return ((amount * numberOfNight * tax / 100)).toFixed(2);
    }
  }

  getTitleCase(value) {
    if (!value) {
      return "";
    }
    const pattern = /_/gi;
    const replacement = " ";
    const result = value.replaceAll(pattern, replacement);
    return result.toProperCase();
  }

    getFormattedCurrency(amount) {
    var fractionDigit = 2;
    var inr = Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: fractionDigit,
    }).format(amount);
    return inr;
  }
  calculateNoOfNight(a,b){
      const date1 = moment.utc(a).local().format("MMM DD, YYYY")
      const date2 = moment.utc(b).local().format("MMM DD, YYYY")
      return  moment(date2).diff(date1, "days");
  }
}

export default new HelperService({});
