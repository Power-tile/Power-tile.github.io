let app = new Vue({
    el: "#math-simulation-lottery",
    data: {
        prizeNumbers: {
            white: [],
            red: 0,
        },
        prizeInfo: [[9, 8], [9, 7], [9, 6], [5, 4], [3, 2], [1, 0]],
        prizeNames: ["5+1", "5+0", "4+1", "4+0", "3+1", "3+0", "2+1", "1+1", "0+1", "NULL"],
        prizeCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        winningData: [], // lottery that wins a prize
        randomData: [], // all lottery data
        addCount: 1,
    },
    methods: {
        randIntBetween: function(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        },
        generateNumbers: function() {
            let ret = {
                white: [],
                red: 0
            };

            while (ret.white.length < 5) {
                let newNumber = this.randIntBetween(1, 69);
                if (!ret.white.includes(newNumber)) ret.white.push(newNumber);
            }
            ret.red = this.randIntBetween(1, 26);

            return ret;
        },
        init: function() {
            this.$set(this, "winningData", []);
            this.$set(this, "randomData", []);
            this.$set(this, "prizeNumbers", this.generateNumbers());
            this.$set(this, "prizeCount", []);
            for (let i = 0; i < 10; i++) this.prizeCount.push(0);
        },
        checkNumber: function(data) {
            let white = 0, red = 0;

            data.white.forEach((curr, index) => {
                if (this.prizeNumbers.white.includes(curr)) {
                    white++;
                }
            });
            red = 1 * (data.red === this.prizeNumbers.red);            

            let index = this.prizeInfo[white][red];
            this.prizeCount[index]++;
            return index !== 9;
        },
        addNumber: function(size) {
            if (this.prizeNumbers.white.length === 0 || size < 0 || size > 50000 || Math.abs(Math.trunc(addCount) - addCount) > 0.000001) return;
            for (let i = 0; i < size; i++) {
                this.randomData.push(this.generateNumbers());
            }
        }
    },
    computed: {
        computedRandomData: function() {
            return JSON.parse(JSON.stringify(this.randomData));
        }
    },
    watch: {
        computedRandomData: {
            handler: function(newVal, oldVal) {
                if (newVal.length > oldVal.length) {
                    for (let i = oldVal.length; i < newVal.length; i++) {
                        if (this.checkNumber(newVal[i])) {
                            this.winningData.push(newVal[i]);
                        }
                    }
                }
            },
            deep: true
        },
    }
});