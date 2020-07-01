let app = new Vue({
    id: "#climate-handbook",
    mounted: function() {
        console.log(this.$refs.menuWrapper.offsetWidth);
        this.$refs.menuMinorWrapper.style.width = this.$refs.menuWrapper.offsetWidth;
    }
})