<style lang="scss">
form {
  margin-bottom: 2em;
  
}
label {
  display: block;
  margin-bottom: 0.5em;
  span {
    display: inline-block;
    min-width: 6em;
  }
}
input {
  width: 200px;
}

.editAd {
  border-left: 10px solid #eee;
  padding-left: 10px;

  .previewAd img {
    display: block;
    overflow: hidden;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.7);
    white-space: nowrap;
  }

  small {
    color: #966;
    margin: 0.5em;
    display: inline-block;
  }

  input[type="submit"] {
    font-size: 1em;
    padding: 5px;
    background: #fff8db;
    display: block;
    border-width: 2px;
  }

  .mini-adGrid {
    padding: 10px;
    background: #ddd;
    margin-bottom: 1em;
  }
}


</style>

<template>
  <div id="adPublish">
    <form v-if="$store.state.ads.length > 0" v-on:submit='forceNSFW' v-on:submit.prevent>
      <select v-model="ad">
        <option disabled value="">Select ad to check</option>
        <option v-for="ad of $store.state.ads" :value="ad">
          {{ad.width*10}}x{{ad.height*10}}px at ({{ad.x}}, {{ad.y}}): {{ ad.link || "(no link)" }}
        </option>
      </select>
      <div v-if="ad" class="editAd">
        <p>
          What do you want your ad to look like? Some rules:
        </p>
        <ul>
          <li>If your ad contains adult content, please self-mark it as NSFW. NSFW ads are opt-in by viewers. You can change it later if you self-mark as NSFW.</li>
          <li>Don't link to, or put, inappropriate or illegal content in the ad.</li>
          <li><strong>Keep your image size small, under 100KB.</strong> PNG is preferred, but JPG or non-animated GIF is acceptable.</li>
          <li>If your ad breaks any rules, it can be forced to NSFW by the moderators of this contract and then only a moderator can change it back to non-NSFW.</li>
        </ul>
        <label>
          <span>Title</span>
          <input type="text" v-model="ad.title" placeholder="Come visit MyCorp" disabled/>
        </label>
        <label>
          <span>Link</span>
          <input type="text" v-model="ad.link" placeholder="https://..." disabled/>
          <small class="error" v-if="ad.link && ad.link.indexOf('://') === -1">Missing https://?</small>
        </label>
        <label>
          <span>Image</span>
          <input type="text" v-model="ad.image" placeholder="https://...." disabled/>
          <small>URL to PNG image. Can be <code>https://</code>, <code>ipfs://</code>, <code>bzz://</code>, or <code>data:image/png,base64,...</code> encoded.<br />Must be less than 100KB.</small>
        </label>
        <label>
          <span>NSFW</span>
          <input type="checkbox" v-model="ad.NSFW" disabled/>
        </label>
        <label>
          <span>Force NSFW</span>
          <input type="checkbox" v-model="ad.forcedNSFW" />
        </label>
        <div>
          <h3>Preview <small>(not published yet)</small></h3>
          <div class="mini-adGrid">
            <Ad :showNSFW="showNSFW" :ad="ad" class="previewAd"></Ad>
          </div>
        </div>
        <input type="submit" value="Publish Changes" />
        <small>
          It can take between 10 seconds to a few minutes for your published ad
          to get mined into the blockchain and show up. The fees are paid to miners
          to get the changes into the next block.
        </small>
      </div>
    </form>
    <p v-else>
      No ads. Listening to Purchase events on the blockchain...
    </p>

    <p v-if="error" class="error">
      {{ error }}
    </p>
  </div>
</template>

<script>
import Ad from './Ad.vue'

export default {
  props: ["web3", "contract", "showNSFW"],
  data() {
    return {
      ad: false,
      error: null,
    }
  },
  methods: {
    forceNSFW() {
      ga('send', {
        hitType: 'event',
        eventCategory: this.contract._network,
        eventAction: 'forcensfw-submit',
      });
      this.contract.forceNSFW.sendTransaction(this.ad.idx, Number(this.ad.forcedNSFW), { from: this.$store.state.activeAccount }, function(err, res) {
        ga('send', {
          hitType: 'event',
          eventCategory: this.contract._network,
          eventAction: 'fnsw-error',
          eventLabel: JSON.stringify(err),
        });

        this.ad = false;
        if (err) {
          this.error = err;
          return;
        }
        ga('send', {
          hitType: 'event',
          eventCategory: this.contract._network,
          eventAction: 'fnsw-success',
        });
      }.bind(this));
      return false;
    },
  },
  components: {
    Ad,
  },
}
</script>
