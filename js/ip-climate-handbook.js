let climate = new Vue({
    id: "#climate",
    data: function() {
        return {};
    },
    mounted: function() {
        console.log("Vue loaded");
        console.log(this.$refs.menuWrapper.offsetWidth);
        this.$refs.menuMinorWrapper.style.width = this.$refs.menuWrapper.offsetWidth;
    }
})