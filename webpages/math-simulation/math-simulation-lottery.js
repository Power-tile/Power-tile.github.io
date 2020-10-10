let app = new Vue({
    el: "#math-simulation-lottery",
    data: {
        prizeNumbers: {
            white: [],
            red: 0,
        },
        prizeInfo: [[9, 8], [9, 7], [9, 6], [5, 4], [3, 2], [1, 0]], // connection between awards and numbers
        prizeAmountInfo: [0, 1000000, 50000, 100, 100, 7, 7, 4, 4, 0], // prize of awards
        prizeNames: ["5+1", "5+0", "4+1", "4+0", "3+1", "3+0", "2+1", "1+1", "0+1", "NULL"], // name of awards
        moneyPerLottery: 2, // money spent for buying one lottery
        prizeCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        winningData: [], // lottery that wins a prize
        randomData: [], // all lottery data
        addCount: 1,
        moneySpent: 0,
        moneyAwarded: 0,
        hasGrandPrize: false,
    },
    methods: {
        randIntBetween: function(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        },
        sampleIntWithoutRepitition: function(min, max, count) {
            let ret = [];
            while (ret.length < count) {
                let newNumber = this.randIntBetween(min, max);
                if (!ret.includes(newNumber)) ret.push(newNumber);
            }
            return ret;                            
        },
        generateNumbers: function() {
            return {
                white: this.sampleIntWithoutRepitition(1, 69, 5),
                red: this.sampleIntWithoutRepitition(1, 26, 1)[0]
            };
        },
        init: function() {
            this.$set(this, "winningData", []);
            this.$set(this, "randomData", []);
            this.$set(this, "prizeNumbers", this.generateNumbers());
            this.$set(this, "prizeCount", []);
            for (let i = 0; i < 10; i++) this.prizeCount.push(0);

            this.moneySpent = 0;
            this.moneyAwarded = 0;
            this.hasGrandPrize = false;
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
            if (index > 0 && index < 9) {
                this.moneyAwarded += this.prizeAmountInfo[index];
            } else if (index === 0) {
                this.hasGrandPrize = true;
            }
            return index !== 9;
        },
        addNumber: function(size) {
            if (this.prizeNumbers.white.length === 0 || size < 0 || size > 50000 || Math.abs(Math.trunc(this.addCount) - this.addCount) > 0.000001) return;
            for (let i = 0; i < size; i++) {
                this.randomData.push(this.generateNumbers());
                this.moneySpent += this.moneyPerLottery;
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