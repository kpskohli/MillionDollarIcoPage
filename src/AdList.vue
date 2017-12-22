<style lang="scss">
.adList {
  background: #fff;

  img {
    vertical-align: middle;
    padding: 5px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    background: #ddd;
    margin-bottom: 0.5em;
  }
}
</style>

<template>
  <div class="adList">
    <p>Listing {{ num }} published ads and omitting {{ omitted }} empty ads.</p>
    <p><strong>Newest ad first:</strong></p>

    <ul v-for="ad in listAds" v-if="ad">
      <li>
        <Ad :showNSFW="showNSFW" :ad="ad"></Ad>
      </li>
    </ul>
  </div>
</template>

<script>
import Ad from './Ad.vue'

export default {
  props: ["showNSFW"],
  data() {
    return {
      omitted: 0,
      num: 0,
    }
  },
  computed: {
    listAds() {
      let omitted = 0, num = 0;
      const ads = [];
      var adsList = this.$store.state.ads;
      for (var i=0; i< adsList.length;i++) {
        if (!adsList[i] || !(adsList[i].image.trim().length>0 || (adsList[i].title!=undefined && !(adsList[i].title==="")))) {
          omitted += 1;
        }
        else{
        num += 1;
        ads.push(adsList[i]);
        }
      }
      ads.reverse();
      this.omitted = omitted;
      this.num = num;
      return ads;
    },
  },
  components: {
    Ad,
  },
}
</script>
